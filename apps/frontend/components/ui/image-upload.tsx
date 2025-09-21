"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { uploadImageToCloudinary, validateImageFile } from '@/lib/cloudinary';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onImagesUploaded: (urls: string[]) => void;
  maxFiles?: number;
  className?: string;
}

interface UploadedImage {
  id: string;
  file: File;
  url: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

export function ImageUpload({ onImagesUploaded, maxFiles = 5, className }: ImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const previousUrlsRef = useRef<string[]>([]);

  // Call onImagesUploaded whenever uploadedImages changes
  useEffect(() => {
    const successfulImages = uploadedImages.filter(img => img.status === 'success');
    const urls = successfulImages.map(img => img.url);
    
    // Only call if URLs have actually changed
    if (JSON.stringify(urls) !== JSON.stringify(previousUrlsRef.current)) {
      previousUrlsRef.current = urls;
      onImagesUploaded(urls);
    }
  }, [uploadedImages, onImagesUploaded]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (uploadedImages.length + acceptedFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} images`);
      return;
    }

    setIsUploading(true);

    const newImages: UploadedImage[] = acceptedFiles.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      file,
      url: URL.createObjectURL(file),
      status: 'uploading' as const,
      progress: 0,
    }));

    setUploadedImages(prev => [...prev, ...newImages]);

    // Upload each image to Cloudinary
    const uploadPromises = newImages.map(async (image) => {
      // Validate file
      const validation = validateImageFile(image.file);
      if (!validation.valid) {
        setUploadedImages(prev => 
          prev.map(img => 
            img.id === image.id 
              ? { ...img, status: 'error' as const, error: validation.error }
              : img
          )
        );
        return;
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadedImages(prev => 
          prev.map(img => 
            img.id === image.id 
              ? { ...img, progress: Math.min(img.progress + 10, 90) }
              : img
          )
        );
      }, 200);

      try {
        const result = await uploadImageToCloudinary(image.file, 'ghar-rent');
        
        clearInterval(progressInterval);

        if (result.success && result.data) {
          setUploadedImages(prev => 
            prev.map(img => 
              img.id === image.id 
                ? { 
                    ...img, 
                    status: 'success' as const, 
                    progress: 100,
                    url: result.data!.secure_url 
                  }
                : img
            )
          );
        } else {
          setUploadedImages(prev => 
            prev.map(img => 
              img.id === image.id 
                ? { 
                    ...img, 
                    status: 'error' as const, 
                    error: result.error || 'Upload failed' 
                  }
                : img
            )
          );
        }
      } catch (error) {
        clearInterval(progressInterval);
        setUploadedImages(prev => 
          prev.map(img => 
            img.id === image.id 
              ? { 
                  ...img, 
                  status: 'error' as const, 
                  error: 'Upload failed' 
                }
              : img
          )
        );
      }
    });

    await Promise.all(uploadPromises);
    setIsUploading(false);
  }, [uploadedImages, maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: maxFiles - uploadedImages.length,
    disabled: isUploading,
  });

  const removeImage = (id: string) => {
    setUploadedImages(prev => {
      const updated = prev.filter(img => img.id !== id);
      return updated;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'uploading': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive 
            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" 
            : "border-gray-300 dark:border-gray-600 hover:border-emerald-400",
          isUploading && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          or click to select files
        </p>
        <p className="text-xs text-gray-400">
          Supports: JPEG, PNG, WebP (max 5MB each)
        </p>
      </div>

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedImages.map((image) => (
            <div key={image.id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <img
                  src={image.url}
                  alt="Uploaded"
                  className="w-full h-full object-cover"
                />
                
                {/* Progress Overlay */}
                {image.status === 'uploading' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center">
                      <Progress value={image.progress} className="w-20 mb-2" />
                      <p className="text-white text-sm">{image.progress}%</p>
                    </div>
                  </div>
                )}

                {/* Error Overlay */}
                {image.status === 'error' && (
                  <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  </div>
                )}

                {/* Success Overlay */}
                {image.status === 'success' && (
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-green-500 text-white rounded-full p-1">
                      <ImageIcon className="h-4 w-4" />
                    </div>
                  </div>
                )}

                {/* Remove Button */}
                <button
                  onClick={() => removeImage(image.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>

              {/* Error Message */}
              {image.status === 'error' && image.error && (
                <p className="text-xs text-red-600 mt-1">{image.error}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Status */}
      {isUploading && (
        <div className="text-center">
          <p className="text-sm text-blue-600">Uploading images...</p>
        </div>
      )}
    </div>
  );
} 