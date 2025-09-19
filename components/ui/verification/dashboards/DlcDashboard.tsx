// @/app/verification/dashboards/DlcDashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Check, X, Filter, Clock } from "lucide-react";
import { ClaimsTable } from "../shared/ClaimsTable";
import { StatCard } from "../shared/StatCards";
import type { ClaimRow } from "../shared/types";
import { DocumentViewer } from "../shared/DocumentViewer";
import { RejectClaimDialog } from "../shared/RejectClaimDialog";
import { useGeographicHierarchy } from "@/lib/hooks/useGeographic";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FRAClaim } from "@/lib/types/api";
import { s3Service } from "@/lib/api";
import { toast } from "sonner";
import { generateClaimDisplayId } from "@/lib/utils/claim-helpers";
import { useDashboardStats } from "@/lib/hooks/useDashboardStats";
import { useTranslation } from "react-i18next";

interface Props {
  claims: ClaimRow[];
  rawClaims: FRAClaim[];
  onApprove: (claimId: string, newStatus: "Approved") => void;
  onReject: (claimId: string, reason: string) => void;
}

export function DlcDashboard({
  claims,
  rawClaims,
  onApprove,
  onReject,
}: Props) {
  const { t } = useTranslation();
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<FRAClaim | null>(null);
  const [selectedVillage, setSelectedVillage] = useState<string>("all");
  const { villages } = useGeographicHierarchy();
  const { stats, fetchStats } = useDashboardStats();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const filteredClaims =
    selectedVillage === "all"
      ? claims
      : claims.filter(
          (c) =>
            rawClaims.find((rc) => rc.id === c.id)?.villageId ===
            selectedVillage,
        );

  const handleViewDocuments = (claim: ClaimRow) => {
    const originalClaim = rawClaims.find(
      (c) => generateClaimDisplayId(c) === claim.id,
    );
    setSelectedClaim(originalClaim || null);
    setIsViewerOpen(true);
  };

  const handleRejectClick = (claim: ClaimRow) => {
    const originalClaim = rawClaims.find(
      (c) => generateClaimDisplayId(c) === claim.id,
    );
    setSelectedClaim(originalClaim || null);
    setIsRejectDialogOpen(true);
  };

  const handleConfirmReject = async (reason: string) => {
    if (selectedClaim) {
      await onReject(selectedClaim.id, reason);
      fetchStats(); // Re-fetch stats after rejecting
    }
  };

  const handleApprove = async (claimId: string) => {
    await onApprove(claimId, "Approved");
    fetchStats(); // Re-fetch stats after approving
  };

  const handleViewDocument = async (s3Key: string) => {
    const toastId = toast.loading(t("toast_generating_link"));
    const url = await s3Service.getViewUrl(s3Key);
    if (url) {
      toast.success(t("toast_link_generated"), { id: toastId });
      window.open(url, "_blank");
    } else {
      toast.error(t("toast_link_error"), { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-red-800">
        {t("dlc_dashboard_title")}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t("stat_pending_final_review")}
          value={stats?.toReviewDlc || 0}
          description={t("stat_pending_final_review_desc")}
          Icon={Clock}
          iconColorClass="text-amber-500"
        />
        <StatCard
          title={t("stat_total_approved")}
          value={stats?.granted || 0}
          description={t("stat_total_approved_desc")}
          Icon={Check}
          iconColorClass="text-green-500"
        />
        <StatCard
          title={t("stat_total_rejected")}
          value={stats?.rejected || 0}
          description={t("stat_total_rejected_desc")}
          Icon={X}
          iconColorClass="text-red-500"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Filter className="h-5 w-5 text-muted-foreground" />
        <Select value={selectedVillage} onValueChange={setSelectedVillage}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t("filter_by_village")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all_villages")}</SelectItem>
            {villages.map((v) => (
              <SelectItem key={v.id} value={v.id}>
                {v.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ClaimsTable
        claims={filteredClaims}
        renderActions={(claim) =>
          claim.status === "Under DLC Review" && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewDocuments(claim)}
              >
                <FileText size={14} className="mr-1" /> {t("button_view_docs")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
                onClick={() => handleApprove(claim.id)}
              >
                <Check size={14} className="mr-1" /> {t("button_approve")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => handleRejectClick(claim)}
              >
                <X size={14} className="mr-1" /> {t("button_reject")}
              </Button>
            </div>
          )
        }
      />
      <DocumentViewer
        isOpen={isViewerOpen}
        onOpenChange={setIsViewerOpen}
        claim={selectedClaim}
        onViewDocument={handleViewDocument}
      />
      <RejectClaimDialog
        isOpen={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
        onConfirm={handleConfirmReject}
      />
    </div>
  );
}