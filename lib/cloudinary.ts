export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

export interface CloudinaryUploadResponse {
  success: boolean;
  data?: CloudinaryUploadResult;
  error?: string;
}

/**
 * Upload a single image to Cloudinary via API route
 */
export async function uploadImageToCloudinary(
  file: File,
  folder: string = 'ghar-rent'
): Promise<CloudinaryUploadResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Upload failed',
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload image',
    };
  }
}

/**
 * Upload multiple images to Cloudinary
 */
export async function uploadMultipleImagesToCloudinary(
  files: File[],
  folder: string = 'ghar-rent'
): Promise<CloudinaryUploadResponse[]> {
  const uploadPromises = files.map(file => uploadImageToCloudinary(file, folder));
  return Promise.all(uploadPromises);
}

/**
 * Validate file before upload
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, and WebP files are allowed' };
  }

  return { valid: true };
}

/**
 * Generate optimized image URL with transformations
 */
export function getOptimizedImageUrl(publicId: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: string;
} = {}): string {
  const { width, height, quality = 'auto', format = 'auto' } = options;
  
  // Use Cloudinary URL transformation
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  let url = `https://res.cloudinary.com/${cloudName}/image/upload`;
  
  if (width || height || quality !== 'auto' || format !== 'auto') {
    const transformations = [];
    if (width && height) transformations.push(`w_${width},h_${height},c_fill`);
    else if (width) transformations.push(`w_${width}`);
    else if (height) transformations.push(`h_${height}`);
    if (quality !== 'auto') transformations.push(`q_${quality}`);
    if (format !== 'auto') transformations.push(`f_${format}`);
    
    if (transformations.length > 0) {
      url += `/${transformations.join(',')}`;
    }
  }
  
  return `${url}/${publicId}`;
} 