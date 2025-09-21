import { UserRole } from '../types';

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

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}
