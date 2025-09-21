import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadImage(file: Express.Multer.File): Promise<import("./upload.service").UploadResponse>;
    uploadImages(files: Express.Multer.File[]): Promise<import("./upload.service").UploadResponse[]>;
    deleteImage(publicId: string): Promise<{
        success: boolean;
        error?: string;
    }>;
    deleteImages(publicIds: string[]): Promise<{
        success: boolean;
        deletedCount: number;
        errors: string[];
    }>;
    deleteImageByUrl(url: string): Promise<{
        success: boolean;
        error?: string;
    }>;
}
