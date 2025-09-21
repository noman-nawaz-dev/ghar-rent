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
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ai_service_1 = require("./ai.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let AiController = class AiController {
    aiService;
    constructor(aiService) {
        this.aiService = aiService;
    }
    async generatePriceSuggestion(request) {
        await this.aiService.validatePropertyData(request);
        return this.aiService.generatePriceSuggestion(request);
    }
    async generatePropertyDescription(propertyData) {
        return {
            description: await this.aiService.generatePropertyDescription(propertyData),
            success: true,
        };
    }
    async suggestPropertyTags(propertyData) {
        return {
            tags: await this.aiService.suggestPropertyTags(propertyData),
            success: true,
        };
    }
    async analyzeMarketTrends(city) {
        return this.aiService.analyzeMarketTrends(city);
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Post)('price-suggestion'),
    (0, roles_decorator_1.Roles)('seller', 'admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get AI-powered price suggestion for a property' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Price suggestion generated successfully',
        schema: {
            type: 'object',
            properties: {
                price: { type: 'number', nullable: true },
                priceRange: {
                    type: 'object',
                    properties: {
                        min: { type: 'number' },
                        max: { type: 'number' },
                    },
                },
                analysis: {
                    type: 'object',
                    properties: {
                        basePrice: { type: 'number' },
                        adjustments: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    factor: { type: 'string' },
                                    impact: { type: 'string' },
                                    reasoning: { type: 'string' },
                                },
                            },
                        },
                        marketInsights: { type: 'string' },
                    },
                },
                recommendations: {
                    type: 'array',
                    items: { type: 'string' },
                },
                success: { type: 'boolean' },
                error: { type: 'string', nullable: true },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid property data' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - sellers and admins only',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generatePriceSuggestion", null);
__decorate([
    (0, common_1.Post)('property-description'),
    (0, roles_decorator_1.Roles)('seller', 'admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Generate AI-powered property description (Coming Soon)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Property description generated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - sellers and admins only',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generatePropertyDescription", null);
__decorate([
    (0, common_1.Post)('property-tags'),
    (0, roles_decorator_1.Roles)('seller', 'admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Generate AI-suggested property tags (Coming Soon)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Property tags generated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - sellers and admins only',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "suggestPropertyTags", null);
__decorate([
    (0, common_1.Post)('market-trends'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Analyze market trends for a city (Coming Soon, Admin only)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Market trends analyzed successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - admin only' }),
    __param(0, (0, common_1.Body)('city')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "analyzeMarketTrends", null);
exports.AiController = AiController = __decorate([
    (0, swagger_1.ApiTags)('AI Services'),
    (0, common_1.Controller)('ai'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AiController);
//# sourceMappingURL=ai.controller.js.map