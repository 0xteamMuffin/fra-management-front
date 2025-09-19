// @/app/verification/page.tsx
"use client";

import { useState, useEffect } from "react";
import { GramPanchayatDashboard } from "./dashboards/GramPanchayatDashboard";
import { SdlcDashboard } from "./dashboards/SdlcDashboard";
import { DlcDashboard } from "./dashboards/DlcDashboard";
import type { ClaimRow } from "./shared/types";
import { toast } from "sonner";
import { useClaims } from "@/lib/hooks/useClaims";
import { LoadingPage } from "@/components/ui/loading";
import { ApiError } from "@/components/ui/error-boundary";
import { useAuth } from "@/contexts/auth-context";
import { UserRole } from "@/lib/types/api";
import { generateClaimDisplayId } from "@/lib/utils/claim-helpers";
import { useTranslation } from "react-i18next"; // 1. Import useTranslation

export default function VerificationPortal() {
  const { t } = useTranslation(); // 2. Initialize the t function
  const { user } = useAuth();

  const {
    claims,
    rawClaims,
    isLoading: isLoadingClaims,
    error: claimsError,
    verifyClaim,
    forwardClaim,
    approveClaim,
    rejectClaim,
  } = useClaims({ autoFetch: true });

  const handleForwardClaim = async (claimId: string, remarks: string) => {
    try {
      // claimId here is the real UUID from the dashboard, so we can use it directly
      await forwardClaim(claimId, remarks);
      toast.success(t("toast_forward_success")); // Mapped
    } catch (error) {
      toast.error(t("toast_forward_error")); // Mapped
    }
  };

  const handleStatusUpdate = async (
    claimId: string,
    newStatus: ClaimRow["status"],
  ) => {
    const originalClaim = rawClaims.find(
      (c) => generateClaimDisplayId(c) === claimId,
    );

    if (!originalClaim) {
      toast.error(t("toast_find_claim_error")); // Mapped
      return;
    }

    try {
      if (newStatus === "Approved") {
        await approveClaim(originalClaim.id);
        toast.success(t("toast_approve_success", { claimId })); // Mapped with variable
      } else if (newStatus === "Rejected") {
        // Assuming rejectClaim is handled elsewhere or by the component itself
        toast.error(t("toast_reject_success", { claimId })); // Mapped with variable
      }
    } catch (error) {
      toast.error(t("toast_status_update_error")); // Mapped
    }
  };

  const handleUpdateClaim = async (updatedClaim: ClaimRow) => {
    // Logic for updating claim would go here.
    // Simulating success for the toast message.
    toast.success(t("toast_save_success", { claimId: updatedClaim.id })); // Mapped with variable
  };

  if (isLoadingClaims) {
    return <LoadingPage message={t("loading_claims_data")} />; // Mapped
  }

  if (claimsError) {
    return <ApiError error={claimsError} />;
  }

  const renderDashboardByRole = () => {
    switch (user?.role) {
      case UserRole.GramSabha:
        return (
          <GramPanchayatDashboard
            claims={claims}
            rawClaims={rawClaims}
            onForward={handleForwardClaim}
            onSave={handleUpdateClaim}
          />
        );
      case UserRole.SubDivisionalCommittee:
        return (
          <SdlcDashboard
            claims={claims}
            rawClaims={rawClaims}
            onForward={handleForwardClaim}
          />
        );
      case UserRole.DistrictCommittee:
        return (
          <DlcDashboard
            claims={claims}
            rawClaims={rawClaims}
            onApprove={handleStatusUpdate}
            onReject={rejectClaim}
          />
        );
      default:
        return <p>{t("unauthorized_role_message")}</p>; // Mapped
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="p-4 md:p-6 border rounded-lg bg-white shadow-sm">
        {renderDashboardByRole()}
      </div>
    </div>
  );
}