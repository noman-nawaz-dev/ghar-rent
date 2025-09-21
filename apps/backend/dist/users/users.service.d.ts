import { SupabaseService } from '../database/supabase.service';
import { User, UserRole } from '../database/types/database.types';
export interface CreateUserDto {
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
}
export interface UpdateUserDto {
    name?: string;
    email?: string;
    phone?: string;
    role?: UserRole;
}
export interface UserFilterDto {
    role?: UserRole;
    search?: string;
    page?: number;
    pageSize?: number;
}
export declare class UsersService {
    private supabase;
    constructor(supabase: SupabaseService);
    findAll(filters?: UserFilterDto): Promise<{
        users: {}[];
        pagination: {
            page: number;
            pageSize: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto, requestingUserId: string): Promise<User>;
    remove(id: string, requestingUserId: string): Promise<{
        message: string;
    }>;
    getUserStats(userId: string): Promise<{
        totalProperties: number;
        availableProperties: number;
        rentedProperties: number;
        pendingRequests: number;
        totalRequests?: undefined;
        approvedRequests?: undefined;
        rejectedRequests?: undefined;
        totalUsers?: undefined;
        totalSellers?: undefined;
        totalBuyers?: undefined;
    } | {
        totalRequests: number;
        pendingRequests: number;
        approvedRequests: number;
        rejectedRequests: number;
        totalProperties?: undefined;
        availableProperties?: undefined;
        rentedProperties?: undefined;
        totalUsers?: undefined;
        totalSellers?: undefined;
        totalBuyers?: undefined;
    } | {
        totalUsers: number;
        totalProperties: number;
        totalRequests: number;
        totalSellers: number;
        totalBuyers: number;
        availableProperties?: undefined;
        rentedProperties?: undefined;
        pendingRequests?: undefined;
        approvedRequests?: undefined;
        rejectedRequests?: undefined;
    } | {
        totalProperties?: undefined;
        availableProperties?: undefined;
        rentedProperties?: undefined;
        pendingRequests?: undefined;
        totalRequests?: undefined;
        approvedRequests?: undefined;
        rejectedRequests?: undefined;
        totalUsers?: undefined;
        totalSellers?: undefined;
        totalBuyers?: undefined;
    }>;
}
