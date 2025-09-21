import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';
import {
  Property,
  PropertyStatus,
  AreaUnit,
  UserRole,
} from '../database/types/database.types';

export interface PropertyCoordinates {
  latitude: number;
  longitude: number;
}

export interface CreatePropertyDto {
  title: string;
  description: string;
  price: number;
  area: number;
  areaUnit: AreaUnit;
  bedrooms: number;
  floors: number;
  kitchens: number;
  hasLawn: boolean;
  additionalInfo?: string;
  address: string;
  city: string;
  images: string[];
  sellerPhone: string;
  sellerName: string;
  propertyType: string;
  coordinates?: PropertyCoordinates;
}

export interface UpdatePropertyDto {
  title?: string;
  description?: string;
  price?: number;
  area?: number;
  areaUnit?: AreaUnit;
  bedrooms?: number;
  floors?: number;
  kitchens?: number;
  hasLawn?: boolean;
  additionalInfo?: string;
  address?: string;
  city?: string;
  images?: string[];
  sellerPhone?: string;
  sellerName?: string;
  status?: PropertyStatus;
  propertyType?: string;
  coordinates?: PropertyCoordinates;
}

export interface PropertyFilterDto {
  search?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  minBedrooms?: number;
  hasLawn?: boolean;
  status?: PropertyStatus;
  sellerId?: string;
}

export interface PropertySortDto {
  sortBy?: 'newest' | 'price-low' | 'price-high' | 'area-high';
  page?: number;
  pageSize?: number;
}

@Injectable()
export class PropertiesService {
  constructor(private supabase: SupabaseService) {}

  async create(
    createPropertyDto: CreatePropertyDto,
    sellerId: string,
  ): Promise<Property> {
    const propertyData = {
      ...createPropertyDto,
      seller_id: sellerId,
      coordinates: createPropertyDto.coordinates,
      area_unit: createPropertyDto.areaUnit,
      has_lawn: createPropertyDto.hasLawn,
      additional_info: createPropertyDto.additionalInfo,
      seller_phone: createPropertyDto.sellerPhone,
      seller_name: createPropertyDto.sellerName,
      property_type: createPropertyDto.propertyType,
    };

    const { data: property, error } = await this.supabase
      .getClient()
      .from('properties')
      .insert(propertyData)
      .select()
      .single();

    if (error || !property) {
      throw new Error(`Failed to create property: ${error?.message}`);
    }

    return property;
  }

  async findAll(filters: PropertyFilterDto = {}, sort: PropertySortDto = {}) {
    const {
      search,
      city,
      minPrice,
      maxPrice,
      propertyType,
      minBedrooms,
      hasLawn,
      status,
      sellerId,
    } = filters;
    const { sortBy = 'newest', page = 1, pageSize = 8 } = sort;

    let query = this.supabase
      .getClient()
      .from('properties')
      .select('*', { count: 'exact' });

    // Status filter - default to available for public searches
    if (status) {
      query = query.eq('status', status);
    } else if (!sellerId) {
      // If not filtering by seller, only show available and pending properties
      query = query.in('status', ['Available', 'Pending']);
    }

    if (sellerId) {
      query = query.eq('seller_id', sellerId);
    }

    if (city) {
      query = query.ilike('city', `%${city}%`);
    }

    if (minPrice !== undefined) {
      query = query.gte('price', minPrice);
    }

    if (maxPrice !== undefined) {
      query = query.lte('price', maxPrice);
    }

    if (propertyType) {
      query = query.ilike('property_type', `%${propertyType}%`);
    }

    if (minBedrooms !== undefined) {
      query = query.gte('bedrooms', minBedrooms);
    }

    if (hasLawn !== undefined) {
      query = query.eq('has_lawn', hasLawn);
    }

    if (search) {
      query = query.or(
        `title.ilike.%${search}%,description.ilike.%${search}%,address.ilike.%${search}%,city.ilike.%${search}%`,
      );
    }

    const skip = (page - 1) * pageSize;

    let orderBy: { column: string; ascending: boolean };
    switch (sortBy) {
      case 'price-low':
        orderBy = { column: 'price', ascending: true };
        break;
      case 'price-high':
        orderBy = { column: 'price', ascending: false };
        break;
      case 'area-high':
        orderBy = { column: 'area', ascending: false };
        break;
      default:
        orderBy = { column: 'created_at', ascending: false };
    }

    const {
      data: properties,
      count,
      error,
    } = await query
      .order(orderBy.column, { ascending: orderBy.ascending })
      .range(skip, skip + pageSize - 1);

    if (error) {
      throw new Error(`Failed to fetch properties: ${error.message}`);
    }

    return {
      properties: properties || [],
      pagination: {
        page,
        pageSize,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
    };
  }

  async findOne(id: string): Promise<Property> {
    const { data: property, error } = await this.supabase
      .getClient()
      .from('properties')
      .select(
        `
        *,
        seller:users!properties_seller_id_fkey(
          id,
          name,
          email,
          phone
        )
      `,
      )
      .eq('id', id)
      .single();

    if (error || !property) {
      throw new NotFoundException('Property not found');
    }

    return property as any;
  }

  async update(
    id: string,
    updatePropertyDto: UpdatePropertyDto,
    userId: string,
    userRole: UserRole,
  ): Promise<Property> {
    const property = await this.findOne(id);

    // Check permissions - only seller owner or admin can update
    if (userRole !== 'admin' && property.seller_id !== userId) {
      throw new ForbiddenException('You can only update your own properties');
    }

    const updateData = {
      ...updatePropertyDto,
      coordinates: updatePropertyDto.coordinates,
      area_unit: updatePropertyDto.areaUnit,
      has_lawn: updatePropertyDto.hasLawn,
      additional_info: updatePropertyDto.additionalInfo,
      seller_phone: updatePropertyDto.sellerPhone,
      seller_name: updatePropertyDto.sellerName,
      property_type: updatePropertyDto.propertyType,
    };

    const { data: updatedProperty, error } = await this.supabase
      .getClient()
      .from('properties')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !updatedProperty) {
      throw new Error(`Failed to update property: ${error?.message}`);
    }

    return updatedProperty;
  }

