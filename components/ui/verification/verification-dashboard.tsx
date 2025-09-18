// @/app/verification/page.tsx
"use client"

import { useState, useEffect } from "react";
import { GramPanchayatDashboard } from "./dashboards/GramPanchayatDashboard";
import { SdlcDashboard } from "./dashboards/SdlcDashboard";
import { DlcDashboard } from "./dashboards/DlcDashboard";
import type { ClaimRow } from "./shared/types";
import { Button } from "@/components/ui/button";
import { initialClaimsData } from "@/components/ui/verification/shared/sample-claims";
import { toast } from "sonner";
import { useClaims } from "@/lib/hooks/useClaims";
import { LoadingPage } from "@/components/ui/loading";
import { ApiError } from "@/components/ui/error-boundary";

export default function VerificationPortal() {
  const [currentUserRole, setCurrentUserRole] = useState<'GP' | 'SDLC' | 'DLC'>('GP');
  const [useMockData, setUseMockData] = useState(true); // Default to mock data initially
  const [mockClaims, setMockClaims] = useState<ClaimRow[]>(initialClaimsData);
  
  // Real claims data
  const { 
    claims: realClaims,
    isLoading: isLoadingClaims,
    error: claimsError,
    refreshClaims,
    verifyClaim,
    approveClaim,
    isVerifying,
    isApproving,
  } = useClaims({ autoFetch: !useMockData });

  // Use appropriate claims data based on mode
  const claims = useMockData ? mockClaims : realClaims;

  /**
   * Updates the status of a specific claim and shows a toast notification.
   */
  const handleStatusUpdate = async (claimId: string, newStatus: ClaimRow['status']) => {
    if (useMockData) {
      // Mock data update
      setMockClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: newStatus } : c));
    } else {
      // Real API update - need to find the actual UUID from display ID
      const realClaim = realClaims.find(claim => {
        const displayId = claim.id; // This might need mapping logic
        return displayId === claimId;
      });

      if (realClaim) {
        try {
          if (newStatus === 'Approved') {
            await approveClaim(realClaim.id);
          } else if (newStatus === 'Under SDLC Review') {
            await verifyClaim(realClaim.id);
          }
        } catch (error) {
          toast.error('Failed to update claim status');
          return;
        }
      }
    }

    // Show toast notification
    if (newStatus === 'Approved') {
      toast.success(`Claim ${claimId} has been approved!`);
    } else if (newStatus === 'Rejected') {
      toast.error(`Claim ${claimId} has been rejected.`);
    } else {
      toast.info(`Claim ${claimId} status updated to ${newStatus}.`);
    }
  };

  /**
   * Updates the entire record of a claim and shows a toast notification.
   */
  const handleUpdateClaim = async (updatedClaim: ClaimRow) => {
    if (useMockData) {
      // Mock data update
      setMockClaims(prevClaims => 
        prevClaims.map(claim => 
          claim.id === updatedClaim.id ? updatedClaim : claim
        )
      );
    } else {
      // Real API update - this would need more complex mapping
      // For now, just refresh the data
      try {
        await refreshClaims();
      } catch (error) {
        toast.error('Failed to update claim');
        return;
      }
    }
    
    toast.success(`Claim ${updatedClaim.id} has been saved successfully.`);
  };

  // Show loading state
  if (isLoadingClaims && !useMockData) {
    return <LoadingPage message="Loading claims data..." />;
  }

  return (
    <div className="p-4 md:p-8 space-y-6 bg-slate-50 min-h-screen">
      {/* Error handling */}
      {claimsError && !useMockData && (
        <ApiError error={claimsError} onRetry={() => refreshClaims()} />
      )}
      
      <div className="p-4 border rounded-lg bg-white shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Verification Portal Controls</h3>
          
          {/* Data source toggle */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={useMockData}
                onChange={(e) => setUseMockData(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-600">Use Mock Data</span>
            </label>
            {!useMockData && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refreshClaims()}
                disabled={isLoadingClaims}
              >
                Refresh Data
              </Button>
            )}
          </div>
        </div>
        <p className="text-sm text-slate-600 mb-2">Switch dashboard view based on user role:</p>
        <div className="flex flex-wrap gap-2">
          <Button variant={currentUserRole === 'GP' ? 'default' : 'outline'} onClick={() => setCurrentUserRole('GP')}>Gram Panchayat</Button>
          <Button variant={currentUserRole === 'SDLC' ? 'default' : 'outline'} onClick={() => setCurrentUserRole('SDLC')}>SDLC</Button>
          <Button variant={currentUserRole === 'DLC' ? 'default' : 'outline'} onClick={() => setCurrentUserRole('DLC')}>DLC</Button>
        </div>
      </div>
      
      <div className="p-4 md:p-6 border rounded-lg bg-white shadow-sm">
        {currentUserRole === 'GP' && (
          <GramPanchayatDashboard
            claims={claims}
            onForward={handleStatusUpdate}
            onSave={handleUpdateClaim} 
          />
        )}
        {currentUserRole === 'SDLC' && (
          <SdlcDashboard
            claims={claims}
            onForward={handleStatusUpdate}
          />
        )}
        {currentUserRole === 'DLC' && (
          <DlcDashboard
            claims={claims}
            onApprove={handleStatusUpdate}
            onReject={handleStatusUpdate}
          />
        )}
      </div>
    </div>
  );
}