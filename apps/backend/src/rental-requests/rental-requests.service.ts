import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';
import {
  RentalRequest,
  RequestStatus,
  UserRole,
} from '../database/types/database.types';

export interface CreateRentalRequestDto {
  propertyId: string;
  proposedPrice: number;
  duration: number;
  message?: string;
}

export interface UpdateRentalRequestDto {
  proposedPrice?: number;
  duration?: number;
  message?: string;
  status?: RequestStatus;
}

export interface RentalRequestFilterDto {
  propertyId?: string;
  buyerId?: string;
  sellerId?: string;
  status?: RequestStatus;
  page?: number;
  pageSize?: number;
}

@Injectable()
export class RentalRequestsService {
  constructor(private supabase: SupabaseService) {}

  async create(
    createRentalRequestDto: CreateRentalRequestDto,
    buyerId: string,
  ): Promise<RentalRequest> {
    const { propertyId, proposedPrice, duration, message } =
      createRentalRequestDto;

    // Check if property exists and is available
    const { data: property, error: propertyError } = await this.supabase
      .getClient()
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();

    if (propertyError || !property) {
      throw new NotFoundException('Property not found');
    }

    if (property.status === 'Rented') {
      throw new ConflictException('Property is already rented');
    }

    // Check if buyer already has a pending request for this property
    const { data: existingRequest } = await this.supabase
      .getClient()
      .from('rental_requests')
      .select('*')
      .eq('property_id', propertyId)
      .eq('buyer_id', buyerId)
      .eq('status', 'pending')
      .single();

    if (existingRequest) {
      throw new ConflictException(
        'You already have a pending request for this property',
      );
    }

    const { data: rentalRequest, error } = await this.supabase
      .getClient()
      .from('rental_requests')
      .insert({
        property_id: propertyId,
        buyer_id: buyerId,
        proposed_price: proposedPrice,
        duration,
        message,
      })
      .select(
        `
        *,
        property:properties!rental_requests_property_id_fkey(
          id,
          title,
          price,
          address,
          city,
          images
        ),
        buyer:users!rental_requests_buyer_id_fkey(
          id,
          name,
          email,
          phone
        )
      `,
      )
      .single();

    if (error || !rentalRequest) {
      throw new Error(`Failed to create rental request: ${error?.message}`);
    }

    return rentalRequest as any;
  }

