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
  const { t } = useTranslation();
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
          <DialogTitle>{t("forward_claim_title")}</DialogTitle>
          <DialogDescription>
            {t("forward_claim_description")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="remarks">{t("label_remarks_optional")}</Label>
          <Textarea
            id="remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder={t("placeholder_remarks")}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("button_cancel")}
          </Button>
          <Button onClick={handleConfirm}>{t("button_confirm_forward")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}