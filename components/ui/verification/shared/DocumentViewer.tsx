// @/components/ui/verification/shared/DocumentViewer.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, ArrowRight, Link as LinkIcon, File } from "lucide-react";
import { FRAClaim } from "@/lib/types/api";
import { useTranslation } from "react-i18next";

interface DocumentViewerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  claim: FRAClaim | null;
  onViewDocument: (s3Key: string) => Promise<void>;
}

export function DocumentViewer({
  isOpen,
  onOpenChange,
  claim,
  onViewDocument,
}: DocumentViewerProps) {
  const { t } = useTranslation();

  if (!isOpen || !claim) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {t("doc_viewer_title", { claimantName: claim.claimantName })}
          </DialogTitle>
          <DialogDescription>
            {t("doc_viewer_description")}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto p-1">
          <ul className="divide-y divide-border">
            {claim.evidence?.map((doc) => (
              <li
                key={doc.id}
                className="flex justify-between items-center py-3"
              >
                <div className="flex items-center">
                  <File className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{doc.category}</p>
                    <p className="text-xs text-muted-foreground">{doc.s3Key}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDocument(doc.s3Key)}
                >
                  <LinkIcon className="h-3 w-3 mr-1" />
                  {t("button_view")}
                </Button>
              </li>
            ))}
          </ul>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("button_close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}