  async findAll(filters: RentalRequestFilterDto = {}) {
    const {
      propertyId,
      buyerId,
      sellerId,
      status,
      page = 1,
      pageSize = 10,
    } = filters;

    let query = this.supabase
      .getClient()
      .from('rental_requests')
      .select(
        `
      *,
      property:properties!rental_requests_property_id_fkey(
        id,
        title,
        price,
        address,
        city,
        images,
        seller_id
      ),
      buyer:users!rental_requests_buyer_id_fkey(
        id,
        name,
        email,
        phone
      )
    `,
        { count: 'exact' },
      );

    if (propertyId) {
      query = query.eq('property_id', propertyId);
    }

    if (buyerId) {
      query = query.eq('buyer_id', buyerId);
    }

    if (sellerId) {
      query = query.eq('property.seller_id', sellerId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const skip = (page - 1) * pageSize;

    const {
      data: requests,
      count,
      error,
    } = await query
      .order('created_at', { ascending: false })
      .range(skip, skip + pageSize - 1);

    if (error) {
      throw new Error(`Failed to fetch rental requests: ${error.message}`);
    }

    return {
      requests: requests || [],
      pagination: {
        page,
        pageSize,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
    };
  }

  async findOne(id: string): Promise<RentalRequest> {
    const { data: request, error } = await this.supabase
      .getClient()
      .from('rental_requests')
      .select(
        `
        *,
        property:properties!rental_requests_property_id_fkey(
          *,
          seller:users!properties_seller_id_fkey(
            id,
            name,
            email,
            phone
          )
        ),
        buyer:users!rental_requests_buyer_id_fkey(
          id,
          name,
          email,
          phone
        )
      `,
      )
      .eq('id', id)
      .single();

    if (error || !request) {
      throw new NotFoundException('Rental request not found');
    }

    return request as any;
  }

  async update(
    id: string,
    updateRentalRequestDto: UpdateRentalRequestDto,
    userId: string,
    userRole: UserRole,
  ): Promise<RentalRequest> {
    const request = await this.findOne(id);

    // Check permissions
    const isBuyer = request.buyer_id === userId;
    const isSeller = (request as any).property?.seller_id === userId;
    const isAdmin = userRole === 'admin';

    if (!isBuyer && !isSeller && !isAdmin) {
      throw new ForbiddenException(
        'You can only update requests related to your properties or requests',
      );
    }

    // Buyers can only update their own pending requests (not status)
    if (isBuyer && !isSeller && !isAdmin) {
      if (request.status !== 'pending') {
        throw new ForbiddenException('You can only update pending requests');
      }
      if (updateRentalRequestDto.status) {
        throw new ForbiddenException('Buyers cannot update request status');
      }
    }

    // If status is being changed to approved, update property status
    if (
      updateRentalRequestDto.status === 'approved' &&
      request.status !== 'approved'
    ) {
      // Reject all other pending requests for this property
      await this.supabase
        .getClient()
        .from('rental_requests')
        .update({ status: 'rejected' })
        .eq('property_id', request.property_id)
        .eq('status', 'pending')
        .neq('id', id);

      // Update property status to Rented
      await this.supabase
        .getClient()
        .from('properties')
        .update({ status: 'Rented' })
        .eq('id', request.property_id);
    }

    // If status is being changed from approved to rejected/pending, update property status back
    if (
      request.status === 'approved' &&
      updateRentalRequestDto.status &&
      updateRentalRequestDto.status !== 'approved'
    ) {
      await this.supabase
        .getClient()
        .from('properties')
        .update({ status: 'Available' })
        .eq('id', request.property_id);
    }

    const { data: updatedRequest, error } = await this.supabase
      .getClient()
      .from('rental_requests')
      .update(updateRentalRequestDto)
      .eq('id', id)
      .select(
        `
        *,
        property:properties!rental_requests_property_id_fkey(
          id,
          title,
          price,
          address,
          city,
          images
        ),
        buyer:users!rental_requests_buyer_id_fkey(
          id,
          name,
          email,
          phone
        )
      `,
      )
      .single();

    if (error || !updatedRequest) {
      throw new Error(`Failed to update rental request: ${error?.message}`);
    }

    return updatedRequest as any;
  }

  async remove(
    id: string,
    userId: string,
    userRole: UserRole,
  ): Promise<{ message: string }> {
    const request = await this.findOne(id);

    // Check permissions - buyers can delete their own pending requests, sellers/admins can delete any
    const isBuyer = request.buyer_id === userId;
    const isSeller = (request as any).property?.seller_id === userId;
    const isAdmin = userRole === 'admin';

    if (!isBuyer && !isSeller && !isAdmin) {
      throw new ForbiddenException('You can only delete your own requests');
    }

    // Buyers can only delete pending requests
    if (isBuyer && !isSeller && !isAdmin && request.status !== 'pending') {
      throw new ForbiddenException('You can only delete pending requests');
    }

    // If deleting an approved request, update property status
    if (request.status === 'approved') {
      await this.supabase
        .getClient()
        .from('properties')
        .update({ status: 'Available' })
        .eq('id', request.property_id);
    }

    const { error } = await this.supabase
      .getClient()
      .from('rental_requests')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete rental request: ${error.message}`);
    }

    return { message: 'Rental request deleted successfully' };
  }

  async getBuyerRequests(
    buyerId: string,
    filters: RentalRequestFilterDto = {},
  ) {
    return this.findAll({ ...filters, buyerId });
  }

  async getSellerRequests(
    sellerId: string,
    filters: RentalRequestFilterDto = {},
  ) {
    return this.findAll({ ...filters, sellerId });
  }

  async getPropertyRequests(
    propertyId: string,
    userId: string,
    userRole: UserRole,
    filters: RentalRequestFilterDto = {},
  ) {
    // Verify user has access to this property's requests
    const { data: property, error } = await this.supabase
      .getClient()
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();

    if (error || !property) {
      throw new NotFoundException('Property not found');
    }

    if (userRole !== 'admin' && property.seller_id !== userId) {
      throw new ForbiddenException(
        'You can only view requests for your own properties',
      );
    }

    return this.findAll({ ...filters, propertyId });
  }

  async approveRequest(
    id: string,
    userId: string,
    userRole: UserRole,
  ): Promise<RentalRequest> {
    return this.update(id, { status: 'approved' }, userId, userRole);
  }

  async rejectRequest(
    id: string,
    userId: string,
    userRole: UserRole,
  ): Promise<RentalRequest> {
    return this.update(id, { status: 'rejected' }, userId, userRole);
  }
}
