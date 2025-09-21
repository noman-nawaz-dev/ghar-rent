import { AuthService, LoginDto, RegisterDto, AuthResponseDto } from './auth.service';
import { User } from '../database/types/database.types';
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    getProfile(user: User): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        role: "seller" | "buyer" | "admin";
        createdAt: string;
    }>;
    changePassword(user: User, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
}
