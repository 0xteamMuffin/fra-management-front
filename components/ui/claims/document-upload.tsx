"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, File, X, CheckCircle, Eye, Loader2 } from "lucide-react";
import { s3Service } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next"; // Import the hook

interface DocumentUploadProps {
  onDocumentsChange: (documents: { [key: string]: string }) => void;
  uploadedDocuments: { [key: string]: string };
}

// Define a type for the state that includes translation keys
interface DocumentTypeState {
  id: string;
  nameKey: string;
  descKey: string;
  required: boolean;
  uploaded: boolean;
  s3Key?: string;
  uploading?: boolean;
}

// Configuration array with stable keys
const DOCUMENT_CONFIG = [
  { id: "identity-proof", nameKey: "docNameIdentity", descKey: "docDescIdentity", required: true },
  { id: "address-proof", nameKey: "docNameAddress", descKey: "docDescAddress", required: true },
  { id: "occupation-proof", nameKey: "docNameOccupation", descKey: "docDescOccupation", required: true },
  { id: "survey-settlement", nameKey: "docNameSurvey", descKey: "docDescSurvey", required: false },
  { id: "genealogy", nameKey: "docNameGenealogy", descKey: "docDescGenealogy", required: false },
  { id: "community-certificate", nameKey: "docNameCommunity", descKey: "docDescCommunity", required: true },
];

export function DocumentUpload({
  onDocumentsChange,
  uploadedDocuments,
}: DocumentUploadProps) {
  const { t } = useTranslation(); // Initialize the translation hook

  // Initialize state with keys, uploaded status will be added
  const [documentTypes, setDocumentTypes] = useState<DocumentTypeState[]>(
    DOCUMENT_CONFIG.map(doc => ({ ...doc, uploaded: false }))
  );
  
  const [dragActive, setDragActive] = useState<string | null>(null);

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

  const handleFile = async (file: File, documentTypeId: string) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error(t("toastErrorFileSize", { fileName: file.name }));
      return;
    }

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(t("toastErrorFileType", { fileName: file.name }));
      return;
    }

    try {
      setDocumentTypes((prev) =>
        prev.map((doc) => doc.id === documentTypeId ? { ...doc, uploading: true } : doc),
      );

      const s3Key = await s3Service.uploadFileComplete(file);

      if (s3Key) {
        const newDocuments = { ...uploadedDocuments, [documentTypeId]: s3Key };
        onDocumentsChange(newDocuments);

        const docConfig = documentTypes.find(d => d.id === documentTypeId);
        const docName = docConfig ? t(docConfig.nameKey) : documentTypeId;
        toast.success(t("toastSuccessUpload", { fileName: file.name, docName }));
      } else {
        throw new Error(t("toastErrorS3Key"));
      }
    } catch (error) {
      console.error("Upload error for file:", file.name, error);
      toast.error(t("toastErrorUploadFailed", { fileName: file.name }));
    } finally {
      setDocumentTypes((prev) =>
        prev.map((doc) => doc.id === documentTypeId ? { ...doc, uploading: false } : doc),
      );
    }
  };

  const removeDocument = (documentType: string) => {
    const newDocuments = { ...uploadedDocuments };
    delete newDocuments[documentType];
    onDocumentsChange(newDocuments);
  };

  const viewDocument = async (s3Key: string) => {
    const toastId = toast.loading(t("toastLoadingLink"));
    try {
      const url = await s3Service.getViewUrl(s3Key);
      if (url) {
        toast.success(t("toastSuccessLink"), { id: toastId });
        window.open(url, "_blank");
      } else {
        toast.error(t("toastErrorLink"), { id: toastId });
      }
    } catch (error) {
      toast.error(t("toastErrorLinkFailed"), { id: toastId });
    }
  };

  return (
    <div className="space-y-8">
      {documentTypes.map((doc) => (
        <div key={doc.id} className="space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-foreground flex items-center">
                {t(doc.nameKey)}
                {doc.required && (
                  <span className="text-xs text-red-500 ml-2">{t("requiredLabel")}</span>
                )}
              </h4>
              <p className="text-sm text-muted-foreground">{t(doc.descKey)}</p>
            </div>
            {doc.uploaded && doc.s3Key ? (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => viewDocument(doc.s3Key!)}>
                  <Eye className="h-4 w-4 mr-1" /> {t("viewButton")}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => removeDocument(doc.id)}>
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ) : doc.uploading ? (
              <Button variant="outline" size="sm" disabled>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" /> {t("uploadingButton")}
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
                {t("dragAndDropPrompt")}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById(`file-upload-${doc.id}`)?.click()}
              >
                <File className="mr-2 h-4 w-4" />
                {t("chooseFileButton")}
              </Button>
              <input
                id={`file-upload-${doc.id}`}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => e.target.files && handleFile(e.target.files[0], doc.id)}
                className="hidden"
              />
            </div>
          )}
          {doc.uploaded && (
            <div className="flex items-center p-3 bg-green-50 text-green-800 rounded-md">
              <CheckCircle className="h-5 w-5 mr-3" />
              <div>
                <p className="text-sm font-medium">{t("uploadSuccessMessage")}</p>
                <p className="text-xs">
                  {t("s3KeyLabel")} {doc.s3Key?.substring(0, 40)}...
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}