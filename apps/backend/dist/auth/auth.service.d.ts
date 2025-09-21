import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../database/supabase.service';
import { UserRole } from '../database/types/database.types';
export interface LoginDto {
    email: string;
    password: string;
}
export interface RegisterDto {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: UserRole;
}
export interface AuthResponseDto {
    access_token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
    };
}
export declare class AuthService {
    private supabaseService;
    private jwtService;
    private configService;
    private supabaseClient;
    constructor(supabaseService: SupabaseService, jwtService: JwtService, configService: ConfigService);
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    validateUser(userId: string): Promise<any>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    forgotPassword(email: string): Promise<void>;
}
