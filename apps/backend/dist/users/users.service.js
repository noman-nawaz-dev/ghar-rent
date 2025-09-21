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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../database/supabase.service");
let UsersService = class UsersService {
    supabase;
    constructor(supabase) {
        this.supabase = supabase;
    }
    async findAll(filters = {}) {
        const { role, search, page = 1, pageSize = 10 } = filters;
        let query = this.supabase
            .getClient()
            .from('users')
            .select('*', { count: 'exact' });
        if (role) {
            query = query.eq('role', role);
        }
        if (search) {
            query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
        }
        const skip = (page - 1) * pageSize;
        const { data: users, count, error, } = await query
            .order('created_at', { ascending: false })
            .range(skip, skip + pageSize - 1);
        if (error) {
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
        return {
            users: users || [],
            pagination: {
                page,
                pageSize,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / pageSize),
            },
        };
    }
    async findOne(id) {
        const { data: user, error } = await this.supabase
            .getClient()
            .from('users')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async update(id, updateUserDto, requestingUserId) {
        await this.findOne(id);
        const requestingUser = await this.findOne(requestingUserId);
        if (requestingUser.role !== 'admin' && requestingUser.id !== id) {
            throw new common_1.ForbiddenException('You can only update your own profile');
        }
        if (updateUserDto.role && requestingUser.role !== 'admin') {
            throw new common_1.ForbiddenException('Only admins can change user roles');
        }
        const { data: user, error } = await this.supabase
            .getClient()
            .from('users')
            .update(updateUserDto)
            .eq('id', id)
            .select()
            .single();
        if (error || !user) {
            throw new Error(`Failed to update user: ${error?.message}`);
        }
        return user;
    }
    async remove(id, requestingUserId) {
        await this.findOne(id);
        const requestingUser = await this.findOne(requestingUserId);
        if (requestingUser.role !== 'admin') {
            throw new common_1.ForbiddenException('Only admins can delete users');
        }
        const { error } = await this.supabase
            .getClient()
            .from('users')
            .delete()
            .eq('id', id);
        if (error) {
            throw new Error(`Failed to delete user: ${error.message}`);
        }
        return { message: 'User deleted successfully' };
    }
    async getUserStats(userId) {
        const user = await this.findOne(userId);
        if (user.role === 'seller') {
            const [totalPropertiesResult, availablePropertiesResult, rentedPropertiesResult, pendingRequestsResult,] = await Promise.all([
                this.supabase
                    .getClient()
                    .from('properties')
                    .select('*', { count: 'exact', head: true })
                    .eq('seller_id', userId),
                this.supabase
                    .getClient()
                    .from('properties')
                    .select('*', { count: 'exact', head: true })
                    .eq('seller_id', userId)
                    .eq('status', 'Available'),
                this.supabase
                    .getClient()
                    .from('properties')
                    .select('*', { count: 'exact', head: true })
                    .eq('seller_id', userId)
                    .eq('status', 'Rented'),
                this.supabase
                    .getClient()
                    .from('rental_requests')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'pending')
                    .in('property_id', (await this.supabase
                    .getClient()
                    .from('properties')
                    .select('id')
                    .eq('seller_id', userId)).data?.map((p) => p.id) || []),
            ]);
            return {
                totalProperties: totalPropertiesResult.count || 0,
                availableProperties: availablePropertiesResult.count || 0,
                rentedProperties: rentedPropertiesResult.count || 0,
                pendingRequests: pendingRequestsResult.count || 0,
            };
        }
        if (user.role === 'buyer') {
            const [totalRequestsResult, pendingRequestsResult, approvedRequestsResult, rejectedRequestsResult,] = await Promise.all([
                this.supabase
                    .getClient()
                    .from('rental_requests')
                    .select('*', { count: 'exact', head: true })
                    .eq('buyer_id', userId),
                this.supabase
                    .getClient()
                    .from('rental_requests')
                    .select('*', { count: 'exact', head: true })
                    .eq('buyer_id', userId)
                    .eq('status', 'pending'),
                this.supabase
                    .getClient()
                    .from('rental_requests')
                    .select('*', { count: 'exact', head: true })
                    .eq('buyer_id', userId)
                    .eq('status', 'approved'),
                this.supabase
                    .getClient()
                    .from('rental_requests')
                    .select('*', { count: 'exact', head: true })
                    .eq('buyer_id', userId)
                    .eq('status', 'rejected'),
            ]);
            return {
                totalRequests: totalRequestsResult.count || 0,
                pendingRequests: pendingRequestsResult.count || 0,
                approvedRequests: approvedRequestsResult.count || 0,
                rejectedRequests: rejectedRequestsResult.count || 0,
            };
        }
        if (user.role === 'admin') {
            const [totalUsersResult, totalPropertiesResult, totalRequestsResult, totalSellersResult, totalBuyersResult,] = await Promise.all([
                this.supabase
                    .getClient()
                    .from('users')
                    .select('*', { count: 'exact', head: true }),
                this.supabase
                    .getClient()
                    .from('properties')
                    .select('*', { count: 'exact', head: true }),
                this.supabase
                    .getClient()
                    .from('rental_requests')
                    .select('*', { count: 'exact', head: true }),
                this.supabase
                    .getClient()
                    .from('users')
                    .select('*', { count: 'exact', head: true })
                    .eq('role', 'seller'),
                this.supabase
                    .getClient()
                    .from('users')
                    .select('*', { count: 'exact', head: true })
                    .eq('role', 'buyer'),
            ]);
            return {
                totalUsers: totalUsersResult.count || 0,
                totalProperties: totalPropertiesResult.count || 0,
                totalRequests: totalRequestsResult.count || 0,
                totalSellers: totalSellersResult.count || 0,
                totalBuyers: totalBuyersResult.count || 0,
            };
        }
        return {};
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], UsersService);
//# sourceMappingURL=users.service.js.map