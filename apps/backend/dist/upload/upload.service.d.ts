import { ConfigService } from '@nestjs/config';
export interface UploadResponse {
    success: boolean;
    data?: {
        publicId: string;
        secureUrl: string;
        url: string;
        width: number;
        height: number;
        format: string;
        resourceType: string;
    };
    error?: string;
}
export declare class UploadService {
    private configService;
    constructor(configService: ConfigService);
    uploadImage(file: Express.Multer.File): Promise<UploadResponse>;
    uploadMultipleImages(files: Express.Multer.File[]): Promise<UploadResponse[]>;
    deleteImage(publicId: string): Promise<{
        success: boolean;
        error?: string;
    }>;
    deleteMultipleImages(publicIds: string[]): Promise<{
        success: boolean;
        deletedCount: number;
        errors: string[];
    }>;
    extractPublicIdFromUrl(url: string): string | null;
}
