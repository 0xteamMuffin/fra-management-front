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
import { useTranslation } from "react-i18next";

interface RejectClaimDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
}

export function RejectClaimDialog({
  isOpen,
  onOpenChange,
  onConfirm,
}: RejectClaimDialogProps) {
  const { t } = useTranslation();
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason);
      onOpenChange(false);
      setReason("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("reject_claim_title")}</DialogTitle>
          <DialogDescription>
            {t("reject_claim_description")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="rejection-reason">
            {t("label_rejection_reason")}
          </Label>
          <Textarea
            id="rejection-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t("placeholder_rejection_reason")}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("button_cancel")}
          </Button>
          <Button onClick={handleConfirm} disabled={!reason.trim()}>
            {t("button_confirm_rejection")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}