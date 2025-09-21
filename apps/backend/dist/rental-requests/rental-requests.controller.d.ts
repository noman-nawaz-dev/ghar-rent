import { RentalRequestsService, CreateRentalRequestDto, UpdateRentalRequestDto } from './rental-requests.service';
import { User, RequestStatus } from '../database/types/database.types';
export declare class RentalRequestsController {
    private readonly rentalRequestsService;
    constructor(rentalRequestsService: RentalRequestsService);
    findAll(propertyId?: string, buyerId?: string, sellerId?: string, status?: RequestStatus, page?: number, pageSize?: number): Promise<{
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
    getMyRequests(user: User, status?: RequestStatus, page?: number, pageSize?: number): Promise<{
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
    getMyPropertyRequests(user: User, status?: RequestStatus, page?: number, pageSize?: number): Promise<{
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
    getPropertyRequests(propertyId: string, user: User, status?: RequestStatus, page?: number, pageSize?: number): Promise<{
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
    findOne(id: string): Promise<{
        id: string;
        property_id: string;
        buyer_id: string;
        proposed_price: number;
        duration: number;
        message: string | null;
        status: "pending" | "approved" | "rejected";
        created_at: string;
        updated_at: string;
    }>;
    create(createRentalRequestDto: CreateRentalRequestDto, user: User): Promise<{
        id: string;
        property_id: string;
        buyer_id: string;
        proposed_price: number;
        duration: number;
        message: string | null;
        status: "pending" | "approved" | "rejected";
        created_at: string;
        updated_at: string;
    }>;
    update(id: string, updateRentalRequestDto: UpdateRentalRequestDto, user: User): Promise<{
        id: string;
        property_id: string;
        buyer_id: string;
        proposed_price: number;
        duration: number;
        message: string | null;
        status: "pending" | "approved" | "rejected";
        created_at: string;
        updated_at: string;
    }>;
    approve(id: string, user: User): Promise<{
        id: string;
        property_id: string;
        buyer_id: string;
        proposed_price: number;
        duration: number;
        message: string | null;
        status: "pending" | "approved" | "rejected";
        created_at: string;
        updated_at: string;
    }>;
    reject(id: string, user: User): Promise<{
        id: string;
        property_id: string;
        buyer_id: string;
        proposed_price: number;
        duration: number;
        message: string | null;
        status: "pending" | "approved" | "rejected";
        created_at: string;
        updated_at: string;
    }>;
    remove(id: string, user: User): Promise<{
        message: string;
    }>;
}
