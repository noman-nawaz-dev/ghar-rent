declare module 'cloudinary' {
  export const v2: {
    config: (config: {
      cloud_name: string;
      api_key: string;
      api_secret: string;
    }) => void;
    uploader: {
      upload: (
        file: string,
        options?: {
          folder?: string;
          resource_type?: string;
          transformation?: any[];
          allowed_formats?: string[];
        }
      ) => Promise<{
        public_id: string;
        secure_url: string;
        url: string;
        width: number;
        height: number;
        format: string;
        resource_type: string;
      }>;
      destroy: (publicId: string) => Promise<{ result: string }>;
    };
    url: (
      publicId: string,
      options?: {
        transformation?: any[];
        secure?: boolean;
      }
    ) => string;
  };
} 