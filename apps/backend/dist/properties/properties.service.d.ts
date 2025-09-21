import { SupabaseService } from '../database/supabase.service';
import { Property, PropertyStatus, AreaUnit, UserRole } from '../database/types/database.types';
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
export declare class PropertiesService {
    private supabase;
    constructor(supabase: SupabaseService);
    create(createPropertyDto: CreatePropertyDto, sellerId: string): Promise<Property>;
    findAll(filters?: PropertyFilterDto, sort?: PropertySortDto): Promise<{
        properties: {}[];
        pagination: {
            page: number;
            pageSize: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<Property>;
    update(id: string, updatePropertyDto: UpdatePropertyDto, userId: string, userRole: UserRole): Promise<Property>;
    remove(id: string, userId: string, userRole: UserRole): Promise<{
        message: string;
    }>;
    search(searchTerm: string, filters?: PropertyFilterDto): Promise<{}[]>;
    getSellerProperties(sellerId: string, filters?: PropertyFilterDto): Promise<{
        properties: {}[];
        pagination: {
            page: number;
            pageSize: number;
            total: number;
            totalPages: number;
        };
    }>;
    updateStatus(id: string, status: PropertyStatus, userId: string, userRole: UserRole): Promise<Property>;
    getCities(): Promise<string[]>;
    getPropertyTypes(): Promise<string[]>;
}
