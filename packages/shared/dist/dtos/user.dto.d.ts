import { UserRole } from '../types';
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
export interface UserProfileDto {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    createdAt: Date;
}
//# sourceMappingURL=user.dto.d.ts.map