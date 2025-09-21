import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types/database.types';
export declare class SupabaseService implements OnModuleInit, OnModuleDestroy {
    private configService;
    private supabase;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    getClient(): SupabaseClient<Database>;
    cleanDatabase(): Promise<void>;
}
