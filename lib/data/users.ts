import { Database } from '@/types/supabase';
import { supabase } from '../supabase.client';
import { ActivityService } from '../database/activities';

export type User = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserById:', error);
    return null;
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserByEmail:', error);
    return null;
  }
}

/**
 * Get current user profile with role
 */
export async function getCurrentUserProfile(userId: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching current user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getCurrentUserProfile:', error);
    return null;
  }
}

/**
 * Create new user
 */
export async function createUser(userData: UserInsert): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createUser:', error);
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, updates: UserUpdate): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      return null;
    }

    // Log activity if profile was updated successfully
    if (data) {
      const changes = Object.keys(updates).filter(key => key !== 'updated_at');
      if (changes.length > 0) {
        await ActivityService.logProfileUpdated(
          userId,
          changes
        ).catch(err => console.error('Failed to log activity:', err));
      }
    }

    return data;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return null;
  }
}

/**
 * Update user role
 */
export async function updateUserRole(userId: string, role: 'seller' | 'buyer' | 'admin'): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user role:', error);
      return null;
    }

    // Log activity if role was updated successfully
    if (data) {
      await ActivityService.logProfileUpdated(
        userId,
        ['role']
      ).catch(err => console.error('Failed to log activity:', err));
    }

    return data;
  } catch (error) {
    console.error('Error in updateUserRole:', error);
    return null;
  }
}

/**
 * Delete user
 */
export async function deleteUser(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Error deleting user:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteUser:', error);
    return false;
  }
}

/**
 * Get all users (admin only)
 */
export async function getAllUsers(): Promise<User[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all users:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    return [];
  }
}

/**
 * Get users by role
 */
export async function getUsersByRole(role: 'seller' | 'buyer' | 'admin'): Promise<User[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', role)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users by role:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUsersByRole:', error);
    return [];
  }
}

/**
 * Search users by name or email
 */
export async function searchUsers(query: string): Promise<User[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching users:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in searchUsers:', error);
    return [];
  }
}

/**
 * Check if user exists
 */
export async function userExists(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (error) {
      return false;
    }

    return !!data;
  } catch (error) {
    return false;
  }
}

/**
 * Get user statistics (for admin dashboard)
 */
export async function getUserStats() {
  try {
    const { data: totalUsers, error: totalError } = await supabase
      .from('users')
      .select('id', { count: 'exact' });

    const { data: sellers, error: sellersError } = await supabase
      .from('users')
      .select('id', { count: 'exact' })
      .eq('role', 'seller');

    const { data: buyers, error: buyersError } = await supabase
      .from('users')
      .select('id', { count: 'exact' })
      .eq('role', 'buyer');

    if (totalError || sellersError || buyersError) {
      console.error('Error fetching user stats:', { totalError, sellersError, buyersError });
      return null;
    }

    return {
      total: totalUsers?.length || 0,
      sellers: sellers?.length || 0,
      buyers: buyers?.length || 0,
    };
  } catch (error) {
    console.error('Error in getUserStats:', error);
    return null;
  }
}

/**
 * Get all users with property counts (for admin dashboard)
 */
export async function getAllUsersWithPropertyCounts(): Promise<any[]> {
  try {
    // First get all users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return [];
    }

    if (!users || users.length === 0) {
      return [];
    }

    // Get property counts for sellers
    const { data: propertyCounts, error: countsError } = await supabase
      .from('properties')
      .select('seller_id');

    if (countsError) {
      console.error('Error fetching property counts:', countsError);
    }

    // Create a map of seller_id to property count
    const propertyCountMap = new Map<string, number>();
    if (propertyCounts) {
      propertyCounts.forEach((prop) => {
        const count = propertyCountMap.get(prop.seller_id) || 0;
        propertyCountMap.set(prop.seller_id, count + 1);
      });
    }

    // Combine users with property counts
    const usersWithCounts = users.map((user) => ({
      ...user,
      properties: user.role === 'seller' ? (propertyCountMap.get(user.id) || 0) : undefined,
    }));

    return usersWithCounts;
  } catch (error) {
    console.error('Error in getAllUsersWithPropertyCounts:', error);
    return [];
  }
}

/**
 * Update user status (active/suspended)
 */
export async function updateUserStatus(
  userId: string, 
  status: 'active' | 'suspended'
): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ status })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user status:', error);
      return null;
    }

    // Log activity if status was updated successfully
    if (data) {
      await ActivityService.logProfileUpdated(
        userId,
        ['status']
      ).catch(err => console.error('Failed to log activity:', err));
    }

    return data;
  } catch (error) {
    console.error('Error in updateUserStatus:', error);
    return null;
  }
}

/**
 * Get users by status
 */
export async function getUsersByStatus(status: 'active' | 'suspended'): Promise<User[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users by status:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUsersByStatus:', error);
    return [];
  }
}

/**
 * Get total count of users
 */
export async function getTotalUsersCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error fetching total users count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error in getTotalUsersCount:', error);
    return 0;
  }
} 