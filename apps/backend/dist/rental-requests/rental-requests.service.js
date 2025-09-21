"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalRequestsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../database/supabase.service");
let RentalRequestsService = class RentalRequestsService {
    supabase;
    constructor(supabase) {
        this.supabase = supabase;
    }
    async create(createRentalRequestDto, buyerId) {
        const { propertyId, proposedPrice, duration, message } = createRentalRequestDto;
        const { data: property, error: propertyError } = await this.supabase
            .getClient()
            .from('properties')
            .select('*')
            .eq('id', propertyId)
            .single();
        if (propertyError || !property) {
            throw new common_1.NotFoundException('Property not found');
        }
        if (property.status === 'Rented') {
            throw new common_1.ConflictException('Property is already rented');
        }
        const { data: existingRequest } = await this.supabase
            .getClient()
            .from('rental_requests')
            .select('*')
            .eq('property_id', propertyId)
            .eq('buyer_id', buyerId)
            .eq('status', 'pending')
            .single();
        if (existingRequest) {
            throw new common_1.ConflictException('You already have a pending request for this property');
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
            .select(`
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
      `)
            .single();
        if (error || !rentalRequest) {
            throw new Error(`Failed to create rental request: ${error?.message}`);
        }
        return rentalRequest;
    }
    async findAll(filters = {}) {
        const { propertyId, buyerId, sellerId, status, page = 1, pageSize = 10, } = filters;
        let query = this.supabase
            .getClient()
            .from('rental_requests')
            .select(`
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
    `, { count: 'exact' });
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
        const { data: requests, count, error, } = await query
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
    async findOne(id) {
        const { data: request, error } = await this.supabase
            .getClient()
            .from('rental_requests')
            .select(`
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
      `)
            .eq('id', id)
            .single();
        if (error || !request) {
            throw new common_1.NotFoundException('Rental request not found');
        }
        return request;
    }
    async update(id, updateRentalRequestDto, userId, userRole) {
        const request = await this.findOne(id);
        const isBuyer = request.buyer_id === userId;
        const isSeller = request.property?.seller_id === userId;
        const isAdmin = userRole === 'admin';
        if (!isBuyer && !isSeller && !isAdmin) {
            throw new common_1.ForbiddenException('You can only update requests related to your properties or requests');
        }
        if (isBuyer && !isSeller && !isAdmin) {
            if (request.status !== 'pending') {
                throw new common_1.ForbiddenException('You can only update pending requests');
            }
            if (updateRentalRequestDto.status) {
                throw new common_1.ForbiddenException('Buyers cannot update request status');
            }
        }
        if (updateRentalRequestDto.status === 'approved' &&
            request.status !== 'approved') {
            await this.supabase
                .getClient()
                .from('rental_requests')
                .update({ status: 'rejected' })
                .eq('property_id', request.property_id)
                .eq('status', 'pending')
                .neq('id', id);
            await this.supabase
                .getClient()
                .from('properties')
                .update({ status: 'Rented' })
                .eq('id', request.property_id);
        }
        if (request.status === 'approved' &&
            updateRentalRequestDto.status &&
            updateRentalRequestDto.status !== 'approved') {
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
            .select(`
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
      `)
            .single();
        if (error || !updatedRequest) {
            throw new Error(`Failed to update rental request: ${error?.message}`);
        }
        return updatedRequest;
    }
    async remove(id, userId, userRole) {
        const request = await this.findOne(id);
        const isBuyer = request.buyer_id === userId;
        const isSeller = request.property?.seller_id === userId;
        const isAdmin = userRole === 'admin';
        if (!isBuyer && !isSeller && !isAdmin) {
            throw new common_1.ForbiddenException('You can only delete your own requests');
        }
        if (isBuyer && !isSeller && !isAdmin && request.status !== 'pending') {
            throw new common_1.ForbiddenException('You can only delete pending requests');
        }
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
    async getBuyerRequests(buyerId, filters = {}) {
        return this.findAll({ ...filters, buyerId });
    }
    async getSellerRequests(sellerId, filters = {}) {
        return this.findAll({ ...filters, sellerId });
    }
    async getPropertyRequests(propertyId, userId, userRole, filters = {}) {
        const { data: property, error } = await this.supabase
            .getClient()
            .from('properties')
            .select('*')
            .eq('id', propertyId)
            .single();
        if (error || !property) {
            throw new common_1.NotFoundException('Property not found');
        }
        if (userRole !== 'admin' && property.seller_id !== userId) {
            throw new common_1.ForbiddenException('You can only view requests for your own properties');
        }
        return this.findAll({ ...filters, propertyId });
    }
    async approveRequest(id, userId, userRole) {
        return this.update(id, { status: 'approved' }, userId, userRole);
    }
    async rejectRequest(id, userId, userRole) {
        return this.update(id, { status: 'rejected' }, userId, userRole);
    }
};
exports.RentalRequestsService = RentalRequestsService;
exports.RentalRequestsService = RentalRequestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], RentalRequestsService);
//# sourceMappingURL=rental-requests.service.js.map