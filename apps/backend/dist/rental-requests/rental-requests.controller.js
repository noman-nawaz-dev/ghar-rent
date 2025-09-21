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
exports.RentalRequestsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const rental_requests_service_1 = require("./rental-requests.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let RentalRequestsController = class RentalRequestsController {
    rentalRequestsService;
    constructor(rentalRequestsService) {
        this.rentalRequestsService = rentalRequestsService;
    }
    async findAll(propertyId, buyerId, sellerId, status, page, pageSize) {
        const filters = {
            propertyId,
            buyerId,
            sellerId,
            status,
            page,
            pageSize,
        };
        return this.rentalRequestsService.findAll(filters);
    }
    async getMyRequests(user, status, page, pageSize) {
        const filters = { status, page, pageSize };
        return this.rentalRequestsService.getBuyerRequests(user.id, filters);
    }
    async getMyPropertyRequests(user, status, page, pageSize) {
        const filters = { status, page, pageSize };
        return this.rentalRequestsService.getSellerRequests(user.id, filters);
    }
    async getPropertyRequests(propertyId, user, status, page, pageSize) {
        const filters = { status, page, pageSize };
        return this.rentalRequestsService.getPropertyRequests(propertyId, user.id, user.role, filters);
    }
    async findOne(id) {
        return this.rentalRequestsService.findOne(id);
    }
    async create(createRentalRequestDto, user) {
        return this.rentalRequestsService.create(createRentalRequestDto, user.id);
    }
    async update(id, updateRentalRequestDto, user) {
        return this.rentalRequestsService.update(id, updateRentalRequestDto, user.id, user.role);
    }
    async approve(id, user) {
        return this.rentalRequestsService.approveRequest(id, user.id, user.role);
    }
    async reject(id, user) {
        return this.rentalRequestsService.rejectRequest(id, user.id, user.role);
    }
    async remove(id, user) {
        return this.rentalRequestsService.remove(id, user.id, user.role);
    }
};
exports.RentalRequestsController = RentalRequestsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all rental requests (Admin only)' }),
    (0, swagger_1.ApiQuery)({ name: 'propertyId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'buyerId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'sellerId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: database_types_1.RequestStatus }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Rental requests retrieved successfully',
    }),
    __param(0, (0, common_1.Query)('propertyId')),
    __param(1, (0, common_1.Query)('buyerId')),
    __param(2, (0, common_1.Query)('sellerId')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(5, (0, common_1.Query)('pageSize', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], RentalRequestsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-requests'),
    (0, roles_decorator_1.Roles)('buyer'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Get current buyer's rental requests" }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: database_types_1.RequestStatus }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Buyer requests retrieved successfully',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(3, (0, common_1.Query)('pageSize', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number, Number]),
    __metadata("design:returntype", Promise)
], RentalRequestsController.prototype, "getMyRequests", null);
__decorate([
    (0, common_1.Get)('my-property-requests'),
    (0, roles_decorator_1.Roles)('seller', 'admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: "Get rental requests for current seller's properties",
    }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: database_types_1.RequestStatus }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Seller property requests retrieved successfully',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(3, (0, common_1.Query)('pageSize', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number, Number]),
    __metadata("design:returntype", Promise)
], RentalRequestsController.prototype, "getMyPropertyRequests", null);
__decorate([
    (0, common_1.Get)('property/:propertyId'),
    (0, roles_decorator_1.Roles)('seller', 'admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get rental requests for a specific property' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: database_types_1.RequestStatus }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Property requests retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - can only view requests for own properties',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Property not found' }),
    __param(0, (0, common_1.Param)('propertyId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(4, (0, common_1.Query)('pageSize', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, Number, Number]),
    __metadata("design:returntype", Promise)
], RentalRequestsController.prototype, "getPropertyRequests", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get rental request by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Rental request retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Rental request not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RentalRequestsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('buyer'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new rental request (buyers only)' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Rental request created successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - buyers only' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Property not found' }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Conflict - already have pending request for this property',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RentalRequestsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update rental request' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Rental request updated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - can only update related requests',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Rental request not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], RentalRequestsController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/approve'),
    (0, roles_decorator_1.Roles)('seller', 'admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Approve rental request (sellers and admins only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Rental request approved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - sellers and admins only',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Rental request not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RentalRequestsController.prototype, "approve", null);
__decorate([
    (0, common_1.Put)(':id/reject'),
    (0, roles_decorator_1.Roles)('seller', 'admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Reject rental request (sellers and admins only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Rental request rejected successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - sellers and admins only',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Rental request not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RentalRequestsController.prototype, "reject", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete rental request' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Rental request deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - can only delete own requests',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Rental request not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RentalRequestsController.prototype, "remove", null);
exports.RentalRequestsController = RentalRequestsController = __decorate([
    (0, swagger_1.ApiTags)('Rental Requests'),
    (0, common_1.Controller)('rental-requests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [rental_requests_service_1.RentalRequestsService])
], RentalRequestsController);
//# sourceMappingURL=rental-requests.controller.js.map