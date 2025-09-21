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
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cloudinary_1 = require("cloudinary");
let UploadService = class UploadService {
    configService;
    constructor(configService) {
        this.configService = configService;
        cloudinary_1.v2.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
        });
    }
    async uploadImage(file) {
        try {
            const maxSize = 5 * 1024 * 1024;
            const allowedTypes = [
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/webp',
            ];
            if (file.size > maxSize) {
                throw new common_1.BadRequestException('File size must be less than 5MB');
            }
            if (!allowedTypes.includes(file.mimetype)) {
                throw new common_1.BadRequestException('Only JPEG, PNG, and WebP files are allowed');
            }
            const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            const result = await cloudinary_1.v2.uploader.upload(base64Image, {
                folder: 'ghar-rent',
                resource_type: 'image',
                transformation: [
                    { width: 800, height: 600, crop: 'limit' },
                    { quality: 'auto', fetch_format: 'auto' },
                ],
                allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            });
            return {
                success: true,
                data: {
                    publicId: result.public_id,
                    secureUrl: result.secure_url,
                    url: result.url,
                    width: result.width,
                    height: result.height,
                    format: result.format,
                    resourceType: result.resource_type,
                },
            };
        }
        catch (error) {
            console.error('Error uploading image:', error);
            return {
                success: false,
                error: error.message || 'Failed to upload image',
            };
        }
    }
    async uploadMultipleImages(files) {
        const uploadPromises = files.map((file) => this.uploadImage(file));
        return Promise.all(uploadPromises);
    }
    async deleteImage(publicId) {
        try {
            const result = await cloudinary_1.v2.uploader.destroy(publicId);
            if (result.result === 'ok') {
                return { success: true };
            }
            else {
                return { success: false, error: 'Failed to delete image' };
            }
        }
        catch (error) {
            console.error('Error deleting image:', error);
            return { success: false, error: error.message };
        }
    }
    async deleteMultipleImages(publicIds) {
        const deletePromises = publicIds.map(async (publicId) => {
            try {
                const result = await this.deleteImage(publicId);
                return { publicId, success: result.success, error: result.error };
            }
            catch (error) {
                return { publicId, success: false, error: error.message };
            }
        });
        const results = await Promise.all(deletePromises);
        const deletedCount = results.filter((r) => r.success).length;
        const errors = results
            .filter((r) => !r.success)
            .map((r) => `${r.publicId}: ${r.error}`);
        return {
            success: errors.length === 0,
            deletedCount,
            errors,
        };
    }
    extractPublicIdFromUrl(url) {
        try {
            const parts = url.split('/');
            const uploadIndex = parts.findIndex((part) => part === 'upload');
            if (uploadIndex === -1)
                return null;
            let publicIdWithFormat = parts.slice(uploadIndex + 1).join('/');
            const transformationRegex = /^(v\d+_|c_|w_|h_|q_|f_)/;
            const publicIdParts = publicIdWithFormat.split('/');
            const filteredParts = publicIdParts.filter((part) => !transformationRegex.test(part));
            publicIdWithFormat = filteredParts.join('/');
            const lastDotIndex = publicIdWithFormat.lastIndexOf('.');
            if (lastDotIndex !== -1) {
                return publicIdWithFormat.substring(0, lastDotIndex);
            }
            return publicIdWithFormat;
        }
        catch (error) {
            console.error('Error extracting public ID:', error);
            return null;
        }
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UploadService);
//# sourceMappingURL=upload.service.js.map