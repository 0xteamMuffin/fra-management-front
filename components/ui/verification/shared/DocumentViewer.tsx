// src/components/ui/verification/shared/DocumentViewer.tsx
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowLeft, ArrowRight } from "lucide-react"

// --- Dummy Data ---
// Using placeholder images of documents since the backend is not ready.
// In a real app, you would fetch these URLs based on the claimId.
const DUMMY_DOCS = [
  "https://i.imgur.com/v1z4n1h.png", // Sample filled form
  "https://i.imgur.com/2vsdfj23.png", // Sample map document
  "https://i.imgur.com/mANEV26.png", // Sample ancestry proof
];

// --- Component Props ---
interface DocumentViewerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  claimId: string | null;
  claimantName: string | null;
}

// --- The Viewer Component ---
export function DocumentViewer({ isOpen, onOpenChange, claimId, claimantName }: DocumentViewerProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = DUMMY_DOCS.length;

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // Reset to the first page every time the dialog is opened.
  React.useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
    }
  }, [isOpen]);

  if (!isOpen || !claimId) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Documents for {claimantName || `Claim ${claimId}`}</DialogTitle>
          <DialogDescription>
            Review the submitted documents. Use the arrows to navigate pages.
          </DialogDescription>
        </DialogHeader>

        {/* Image Display Area */}
        <div className="flex-grow flex items-center justify-center bg-slate-200 rounded-md overflow-hidden p-2">
          <img
            src={DUMMY_DOCS[currentPage - 1]}
            alt={`Document for claim ${claimId} page ${currentPage}`}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Pagination Controls */}
        <DialogFooter className="flex-shrink-0 !justify-center sm:!justify-center">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={goToPrevPage} disabled={currentPage === 1}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Previous Page</span>
            </Button>
            <span className="text-sm font-medium text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button variant="outline" size="icon" onClick={goToNextPage} disabled={currentPage === totalPages}>
              <ArrowRight className="h-4 w-4" />
              <span className="sr-only">Next Page</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}