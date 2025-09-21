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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase_service_1 = require("../database/supabase.service");
let AuthService = class AuthService {
    supabaseService;
    jwtService;
    configService;
    supabaseClient;
    constructor(supabaseService, jwtService, configService) {
        this.supabaseService = supabaseService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.supabaseClient = (0, supabase_js_1.createClient)(this.configService.get('SUPABASE_URL') || '', this.configService.get('SUPABASE_SERVICE_KEY') || '');
    }
    async register(registerDto) {
        const { name, email, password, phone, role } = registerDto;
        const { data: existingUser } = await this.supabaseClient
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const { data: authData, error: authError } = await this.supabaseClient.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
        });
        if (authError) {
            throw new common_1.BadRequestException(`Failed to create user: ${authError.message}`);
        }
        if (!authData.user) {
            throw new common_1.BadRequestException('Failed to create user');
        }
        const { data: user, error: userError } = await this.supabaseClient
            .from('users')
            .insert({
            id: authData.user.id,
            name,
            email,
            phone,
            role,
        })
            .select()
            .single();
        if (userError || !user) {
            throw new common_1.BadRequestException('Failed to create user profile');
        }
        const payload = { sub: user.id, email: user.email };
        const access_token = this.jwtService.sign(payload);
        return {
            access_token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const { data: authData, error: authError } = await this.supabaseClient.auth.signInWithPassword({
            email,
            password,
        });
        if (authError || !authData.user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const { data: user } = await this.supabaseClient
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single();
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const payload = { sub: user.id, email: user.email };
        const access_token = this.jwtService.sign(payload);
        return {
            access_token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }
    async validateUser(userId) {
        const { data: user, error } = await this.supabaseClient
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        if (error || !user) {
            return null;
        }
        return user;
    }
    async changePassword(userId, currentPassword, newPassword) {
        const { error } = await this.supabaseClient.auth.admin.updateUserById(userId, {
            password: newPassword,
        });
        if (error) {
            throw new common_1.BadRequestException(`Failed to change password: ${error.message}`);
        }
    }
    async forgotPassword(email) {
        const { error } = await this.supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: `${this.configService.get('FRONTEND_URL')}/auth/reset-password`,
        });
        if (error) {
            throw new common_1.BadRequestException(`Failed to send reset email: ${error.message}`);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map