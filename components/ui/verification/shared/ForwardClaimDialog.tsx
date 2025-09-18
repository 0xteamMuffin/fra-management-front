"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ForwardClaimDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (remarks: string) => void;
}

export function ForwardClaimDialog({
  isOpen,
  onOpenChange,
  onConfirm,
}: ForwardClaimDialogProps) {
  const [remarks, setRemarks] = useState("");

  const handleConfirm = () => {
    onConfirm(remarks);
    onOpenChange(false);
    setRemarks("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Forward Claim</DialogTitle>
          <DialogDescription>
            Add any remarks or notes before forwarding this claim to the next
            level.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="remarks">Remarks (Optional)</Label>
          <Textarea
            id="remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="e.g., All documents verified..."
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm & Forward</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
