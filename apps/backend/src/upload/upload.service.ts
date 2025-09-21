import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

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

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<UploadResponse> {
    try {
      // Validate file
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
      ];

      if (file.size > maxSize) {
        throw new BadRequestException('File size must be less than 5MB');
      }

      if (!allowedTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          'Only JPEG, PNG, and WebP files are allowed',
        );
      }

      // Convert buffer to base64
      const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(base64Image, {
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
    } catch (error) {
      console.error('Error uploading image:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload image',
      };
    }
  }

  async uploadMultipleImages(
    files: Express.Multer.File[],
  ): Promise<UploadResponse[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }

  async deleteImage(
    publicId: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);

      if (result.result === 'ok') {
        return { success: true };
      } else {
        return { success: false, error: 'Failed to delete image' };
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteMultipleImages(
    publicIds: string[],
  ): Promise<{ success: boolean; deletedCount: number; errors: string[] }> {
    const deletePromises = publicIds.map(async (publicId) => {
      try {
        const result = await this.deleteImage(publicId);
        return { publicId, success: result.success, error: result.error };
      } catch (error) {
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

  extractPublicIdFromUrl(url: string): string | null {
    try {
      // Extract public_id from Cloudinary URL
      // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}.{format}
      const parts = url.split('/');
      const uploadIndex = parts.findIndex((part) => part === 'upload');

      if (uploadIndex === -1) return null;

      // Get everything after 'upload' and any transformations
      let publicIdWithFormat = parts.slice(uploadIndex + 1).join('/');

      // Remove transformation parameters (they start with 'v' followed by version number or other params)
      const transformationRegex = /^(v\d+_|c_|w_|h_|q_|f_)/;
      const publicIdParts = publicIdWithFormat.split('/');
      const filteredParts = publicIdParts.filter(
        (part) => !transformationRegex.test(part),
      );
      publicIdWithFormat = filteredParts.join('/');

      // Remove file extension
      const lastDotIndex = publicIdWithFormat.lastIndexOf('.');
      if (lastDotIndex !== -1) {
        return publicIdWithFormat.substring(0, lastDotIndex);
      }

      return publicIdWithFormat;
    } catch (error) {
      console.error('Error extracting public ID:', error);
      return null;
    }
  }
}
