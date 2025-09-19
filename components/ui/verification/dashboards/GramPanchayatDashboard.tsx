// @/app/verification/dashboards/GramPanchayatDashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Pencil,
  Send,
  Clock,
  AlertCircle,
  Filter,
} from "lucide-react";
import { ClaimsTable } from "../shared/ClaimsTable";
import { StatCard } from "../shared/StatCards";
import type { ClaimRow } from "../shared/types";
import { DocumentViewer } from "../shared/DocumentViewer";
import { EditClaimForm } from "../shared/EditClaimForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGeographicHierarchy } from "@/lib/hooks/useGeographic";
import { FRAClaim } from "@/lib/types/api";
import { s3Service } from "@/lib/api";
import { toast } from "sonner";
import { ForwardClaimDialog } from "../shared/ForwardClaimDialog";
import { generateClaimDisplayId } from "@/lib/utils/claim-helpers";
import { useDashboardStats } from "@/lib/hooks/useDashboardStats";
import { useTranslation } from "react-i18next"; // 1. Import useTranslation

interface Props {
  claims: ClaimRow[];
  rawClaims: FRAClaim[];
  onForward: (claimId: string, remarks: string) => void;
  onSave: (updatedClaim: ClaimRow) => void;
}

export function GramPanchayatDashboard({
  claims,
  rawClaims,
  onForward,
  onSave,
}: Props) {
  const { t } = useTranslation(); // 2. Initialize the t function
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isForwardDialogOpen, setIsForwardDialogOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<FRAClaim | null>(null);
  const [editingClaim, setEditingClaim] = useState<ClaimRow | null>(null);
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

  const handleEdit = (claim: ClaimRow) => {
    setEditingClaim(claim);
  };

  const handleSaveClaim = (updatedClaim: ClaimRow) => {
    onSave(updatedClaim);
    setEditingClaim(null);
  };

  const handleForwardClick = (claim: ClaimRow) => {
    const originalClaim = rawClaims.find(
      (c) => generateClaimDisplayId(c) === claim.id,
    );
    setSelectedClaim(originalClaim || null);
    setIsForwardDialogOpen(true);
  };

  const handleConfirmForward = async (remarks: string) => {
    if (selectedClaim) {
      await onForward(selectedClaim.id, remarks);
      fetchStats(); // Re-fetch stats after forwarding
    }
  };

  const handleViewDocument = async (s3Key: string) => {
    const toastId = toast.loading(t("toast_generating_link")); // Mapped
    const url = await s3Service.getViewUrl(s3Key);
    if (url) {
      toast.success(t("toast_link_generated"), { id: toastId }); // Mapped
      window.open(url, "_blank");
    } else {
      toast.error(t("toast_link_error"), { id: toastId }); // Mapped
    }
  };

  if (editingClaim) {
    return (
      <EditClaimForm
        claim={editingClaim}
        onBack={() => setEditingClaim(null)}
        onSave={handleSaveClaim}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          {t("gp_dashboard_title")} {/* Mapped */}
        </h1>
        <p className="text-green-100 text-lg">
          {t("gp_dashboard_subtitle")} {/* Mapped */}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200 shadow-md hover:shadow-lg transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-yellow-800">{stats?.pending || 0}</h3>
              <p className="text-yellow-600 font-medium">{t("stat_awaiting_verification")}</p>
              <p className="text-yellow-500 text-sm">{t("stat_awaiting_verification_desc")}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200 shadow-md hover:shadow-lg transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-amber-800">{stats?.forwardedToSdlc || 0}</h3>
              <p className="text-amber-600 font-medium">{t("stat_forwarded_to_sdlc")}</p>
              <p className="text-amber-500 text-sm">{t("stat_forwarded_to_sdlc_desc")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Filter className="h-5 w-5 text-green-600" />
          </div>
          <Select value={selectedVillage} onValueChange={setSelectedVillage}>
            <SelectTrigger className="w-[200px] border-green-200 focus:border-green-500 focus:ring-green-200 rounded-lg">
              <SelectValue placeholder={t("filter_by_village")} /> {/* Mapped */}
            </SelectTrigger>
            <SelectContent className="border-green-200">
              <SelectItem value="all">{t("all_villages")}</SelectItem> {/* Mapped */}
              {villages.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Claims Overview
          </h3>
        </div>
        <div className="p-6">
          <ClaimsTable
            claims={filteredClaims}
            renderActions={(claim) =>
              claim.status === "Awaiting FRC Verification" && (
                <div className="flex items-center flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(claim)}
                    className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 rounded-lg transition-all duration-200"
                  >
                    <Pencil size={14} className="mr-1" /> {t("button_edit")}{" "}
                    {/* Mapped */}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDocuments(claim)}
                    className="border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 rounded-lg transition-all duration-200"
                  >
                    <FileText size={14} className="mr-1" /> {t("button_view_docs")}{" "}
                    {/* Mapped */}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleForwardClick(claim)}
                    className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 rounded-lg transition-all duration-200"
                  >
                    <Send size={14} className="mr-1" /> {t("button_forward")}{" "}
                    {/* Mapped */}
                  </Button>
                </div>
              )
            }
          />
        </div>
      </div>

      <DocumentViewer
        isOpen={isViewerOpen}
        onOpenChange={setIsViewerOpen}
        claim={selectedClaim}
        onViewDocument={handleViewDocument}
      />
      <ForwardClaimDialog
        isOpen={isForwardDialogOpen}
        onOpenChange={setIsForwardDialogOpen}
        onConfirm={handleConfirmForward}
      />
    </div>
  );
}