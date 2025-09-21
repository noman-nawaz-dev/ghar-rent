import { PropertiesService, CreatePropertyDto, UpdatePropertyDto } from './properties.service';
import { User, PropertyStatus } from '../database/types/database.types';
export declare class PropertiesController {
    private readonly propertiesService;
    constructor(propertiesService: PropertiesService);
    findAll(search?: string, city?: string, minPrice?: number, maxPrice?: number, propertyType?: string, minBedrooms?: number, hasLawn?: boolean, sortBy?: 'newest' | 'price-low' | 'price-high' | 'area-high', page?: number, pageSize?: number): Promise<{
        properties: {}[];
        pagination: {
            page: number;
            pageSize: number;
            total: number;
            totalPages: number;
        };
    }>;
    search(searchTerm: string, city?: string, minPrice?: number, maxPrice?: number, propertyType?: string, minBedrooms?: number, hasLawn?: boolean): Promise<{}[]>;
    getCities(): Promise<string[]>;
    getPropertyTypes(): Promise<string[]>;
    getMyProperties(user: User, status?: PropertyStatus): Promise<{
        properties: {}[];
        pagination: {
            page: number;
            pageSize: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        id: string;
        title: string;
        description: string;
        price: number;
        area: number;
        area_unit: "Marla" | "Kanal";
        bedrooms: number;
        floors: number;
        kitchens: number;
        has_lawn: boolean;
        additional_info: string | null;
        address: string;
        city: string;
        images: string[];
        seller_id: string;
        seller_phone: string;
        seller_name: string;
        listed_date: string;
        status: "Available" | "Pending" | "Rented";
        property_type: string;
        coordinates: {
            latitude: number;
            longitude: number;
        } | null;
        created_at: string;
        updated_at: string;
    }>;
    create(createPropertyDto: CreatePropertyDto, user: User): Promise<{
        id: string;
        title: string;
        description: string;
        price: number;
        area: number;
        area_unit: "Marla" | "Kanal";
        bedrooms: number;
        floors: number;
        kitchens: number;
        has_lawn: boolean;
        additional_info: string | null;
        address: string;
        city: string;
        images: string[];
        seller_id: string;
        seller_phone: string;
        seller_name: string;
        listed_date: string;
        status: "Available" | "Pending" | "Rented";
        property_type: string;
        coordinates: {
            latitude: number;
            longitude: number;
        } | null;
        created_at: string;
        updated_at: string;
    }>;
    update(id: string, updatePropertyDto: UpdatePropertyDto, user: User): Promise<{
        id: string;
        title: string;
        description: string;
        price: number;
        area: number;
        area_unit: "Marla" | "Kanal";
        bedrooms: number;
        floors: number;
        kitchens: number;
        has_lawn: boolean;
        additional_info: string | null;
        address: string;
        city: string;
        images: string[];
        seller_id: string;
        seller_phone: string;
        seller_name: string;
        listed_date: string;
        status: "Available" | "Pending" | "Rented";
        property_type: string;
        coordinates: {
            latitude: number;
            longitude: number;
        } | null;
        created_at: string;
        updated_at: string;
    }>;
    updateStatus(id: string, status: PropertyStatus, user: User): Promise<{
        id: string;
        title: string;
        description: string;
        price: number;
        area: number;
        area_unit: "Marla" | "Kanal";
        bedrooms: number;
        floors: number;
        kitchens: number;
        has_lawn: boolean;
        additional_info: string | null;
        address: string;
        city: string;
        images: string[];
        seller_id: string;
        seller_phone: string;
        seller_name: string;
        listed_date: string;
        status: "Available" | "Pending" | "Rented";
        property_type: string;
        coordinates: {
            latitude: number;
            longitude: number;
        } | null;
        created_at: string;
        updated_at: string;
    }>;
    remove(id: string, user: User): Promise<{
        message: string;
    }>;
}
