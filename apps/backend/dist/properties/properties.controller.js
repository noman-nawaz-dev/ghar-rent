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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertiesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const properties_service_1 = require("./properties.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
let PropertiesController = class PropertiesController {
    propertiesService;
    constructor(propertiesService) {
        this.propertiesService = propertiesService;
    }
    async findAll(search, city, minPrice, maxPrice, propertyType, minBedrooms, hasLawn, sortBy, page, pageSize) {
        const filters = {
            search,
            city,
            minPrice,
            maxPrice,
            propertyType,
            minBedrooms,
            hasLawn,
        };
        const sort = {
            sortBy,
            page,
            pageSize,
        };
        return this.propertiesService.findAll(filters, sort);
    }
    async search(searchTerm, city, minPrice, maxPrice, propertyType, minBedrooms, hasLawn) {
        const filters = {
            city,
            minPrice,
            maxPrice,
            propertyType,
            minBedrooms,
            hasLawn,
        };
        return this.propertiesService.search(searchTerm, filters);
    }
    async getCities() {
        return this.propertiesService.getCities();
    }
    async getPropertyTypes() {
        return this.propertiesService.getPropertyTypes();
    }
    async getMyProperties(user, status) {
        const filters = { status };
        return this.propertiesService.getSellerProperties(user.id, filters);
    }
    async findOne(id) {
        return this.propertiesService.findOne(id);
    }
    async create(createPropertyDto, user) {
        return this.propertiesService.create(createPropertyDto, user.id);
    }
    async update(id, updatePropertyDto, user) {
        return this.propertiesService.update(id, updatePropertyDto, user.id, user.role);
    }
    async updateStatus(id, status, user) {
        return this.propertiesService.updateStatus(id, status, user.id, user.role);
    }
    async remove(id, user) {
        return this.propertiesService.remove(id, user.id, user.role);
    }
};
exports.PropertiesController = PropertiesController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all properties with filters and pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'city', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'minPrice', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'maxPrice', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'propertyType', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'minBedrooms', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'hasLawn', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({
        name: 'sortBy',
        required: false,
        enum: ['newest', 'price-low', 'price-high', 'area-high'],
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Properties retrieved successfully',
    }),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('city')),
    __param(2, (0, common_1.Query)('minPrice', new common_1.ParseIntPipe({ optional: true }))),
    __param(3, (0, common_1.Query)('maxPrice', new common_1.ParseIntPipe({ optional: true }))),
    __param(4, (0, common_1.Query)('propertyType')),
    __param(5, (0, common_1.Query)('minBedrooms', new common_1.ParseIntPipe({ optional: true }))),
    __param(6, (0, common_1.Query)('hasLawn', new common_1.ParseBoolPipe({ optional: true }))),
    __param(7, (0, common_1.Query)('sortBy')),
    __param(8, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(9, (0, common_1.Query)('pageSize', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number, String, Number, Boolean, String, Number, Number]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search properties' }),
    (0, swagger_1.ApiQuery)({
        name: 'q',
        required: true,
        type: String,
        description: 'Search term',
    }),
    (0, swagger_1.ApiQuery)({ name: 'city', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'minPrice', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'maxPrice', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'propertyType', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'minBedrooms', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'hasLawn', required: false, type: Boolean }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Search results retrieved successfully',
    }),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('city')),
    __param(2, (0, common_1.Query)('minPrice', new common_1.ParseIntPipe({ optional: true }))),
    __param(3, (0, common_1.Query)('maxPrice', new common_1.ParseIntPipe({ optional: true }))),
    __param(4, (0, common_1.Query)('propertyType')),
    __param(5, (0, common_1.Query)('minBedrooms', new common_1.ParseIntPipe({ optional: true }))),
    __param(6, (0, common_1.Query)('hasLawn', new common_1.ParseBoolPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number, String, Number, Boolean]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "search", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('cities'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all available cities' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cities retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "getCities", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('types'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all property types' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Property types retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "getPropertyTypes", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my-properties'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Get current user's properties (sellers only)" }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        enum: ['Available', 'Pending', 'Rented'],
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User properties retrieved successfully',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "getMyProperties", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get property by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Property retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Property not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('seller', 'admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new property (sellers and admins only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Property created successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - sellers and admins only',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update property' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Property updated successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - can only update own properties',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Property not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':id/status'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update property status' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Property status updated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - can only update own properties',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Property not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete property' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Property deleted successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - can only delete own properties',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Property not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "remove", null);
exports.PropertiesController = PropertiesController = __decorate([
    (0, swagger_1.ApiTags)('Properties'),
    (0, common_1.Controller)('properties'),
    __metadata("design:paramtypes", [properties_service_1.PropertiesService])
], PropertiesController);
//# sourceMappingURL=properties.controller.js.map