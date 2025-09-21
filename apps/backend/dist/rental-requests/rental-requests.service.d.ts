import { SupabaseService } from '../database/supabase.service';
import { RentalRequest, RequestStatus, UserRole } from '../database/types/database.types';
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
export declare class RentalRequestsService {
    private supabase;
    constructor(supabase: SupabaseService);
    create(createRentalRequestDto: CreateRentalRequestDto, buyerId: string): Promise<RentalRequest>;
    findAll(filters?: RentalRequestFilterDto): Promise<{
        requests: {
            property: {
                id: string;
                title: string;
                price: number;
                address: string;
                city: string;
                images: string[];
                seller_id: string;
            };
            buyer: {
                id: string;
                name: string;
                email: string;
                phone: string | null;
            };
        }[];
        pagination: {
            page: number;
            pageSize: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<RentalRequest>;
    update(id: string, updateRentalRequestDto: UpdateRentalRequestDto, userId: string, userRole: UserRole): Promise<RentalRequest>;
    remove(id: string, userId: string, userRole: UserRole): Promise<{
        message: string;
    }>;
    getBuyerRequests(buyerId: string, filters?: RentalRequestFilterDto): Promise<{
        requests: {
            property: {
                id: string;
                title: string;
                price: number;
                address: string;
                city: string;
                images: string[];
                seller_id: string;
            };
            buyer: {
                id: string;
                name: string;
                email: string;
                phone: string | null;
            };
        }[];
        pagination: {
            page: number;
            pageSize: number;
            total: number;
            totalPages: number;
        };
    }>;
    getSellerRequests(sellerId: string, filters?: RentalRequestFilterDto): Promise<{
        requests: {
            property: {
                id: string;
                title: string;
                price: number;
                address: string;
                city: string;
                images: string[];
                seller_id: string;
            };
            buyer: {
                id: string;
                name: string;
                email: string;
                phone: string | null;
            };
        }[];
        pagination: {
            page: number;
            pageSize: number;
            total: number;
            totalPages: number;
        };
    }>;
    getPropertyRequests(propertyId: string, userId: string, userRole: UserRole, filters?: RentalRequestFilterDto): Promise<{
        requests: {
            property: {
                id: string;
                title: string;
                price: number;
                address: string;
                city: string;
                images: string[];
                seller_id: string;
            };
            buyer: {
                id: string;
                name: string;
                email: string;
                phone: string | null;
            };
        }[];
        pagination: {
            page: number;
            pageSize: number;
            total: number;
            totalPages: number;
        };
    }>;
    approveRequest(id: string, userId: string, userRole: UserRole): Promise<RentalRequest>;
    rejectRequest(id: string, userId: string, userRole: UserRole): Promise<RentalRequest>;
}
