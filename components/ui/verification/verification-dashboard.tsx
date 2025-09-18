// @/app/verification/page.tsx
"use client"

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

export default function VerificationPortal() {
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
      toast.success(`Claim has been forwarded successfully.`);
    } catch (error) {
      toast.error('Failed to forward claim');
    }
  };

  const handleStatusUpdate = async (claimId: string, newStatus: ClaimRow['status']) => {
    const originalClaim = rawClaims.find(c => generateClaimDisplayId(c) === claimId);

    if (!originalClaim) {
      toast.error("Could not find the original claim to update.");
      return;
    }

    try {
      if (newStatus === 'Approved') {
        await approveClaim(originalClaim.id);
        toast.success(`Claim ${claimId} has been approved!`);
      } else if (newStatus === 'Rejected') {
        toast.error(`Claim ${claimId} has been rejected.`);
      }
    } catch (error) {
      toast.error('Failed to update claim status');
    }
  };
  
  const handleUpdateClaim = async (updatedClaim: ClaimRow) => {
    toast.success(`Claim ${updatedClaim.id} has been saved successfully.`);
  };

  if (isLoadingClaims) {
    return <LoadingPage message="Loading claims data..." />;
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
        return <p>You do not have the required role to view this dashboard.</p>;
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="p-4 md:p-6 border rounded-lg bg-white shadow-sm">
        {renderDashboardByRole()}
      </div>
    </div>
  );
}