// The original file you provided, now updated.
"use client"

import { useState } from "react" // 1. Import useState
import { Button } from "@/components/ui/button"
import { FileText, Pencil, Send } from "lucide-react"
import { Clock, AlertCircle } from "lucide-react"
import { ClaimsTable } from "@/components/ui/verification/shared/ClaimsTable"
import { StatCard } from "@/components/ui/verification/shared/StatCards"
import type { ClaimRow } from "@/components/ui/verification/shared/types"
import { DocumentViewer } from "@/components/ui/verification/shared/DocumentViewer" // 2. Import the new component

interface Props {
  claims: ClaimRow[];
  onForward: (claimId: string, newStatus: ClaimRow['status']) => void;
  onEdit: (claimId: string) => void;
  // The 'onViewDocuments' prop has been removed as the logic is now handled inside this component.
}

export function GramPanchayatDashboard({ claims, onForward, onEdit }: Props) {
  // 3. Add state to manage the document viewer dialog
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<ClaimRow | null>(null);

  const claimsToVerify = claims.filter(c => c.status === 'Awaiting FRC Verification').length;
  const claimsForwarded = claims.filter(c => c.status === 'Under SDLC Review').length;

  // 4. Create a handler to open the viewer and set the selected claim
  const handleViewDocuments = (claim: ClaimRow) => {
    setSelectedClaim(claim);
    setIsViewerOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-green-800">Gram Panchayat Dashboard</h1>
          <p className="text-slate-600">Manage and verify local forest rights claims.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Awaiting Verification" value={claimsToVerify} description="Claims to be reviewed by FRC" Icon={Clock} iconColorClass="text-yellow-500" />
        <StatCard title="Forwarded to SDLC" value={claimsForwarded} description="Claims sent for sub-divisional review" Icon={AlertCircle} iconColorClass="text-amber-500" />
      </div>

      <ClaimsTable
        claims={claims}
        renderActions={(claim) => (
          claim.status === 'Awaiting FRC Verification' && (
            // Added a wrapper div for better spacing and alignment
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(claim.id)}><Pencil size={14} className="mr-1" /> Edit</Button>
              {/* 5. Update the onClick handler for the "View Docs" button */}
              <Button variant="outline" size="sm" onClick={() => handleViewDocuments(claim)}><FileText size={14} className="mr-1" /> View Docs</Button>
              <Button variant="outline" size="sm" onClick={() => onForward(claim.id, 'Under SDLC Review')}><Send size={14} className="mr-1" /> Forward</Button>
            </div>
          )
        )}
      />

      {/* 6. Render the DocumentViewer. It will only be visible when its state is open. */}
      <DocumentViewer
        isOpen={isViewerOpen}
        onOpenChange={setIsViewerOpen}
        claimId={selectedClaim?.id ?? null}
        claimantName={selectedClaim?.applicant ?? null}
      />
    </div>
  )
}