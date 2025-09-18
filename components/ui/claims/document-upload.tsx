"use client";

import React from "react";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, File, X, CheckCircle, Eye, Loader2 } from "lucide-react";
import { s3Service } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DocumentUploadProps {
  onDocumentsChange: (documents: { [key: string]: string }) => void; // Changed to object with document type as key and S3 key as value
  uploadedDocuments: { [key: string]: string };
}

interface DocumentType {
  id: string;
  name: string;
  description: string;
  required: boolean;
  uploaded: boolean;
  s3Key?: string;
  uploading?: boolean;
}

export function DocumentUpload({
  onDocumentsChange,
  uploadedDocuments,
}: DocumentUploadProps) {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([
    {
      id: "identity-proof",
      name: "Identity Proof",
      description: "Aadhar Card, Voter ID, or Passport",
      required: true,
      uploaded: false,
    },
    {
      id: "address-proof",
      name: "Address Proof",
      description: "Utility bill, Bank statement, or Ration card",
      required: true,
      uploaded: false,
    },
    {
      id: "occupation-proof",
      name: "Occupation Proof",
      description: "Evidence of land occupation (photos, witness statements)",
      required: true,
      uploaded: false,
    },
    {
      id: "survey-settlement",
      name: "Survey Settlement Records",
      description: "Revenue records, Survey documents",
      required: false,
      uploaded: false,
    },
    {
      id: "genealogy",
      name: "Genealogy Documents",
      description: "Family tree, Birth certificates",
      required: false,
      uploaded: false,
    },
    {
      id: "community-certificate",
      name: "Community Certificate",
      description: "Tribal/Caste certificate",
      required: true,
      uploaded: false,
    },
  ]);

  const [dragActive, setDragActive] = useState<string | null>(null);

  // Update document types with uploaded status
  React.useEffect(() => {
    setDocumentTypes((prev) =>
      prev.map((doc) => ({
        ...doc,
        uploaded: !!uploadedDocuments[doc.id],
        s3Key: uploadedDocuments[doc.id],
      })),
    );
  }, [uploadedDocuments]);

  const handleDrag = useCallback((e: React.DragEvent, docId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(docId);
    } else if (e.type === "dragleave") {
      setDragActive(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, docId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0], docId);
    }
  }, []);

  const handleFile = async (file: File, documentType: string) => {
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error(`File ${file.name} exceeds the 10MB size limit.`);
      return;
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error(`File type for ${file.name} is not supported.`);
      return;
    }

    try {
      // Set uploading state
      setDocumentTypes((prev) =>
        prev.map((doc) =>
          doc.id === documentType ? { ...doc, uploading: true } : doc,
        ),
      );

      // Upload to S3
      const s3Key = await s3Service.uploadFileComplete(file);

      if (s3Key) {
        // Update uploaded documents
        const newDocuments = { ...uploadedDocuments, [documentType]: s3Key };
        onDocumentsChange(newDocuments);

        toast.success(`${file.name} uploaded successfully as ${documentType}`);
      } else {
        throw new Error("Upload failed to return S3 key");
      }
    } catch (error) {
      console.error("Upload error for file:", file.name, error);
      toast.error(`Failed to upload ${file.name}`);
    } finally {
      // Reset uploading state
      setDocumentTypes((prev) =>
        prev.map((doc) =>
          doc.id === documentType ? { ...doc, uploading: false } : doc,
        ),
      );
    }
  };

  const removeDocument = (documentType: string) => {
    // Remove from uploaded documents object
    const newDocuments = { ...uploadedDocuments };
    delete newDocuments[documentType];
    onDocumentsChange(newDocuments);
  };

  const viewDocument = async (s3Key: string) => {
    const toastId = toast.loading("Generating secure link...");
    try {
      const url = await s3Service.getViewUrl(s3Key);
      if (url) {
        toast.success("Link generated!", { id: toastId });
        window.open(url, "_blank");
      } else {
        toast.error("Could not generate link.", { id: toastId });
      }
    } catch (error) {
      toast.error("Failed to generate link.", { id: toastId });
    }
  };

  return (
    <div className="space-y-8">
      {documentTypes.map((doc) => (
        <div key={doc.id} className="space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-foreground flex items-center">
                {doc.name}
                {doc.required && (
                  <span className="text-xs text-red-500 ml-2">(Required)</span>
                )}
              </h4>
              <p className="text-sm text-muted-foreground">{doc.description}</p>
            </div>
            {doc.uploaded && doc.s3Key ? (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => viewDocument(doc.s3Key!)}
                >
                  <Eye className="h-4 w-4 mr-1" /> View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDocument(doc.id)}
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ) : doc.uploading ? (
              <Button variant="outline" size="sm" disabled>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Uploading...
              </Button>
            ) : null}
          </div>

          {!doc.uploaded && !doc.uploading && (
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                dragActive === doc.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50",
              )}
              onDragEnter={(e) => handleDrag(e, doc.id)}
              onDragLeave={(e) => handleDrag(e, doc.id)}
              onDragOver={(e) => handleDrag(e, doc.id)}
              onDrop={(e) => handleDrop(e, doc.id)}
            >
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop a file here, or
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  document.getElementById(`file-upload-${doc.id}`)?.click()
                }
              >
                <File className="mr-2 h-4 w-4" />
                Choose File
              </Button>
              <input
                id={`file-upload-${doc.id}`}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  e.target.files && handleFile(e.target.files[0], doc.id)
                }
                className="hidden"
              />
            </div>
          )}
          {doc.uploaded && (
            <div className="flex items-center p-3 bg-green-50 text-green-800 rounded-md">
              <CheckCircle className="h-5 w-5 mr-3" />
              <div>
                <p className="text-sm font-medium">
                  Document uploaded successfully.
                </p>
                <p className="text-xs">
                  S3 Key: {doc.s3Key?.substring(0, 40)}...
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
