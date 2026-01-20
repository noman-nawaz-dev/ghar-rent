import { supabase } from '@/lib/supabase.client';
import { User } from '@/lib/data/users';

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * Check if user account is active (not suspended)
 * @param userId - The user's ID
 * @returns User data if active, null if suspended or not found
 */
export async function checkUserStatus(userId: string): Promise<{ user: User | null; isSuspended: boolean; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error checking user status:', error);
      return { user: null, isSuspended: false, error: 'Unable to verify account status' };
    }

    if (!data) {
      return { user: null, isSuspended: false, error: 'User not found' };
    }

    const isSuspended = data.status === 'suspended';
    return { user: isSuspended ? null : data, isSuspended, error: undefined };
  } catch (error) {
    console.error('Error in checkUserStatus:', error);
    return { user: null, isSuspended: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Authenticate user with email and password, checking for suspended status
 * @param email - User's email
 * @param password - User's password
 * @returns AuthResult with success status and user data or error message
 */
export async function authenticateUser(email: string, password: string): Promise<AuthResult> {
  try {
    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'Authentication failed' };
    }

    // Check user status
    const statusCheck = await checkUserStatus(data.user.id);

    if (statusCheck.error) {
      // Sign out if there's an error checking status
      await supabase.auth.signOut();
      return { success: false, error: statusCheck.error };
    }

    if (statusCheck.isSuspended) {
      // Sign out suspended users
      await supabase.auth.signOut();
      return { success: false, error: 'Your account has been suspended. Please contact support for assistance.' };
    }

    return { success: true, user: statusCheck.user || undefined };
  } catch (error) {
    console.error('Error in authenticateUser:', error);
    return { success: false, error: 'An unexpected error occurred during authentication' };
  }
}

/**
 * Verify user profile exists and is active during OAuth callback
 * @param userId - The authenticated user's ID
 * @returns User profile with role and status
 */
export async function verifyOAuthUser(userId: string): Promise<{
  user: (User & { role: string }) | null;
  isSuspended: boolean;
  isNewUser: boolean;
  error?: string;
}> {
  try {
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    // PGRST116: No rows returned (new user)
    if (profileError && profileError.code === 'PGRST116') {
      return { user: null, isSuspended: false, isNewUser: true };
    }

    if (profileError) {
      console.error('Error verifying OAuth user:', profileError);
      return { user: null, isSuspended: false, isNewUser: false, error: 'Failed to check user profile' };
    }

    if (!profile) {
      return { user: null, isSuspended: false, isNewUser: true };
    }

    const isSuspended = profile.status === 'suspended';
    
    return {
      user: isSuspended ? null : (profile as User & { role: string }),
      isSuspended,
      isNewUser: false,
    };
  } catch (error) {
    console.error('Error in verifyOAuthUser:', error);
    return { user: null, isSuspended: false, isNewUser: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Create a new user profile for OAuth users
 * @param userId - The user's ID from auth
 * @param email - User's email
 * @param name - User's display name
 * @param phone - User's phone (optional)
 * @param role - User's role (buyer or seller)
 * @returns Created user or null if failed
 */
export async function createOAuthUserProfile(
  userId: string,
  email: string,
  name: string,
  role: 'buyer' | 'seller',
  phone?: string | null
): Promise<{ user: User | null; error?: string }> {
  try {
    const newUser = {
      id: userId,
      email,
      name,
      phone: phone || null,
      role,
    };

    const { data, error } = await supabase
      .from('users')
      .insert(newUser)
      .select()
      .single();

    if (error) {
      console.error('Error creating OAuth user profile:', error);
      return { user: null, error: `Failed to create user profile: ${error.message}` };
    }

    return { user: data, error: undefined };
  } catch (error) {
    console.error('Error in createOAuthUserProfile:', error);
    return { user: null, error: 'An unexpected error occurred while creating profile' };
  }
}
