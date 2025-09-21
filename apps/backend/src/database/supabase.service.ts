import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types/database.types';

@Injectable()
export class SupabaseService implements OnModuleInit, OnModuleDestroy {
  private supabase: SupabaseClient<Database>;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get('SUPABASE_URL');
    const supabaseKey = this.configService.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Key must be provided');
    }

    this.supabase = createClient<Database>(supabaseUrl, supabaseKey);
  }

  async onModuleInit() {
    // Test connection
    try {
      const { error } = await this.supabase
        .from('users')
        .select('count')
        .limit(1);
      if (error) {
        console.error('Failed to connect to Supabase:', error);
      } else {
        console.log('✅ Connected to Supabase successfully');
      }
    } catch (error) {
      console.error('❌ Error connecting to Supabase:', error);
    }
  }

  async onModuleDestroy() {
    // Cleanup if needed
  }

  getClient(): SupabaseClient<Database> {
    return this.supabase;
  }

  // Helper methods for common operations
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') return;

    // Delete in reverse order of dependencies
    await this.supabase
      .from('rental_requests')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    await this.supabase
      .from('properties')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    await this.supabase
      .from('users')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
  }
}
