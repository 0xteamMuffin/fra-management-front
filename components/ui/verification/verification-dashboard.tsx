"use client"

import { useState } from "react";
import { GramPanchayatDashboard } from "./dashboards/GramPanchayatDashboard";
import { SdlcDashboard } from "./dashboards/SdlcDashboard";
import { DlcDashboard } from "./dashboards/DlcDashboard";
import type { ClaimRow } from "./shared/types";
import { Button } from "@/components/ui/button";
import { initialClaimsData } from "@/components/ui/verification/shared/sample-claims"; // Using the updated data source

export function VerificationPortal() {
  const [claims, setClaims] = useState<ClaimRow[]>(initialClaimsData);
  const [currentUserRole, setCurrentUserRole] = useState<'GP' | 'SDLC' | 'DLC'>('GP');

  /**
   * Updates the status of a specific claim.
   * Used for forwarding, approving, or rejecting claims.
   */
  const handleStatusUpdate = (claimId: string, newStatus: ClaimRow['status']) => {
    setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: newStatus } : c));
    alert(`Claim ${claimId} status updated to ${newStatus}`);
  };

  /**
   * Updates the entire record of a claim with new data.
   * Used when saving changes from the edit form.
   */
  const handleUpdateClaim = (updatedClaim: ClaimRow) => {
    setClaims(prevClaims => 
      prevClaims.map(claim => 
        claim.id === updatedClaim.id ? updatedClaim : claim
      )
    );
    alert(`Claim ${updatedClaim.id} has been saved.`);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="p-4 border rounded-lg bg-white shadow-sm">
        <h3 className="font-semibold text-lg">Verification Portal Controls</h3>
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