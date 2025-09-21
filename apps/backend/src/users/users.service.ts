import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
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

@Injectable()
export class UsersService {
  constructor(private supabase: SupabaseService) {}

  async findAll(filters: UserFilterDto = {}) {
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

    const {
      data: users,
      count,
      error,
    } = await query
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

  async findOne(id: string): Promise<User> {
    const { data: user, error } = await this.supabase
      .getClient()
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    requestingUserId: string,
  ): Promise<User> {
    // Check if user exists
    await this.findOne(id);

    // Check permissions - users can only update their own profile unless admin
    const requestingUser = await this.findOne(requestingUserId);
    if (requestingUser.role !== 'admin' && requestingUser.id !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }

    // If non-admin is trying to change role, prevent it
    if (updateUserDto.role && requestingUser.role !== 'admin') {
      throw new ForbiddenException('Only admins can change user roles');
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

  async remove(
    id: string,
    requestingUserId: string,
  ): Promise<{ message: string }> {
    // Check if user exists
    await this.findOne(id);

    // Check permissions - only admin can delete users
    const requestingUser = await this.findOne(requestingUserId);
    if (requestingUser.role !== 'admin') {
      throw new ForbiddenException('Only admins can delete users');
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

  async getUserStats(userId: string) {
    const user = await this.findOne(userId);

    if (user.role === 'seller') {
      const [
        totalPropertiesResult,
        availablePropertiesResult,
        rentedPropertiesResult,
        pendingRequestsResult,
      ] = await Promise.all([
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
          .in(
            'property_id',
            (
              await this.supabase
                .getClient()
                .from('properties')
                .select('id')
                .eq('seller_id', userId)
            ).data?.map((p) => p.id) || [],
          ),
      ]);

      return {
        totalProperties: totalPropertiesResult.count || 0,
        availableProperties: availablePropertiesResult.count || 0,
        rentedProperties: rentedPropertiesResult.count || 0,
        pendingRequests: pendingRequestsResult.count || 0,
      };
    }

    if (user.role === 'buyer') {
      const [
        totalRequestsResult,
        pendingRequestsResult,
        approvedRequestsResult,
        rejectedRequestsResult,
      ] = await Promise.all([
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
      const [
        totalUsersResult,
        totalPropertiesResult,
        totalRequestsResult,
        totalSellersResult,
        totalBuyersResult,
      ] = await Promise.all([
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
}
