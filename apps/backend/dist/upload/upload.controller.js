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
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const upload_service_1 = require("./upload.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let UploadController = class UploadController {
    uploadService;
    constructor(uploadService) {
        this.uploadService = uploadService;
    }
    async uploadImage(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        return this.uploadService.uploadImage(file);
    }
    async uploadImages(files) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files provided');
        }
        if (files.length > 10) {
            throw new common_1.BadRequestException('Maximum 10 files allowed');
        }
        return this.uploadService.uploadMultipleImages(files);
    }
    async deleteImage(publicId) {
        if (!publicId) {
            throw new common_1.BadRequestException('Public ID is required');
        }
        return this.uploadService.deleteImage(publicId);
    }
    async deleteImages(publicIds) {
        if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
            throw new common_1.BadRequestException('Public IDs array is required');
        }
        return this.uploadService.deleteMultipleImages(publicIds);
    }
    async deleteImageByUrl(url) {
        if (!url) {
            throw new common_1.BadRequestException('URL is required');
        }
        const publicId = this.uploadService.extractPublicIdFromUrl(url);
        if (!publicId) {
            throw new common_1.BadRequestException('Unable to extract public ID from URL');
        }
        return this.uploadService.deleteImage(publicId);
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)('image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a single image' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Image uploaded successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid file or file too large' }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Post)('images'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10)),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Upload multiple images (max 10)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Images uploaded successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid files or files too large' }),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadImages", null);
__decorate([
    (0, common_1.Delete)('image'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an image by public ID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                publicId: {
                    type: 'string',
                    description: 'Cloudinary public ID of the image to delete',
                },
            },
            required: ['publicId'],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Image deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid public ID' }),
    __param(0, (0, common_1.Body)('publicId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "deleteImage", null);
__decorate([
    (0, common_1.Delete)('images'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete multiple images by public IDs' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                publicIds: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                    description: 'Array of Cloudinary public IDs of the images to delete',
                },
            },
            required: ['publicIds'],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Images deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid public IDs' }),
    __param(0, (0, common_1.Body)('publicIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "deleteImages", null);
__decorate([
    (0, common_1.Delete)('image-by-url'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an image by URL' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                url: {
                    type: 'string',
                    description: 'Cloudinary URL of the image to delete',
                },
            },
            required: ['url'],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Image deleted successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid URL or unable to extract public ID',
    }),
    __param(0, (0, common_1.Body)('url')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "deleteImageByUrl", null);
exports.UploadController = UploadController = __decorate([
    (0, swagger_1.ApiTags)('Upload'),
    (0, common_1.Controller)('upload'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [upload_service_1.UploadService])
], UploadController);
//# sourceMappingURL=upload.controller.js.map