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
exports.PropertiesService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../database/supabase.service");
let PropertiesService = class PropertiesService {
    supabase;
    constructor(supabase) {
        this.supabase = supabase;
    }
    async create(createPropertyDto, sellerId) {
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
    async findAll(filters = {}, sort = {}) {
        const { search, city, minPrice, maxPrice, propertyType, minBedrooms, hasLawn, status, sellerId, } = filters;
        const { sortBy = 'newest', page = 1, pageSize = 8 } = sort;
        let query = this.supabase
            .getClient()
            .from('properties')
            .select('*', { count: 'exact' });
        if (status) {
            query = query.eq('status', status);
        }
        else if (!sellerId) {
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
            query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,address.ilike.%${search}%,city.ilike.%${search}%`);
        }
        const skip = (page - 1) * pageSize;
        let orderBy;
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
        const { data: properties, count, error, } = await query
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
    async findOne(id) {
        const { data: property, error } = await this.supabase
            .getClient()
            .from('properties')
            .select(`
        *,
        seller:users!properties_seller_id_fkey(
          id,
          name,
          email,
          phone
        )
      `)
            .eq('id', id)
            .single();
        if (error || !property) {
            throw new common_1.NotFoundException('Property not found');
        }
        return property;
    }
    async update(id, updatePropertyDto, userId, userRole) {
        const property = await this.findOne(id);
        if (userRole !== 'admin' && property.seller_id !== userId) {
            throw new common_1.ForbiddenException('You can only update your own properties');
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
    async remove(id, userId, userRole) {
        const property = await this.findOne(id);
        if (userRole !== 'admin' && property.seller_id !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own properties');
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
    async search(searchTerm, filters = {}) {
        let query = this.supabase.getClient().from('properties').select('*');
        query = query.in('status', ['Available', 'Pending']);
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
        if (searchTerm) {
            query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,property_type.ilike.%${searchTerm}%`);
        }
        const { data: properties, error } = await query.order('created_at', {
            ascending: false,
        });
        if (error) {
            throw new Error(`Failed to search properties: ${error.message}`);
        }
        return properties || [];
    }
    async getSellerProperties(sellerId, filters = {}) {
        return this.findAll({ ...filters, sellerId });
    }
    async updateStatus(id, status, userId, userRole) {
        const property = await this.findOne(id);
        if (userRole !== 'admin' && property.seller_id !== userId) {
            throw new common_1.ForbiddenException('You can only update your own properties');
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
    async getCities() {
        const { data: cities, error } = await this.supabase
            .getClient()
            .from('properties')
            .select('city')
            .in('status', ['Available', 'Pending'])
            .order('city', { ascending: true });
        if (error) {
            throw new Error(`Failed to fetch cities: ${error.message}`);
        }
        const uniqueCities = [...new Set(cities?.map((city) => city.city) || [])];
        return uniqueCities;
    }
    async getPropertyTypes() {
        const { data: types, error } = await this.supabase
            .getClient()
            .from('properties')
            .select('property_type')
            .in('status', ['Available', 'Pending'])
            .order('property_type', { ascending: true });
        if (error) {
            throw new Error(`Failed to fetch property types: ${error.message}`);
        }
        const uniqueTypes = [
            ...new Set(types?.map((type) => type.property_type) || []),
        ];
        return uniqueTypes;
    }
};
exports.PropertiesService = PropertiesService;
exports.PropertiesService = PropertiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], PropertiesService);
//# sourceMappingURL=properties.service.js.map