import { api, endpoints } from '@/lib/api-client';

export interface SegmentationResponse {
  // The segmented image will be returned as a blob/buffer
  imageData: Blob;
  contentType: string;
}

export const analysisService = {
  // Segment land image
  async segmentImage(imageFile: File): Promise<SegmentationResponse> {
    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await api.upload<Blob>(endpoints.analysis.segment, formData);
    
    return {
      imageData: response.data,
      contentType: response.headers['content-type'] || 'image/jpeg',
    };
  },

  // Convert blob to data URL for display
  async blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  },

  // Download segmented image
  downloadSegmentedImage(blob: Blob, filename: string = 'segmented-image.jpg') {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};
