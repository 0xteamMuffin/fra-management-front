import { api, endpoints } from "@/lib/api-client";
import {
  DocumentProcessingRequest,
  DocumentProcessingResponse,
  DocumentProcessingStatus,
} from "@/lib/types/api";

export const documentService = {
  // Start document processing
  async processDocument(
    request: DocumentProcessingRequest,
  ): Promise<DocumentProcessingResponse> {
    const response = await api.post<DocumentProcessingResponse>(
      endpoints.documents.process,
      request,
    );
    return response.data;
  },

  // Get processing status
  async getProcessingStatus(
    processingId: string,
  ): Promise<DocumentProcessingStatus> {
    const response = await api.get<DocumentProcessingStatus>(
      endpoints.documents.status(processingId),
    );
    return response.data;
  },

  // Poll for processing completion
  async waitForProcessing(
    processingId: string,
    onProgress?: (status: DocumentProcessingStatus) => void,
    maxWaitTime: number = 300000, // 5 minutes
  ): Promise<DocumentProcessingStatus> {
    const startTime = Date.now();
    const pollInterval = 2000; // 2 seconds

    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const status = await this.getProcessingStatus(processingId);

          if (onProgress) {
            onProgress(status);
          }

          // Check if processing is complete
          if (status.status === "NER_COMPLETE") {
            resolve(status);
            return;
          }

          // Check if processing failed
          if (status.status === "FAILED") {
            reject(new Error(status.errorMessage || "Processing failed"));
            return;
          }

          // Check timeout
          if (Date.now() - startTime > maxWaitTime) {
            reject(new Error("Processing timeout"));
            return;
          }

          // Continue polling
          setTimeout(poll, pollInterval);
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  },
};
