import {
  Controller,
  Post,
  Delete,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Upload')
@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload a single image' })
  @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file or file too large' })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    return this.uploadService.uploadImage(file);
  }

  @Post('images')
  @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
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
  })
  @ApiOperation({ summary: 'Upload multiple images (max 10)' })
  @ApiResponse({ status: 201, description: 'Images uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid files or files too large' })
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    if (files.length > 10) {
      throw new BadRequestException('Maximum 10 files allowed');
    }

    return this.uploadService.uploadMultipleImages(files);
  }

  @Delete('image')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an image by public ID' })
  @ApiBody({
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
  })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid public ID' })
  async deleteImage(@Body('publicId') publicId: string) {
    if (!publicId) {
      throw new BadRequestException('Public ID is required');
    }

    return this.uploadService.deleteImage(publicId);
  }

  @Delete('images')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete multiple images by public IDs' })
  @ApiBody({
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
  })
  @ApiResponse({ status: 200, description: 'Images deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid public IDs' })
  async deleteImages(@Body('publicIds') publicIds: string[]) {
    if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
      throw new BadRequestException('Public IDs array is required');
    }

    return this.uploadService.deleteMultipleImages(publicIds);
  }

  @Delete('image-by-url')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an image by URL' })
  @ApiBody({
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
  })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid URL or unable to extract public ID',
  })
  async deleteImageByUrl(@Body('url') url: string) {
    if (!url) {
      throw new BadRequestException('URL is required');
    }

    const publicId = this.uploadService.extractPublicIdFromUrl(url);
    if (!publicId) {
      throw new BadRequestException('Unable to extract public ID from URL');
    }

    return this.uploadService.deleteImage(publicId);
  }
}
