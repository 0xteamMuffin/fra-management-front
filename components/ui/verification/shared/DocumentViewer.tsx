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
  if (!isOpen || !claim) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Documents for {claim.claimantName}</DialogTitle>
          <DialogDescription>
            Review the submitted evidence for this claim.
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
                  View
                </Button>
              </li>
            ))}
          </ul>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
