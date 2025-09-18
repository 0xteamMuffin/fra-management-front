"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react"
import { s3Service } from "@/lib/api"
import { LoadingSpinner } from "@/components/ui/loading"
import { toast } from "sonner"

interface DocumentUploadProps {
  onDocumentsChange: (documents: { [key: string]: string }) => void // Changed to object with document type as key and S3 key as value
  uploadedDocuments: { [key: string]: string }
}

interface DocumentType {
  id: string
  name: string
  description: string
  required: boolean
  uploaded: boolean
  s3Key?: string
  uploading?: boolean
}

export function DocumentUpload({ onDocumentsChange, uploadedDocuments }: DocumentUploadProps) {
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
  ])

  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})

  // Update document types with uploaded status
  React.useEffect(() => {
    setDocumentTypes(prev => 
      prev.map(doc => ({
        ...doc,
        uploaded: !!uploadedDocuments[doc.id],
        s3Key: uploadedDocuments[doc.id],
      }))
    );
  }, [uploadedDocuments]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [])

  const handleFiles = async (files: FileList, documentType?: string) => {
    for (const file of Array.from(files)) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        continue;
      }

      // Validate file type
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only PDF, JPG, and PNG files are allowed");
        continue;
      }

      // Determine document type (use first available if not specified)
      const docType = documentType || documentTypes.find(doc => !doc.uploaded)?.id || 'general-document';
      
      try {
        // Set uploading state
        setDocumentTypes(prev => 
          prev.map(doc => 
            doc.id === docType ? { ...doc, uploading: true } : doc
          )
        );

        // Start progress tracking
        const fileId = `${Date.now()}-${file.name}`;
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

        // Simulate progress for UI feedback
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const currentProgress = prev[fileId] || 0;
            const newProgress = Math.min(currentProgress + Math.random() * 20, 90);
            return { ...prev, [fileId]: newProgress };
          });
        }, 200);

        // Upload to S3
        const s3Key = await s3Service.uploadFileComplete(file);
        
        // Clear progress interval
        clearInterval(progressInterval);
        
        if (s3Key) {
          // Complete progress
          setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
          
          // Update uploaded documents - now using object format
          const newDocuments = { ...uploadedDocuments, [docType]: s3Key };
          onDocumentsChange(newDocuments);
          
          // Update document types
          setDocumentTypes(prev => 
            prev.map(doc => 
              doc.id === docType 
                ? { ...doc, uploaded: true, s3Key, uploading: false }
                : doc
            )
          );
          
          toast.success(`${file.name} uploaded successfully`);
          
          // Remove from progress tracking after a delay
          setTimeout(() => {
            setUploadProgress(prev => {
              const newProgress = { ...prev };
              delete newProgress[fileId];
              return newProgress;
            });
          }, 2000);
        } else {
          throw new Error('Upload failed');
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`Failed to upload ${file.name}`);
        
        // Reset uploading state
        setDocumentTypes(prev => 
          prev.map(doc => 
            doc.id === docType ? { ...doc, uploading: false } : doc
          )
        );
        
        // Remove from progress tracking
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[`${Date.now()}-${file.name}`];
          return newProgress;
        });
      }
    }
  }

  const removeDocument = (documentType: string) => {
    // Remove from uploaded documents object
    const newDocuments = { ...uploadedDocuments };
    delete newDocuments[documentType];
    onDocumentsChange(newDocuments);
    
    // Update document types
    setDocumentTypes(prev => 
      prev.map(doc => 
        doc.id === documentType 
          ? { ...doc, uploaded: false, s3Key: undefined, uploading: false }
          : doc
      )
    );
    
    // Clear any progress tracking
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      Object.keys(newProgress).forEach(key => {
        if (key.includes(documentType)) {
          delete newProgress[key];
        }
      });
      return newProgress;
    });
  }

  return (
    <div className="space-y-6">
      {/* Document Types Checklist */}
      <Card className="border-border bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Required Documents</CardTitle>
          <CardDescription>Ensure you have all required documents before uploading</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documentTypes.map((doc) => (
              <div key={doc.id} className="flex items-start space-x-3 p-3 rounded-lg border border-border">
                <div className="mt-0.5">
                  {doc.required ? (
                    <AlertCircle className="h-4 w-4 text-primary" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-foreground">{doc.name}</h4>
                    {doc.required && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">Required</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card className="border-border bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Upload Documents</CardTitle>
          <CardDescription>Drag and drop files or click to browse</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Upload your documents</h3>
            <p className="text-sm text-muted-foreground mb-4">Drag and drop files here, or click to select files</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("file-upload")?.click()}
              className="bg-transparent"
            >
              <File className="mr-2 h-4 w-4" />
              Choose Files
            </Button>
            <input
              id="file-upload"
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
            />
            <p className="text-xs text-muted-foreground mt-4">
              Supported formats: PDF, JPG, PNG • Maximum size: 5MB per file
            </p>
          </div>

          {/* Uploaded Files List */}
          {(Object.keys(uploadProgress).length > 0 || uploadedDocuments.length > 0) && (
            <div className="mt-6 space-y-3">
              <h4 className="font-medium text-foreground">Uploaded Files</h4>

              {/* Files in progress */}
              {Object.entries(uploadProgress).map(([fileId, progress]) => (
                <div key={fileId} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                  <File className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{fileId.split("-").slice(1).join("-")}</p>
                    <div className="w-full bg-border rounded-full h-2 mt-1">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{progress}%</span>
                </div>
              ))}

              {/* Completed uploads */}
              {uploadedDocuments.map((documentId) => (
                <div key={documentId} className="flex items-center space-x-3 p-3 bg-accent/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{documentId.split("-").slice(1).join("-")}</p>
                    <p className="text-xs text-muted-foreground">Upload completed</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDocument(documentId)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
