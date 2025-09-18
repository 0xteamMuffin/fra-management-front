import { api, endpoints } from '@/lib/api-client';
import { PresignedUrlRequest, PresignedUrlResponse } from '@/lib/types/api';

export const s3Service = {
  // Get presigned URL for file upload
  async getPresignedUrl(request: PresignedUrlRequest): Promise<PresignedUrlResponse> {
    const response = await api.post<PresignedUrlResponse>(endpoints.s3.presignedUrl, request);
    return response.data;
  },

  // Get presigned URL for viewing a file
  async getViewUrl(key: string): Promise<string | null> {
    try {
      const response = await api.get<{ viewUrl: string }>(`${endpoints.s3.viewUrl}?key=${key}`);
      return response.data.viewUrl;
    } catch (error) {
      console.error('Error getting view URL:', error);
      return null;
    }
  },

  // Upload file to S3 using presigned URL
  async uploadFile(file: File, uploadUrl: string): Promise<boolean> {
    try {
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });
      
      return response.ok;
    } catch (error) {
      console.error('S3 upload error:', error);
      return false;
    }
  },

  // Complete upload workflow
  async uploadFileComplete(file: File): Promise<string | null> {
    try {
      // Step 1: Get presigned URL
      const { uploadUrl, key } = await this.getPresignedUrl({
        fileName: file.name,
        fileType: file.type,
      });

      // Step 2: Upload to S3
      const uploadSuccess = await this.uploadFile(file, uploadUrl);
      
      if (uploadSuccess) {
        return key; // Return S3 key for database storage
      }
      
      return null;
    } catch (error) {
      console.error('Complete upload error:', error);
      return null;
    }
  },

  // Helper function to generate file preview URL
  generatePreviewUrl(s3Key: string): string {
    // This would typically use CloudFront or S3 direct URLs
    // For now, we'll use a placeholder approach
    return `https://your-bucket.s3.amazonaws.com/${s3Key}`;
  },
};
