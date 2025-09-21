import { UsersService, UpdateUserDto, UserFilterDto } from './users.service';
import { User } from '../database/types/database.types';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(filters: UserFilterDto): Promise<{
        users: {}[];
        pagination: {
            page: number;
            pageSize: number;
            total: number;
            totalPages: number;
        };
    }>;
    getMe(user: User): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        role: "seller" | "buyer" | "admin";
        createdAt: any;
    }>;
    getMyStats(user: User): Promise<{
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
    findOne(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        role: "seller" | "buyer" | "admin";
        created_at: string;
    }>;
    getUserStats(id: string): Promise<{
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
    update(id: string, updateUserDto: UpdateUserDto, user: User): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        role: "seller" | "buyer" | "admin";
        created_at: string;
    }>;
    remove(id: string, user: User): Promise<{
        message: string;
    }>;
}