  async remove(
    id: string,
    userId: string,
    userRole: UserRole,
  ): Promise<{ message: string }> {
    const property = await this.findOne(id);

    // Check permissions - only seller owner or admin can delete
    if (userRole !== 'admin' && property.seller_id !== userId) {
      throw new ForbiddenException('You can only delete your own properties');
    }

    const { error } = await this.supabase
      .getClient()
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete property: ${error.message}`);
    }

    return { message: 'Property deleted successfully' };
  }

  async search(searchTerm: string, filters: PropertyFilterDto = {}) {
    let query = this.supabase.getClient().from('properties').select('*');

    // Apply status filter
    query = query.in('status', ['Available', 'Pending']);

    // Apply filters
    if (filters.city) {
      query = query.ilike('city', `%${filters.city}%`);
    }
    if (filters.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }
    if (filters.propertyType) {
      query = query.ilike('property_type', `%${filters.propertyType}%`);
    }
    if (filters.minBedrooms !== undefined) {
      query = query.gte('bedrooms', filters.minBedrooms);
    }
    if (filters.hasLawn !== undefined) {
      query = query.eq('has_lawn', filters.hasLawn);
    }

    // Add search term
    if (searchTerm) {
      query = query.or(
        `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,property_type.ilike.%${searchTerm}%`,
      );
    }

    const { data: properties, error } = await query.order('created_at', {
      ascending: false,
    });

    if (error) {
      throw new Error(`Failed to search properties: ${error.message}`);
    }

    return properties || [];
  }

  async getSellerProperties(sellerId: string, filters: PropertyFilterDto = {}) {
    return this.findAll({ ...filters, sellerId });
  }

  async updateStatus(
    id: string,
    status: PropertyStatus,
    userId: string,
    userRole: UserRole,
  ): Promise<Property> {
    const property = await this.findOne(id);

    // Check permissions - only seller owner or admin can update status
    if (userRole !== 'admin' && property.seller_id !== userId) {
      throw new ForbiddenException('You can only update your own properties');
    }

    const { data: updatedProperty, error } = await this.supabase
      .getClient()
      .from('properties')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error || !updatedProperty) {
      throw new Error(`Failed to update property status: ${error?.message}`);
    }

    return updatedProperty;
  }

  async getCities(): Promise<string[]> {
    const { data: cities, error } = await this.supabase
      .getClient()
      .from('properties')
      .select('city')
      .in('status', ['Available', 'Pending'])
      .order('city', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch cities: ${error.message}`);
    }

    // Get unique cities
    const uniqueCities = [...new Set(cities?.map((city) => city.city) || [])];
    return uniqueCities;
  }

  async getPropertyTypes(): Promise<string[]> {
    const { data: types, error } = await this.supabase
      .getClient()
      .from('properties')
      .select('property_type')
      .in('status', ['Available', 'Pending'])
      .order('property_type', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch property types: ${error.message}`);
    }

    // Get unique property types
    const uniqueTypes = [
      ...new Set(types?.map((type) => type.property_type) || []),
    ];
    return uniqueTypes;
  }
}
