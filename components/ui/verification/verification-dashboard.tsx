// @/app/verification/page.tsx
"use client"

import { useState } from "react";
import { GramPanchayatDashboard } from "./dashboards/GramPanchayatDashboard";
import { SdlcDashboard } from "./dashboards/SdlcDashboard";
import { DlcDashboard } from "./dashboards/DlcDashboard";
import type { ClaimRow } from "./shared/types";
import { Button } from "@/components/ui/button";
import { initialClaimsData } from "@/components/ui/verification/shared/sample-claims";
import { toast } from "sonner"; // 1. Import the toast function

export default function VerificationPortal() {
  const [claims, setClaims] = useState<ClaimRow[]>(initialClaimsData);
  const [currentUserRole, setCurrentUserRole] = useState<'GP' | 'SDLC' | 'DLC'>('GP');

  /**
   * Updates the status of a specific claim and shows a toast notification.
   */
  const handleStatusUpdate = (claimId: string, newStatus: ClaimRow['status']) => {
    setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: newStatus } : c));

    // 2. Trigger a specific toast based on the action from the DLC Dashboard
    if (newStatus === 'Approved') {
      toast.success(`Claim ${claimId} has been approved!`);
    } else if (newStatus === 'Rejected') {
      toast.error(`Claim ${claimId} has been rejected.`);
    } else {
      // A default toast for other status changes (like forwarding)
      toast.info(`Claim ${claimId} status updated to ${newStatus}.`);
    }
  };

  /**
   * Updates the entire record of a claim and shows a toast notification.
   */
  const handleUpdateClaim = (updatedClaim: ClaimRow) => {
    setClaims(prevClaims => 
      prevClaims.map(claim => 
        claim.id === updatedClaim.id ? updatedClaim : claim
      )
    );
    // You can add a toast here too!
    toast.success(`Claim ${updatedClaim.id} has been saved successfully.`);
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