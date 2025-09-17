// @/app/verification/dashboards/SdlcDashboard.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Send, FileText, AlertCircle, CheckSquare } from "lucide-react"
import { ClaimsTable } from "../shared/ClaimsTable"
import { StatCard } from "../shared/StatCards"
import type { ClaimRow } from "../shared/types"
import { DocumentViewer } from "../shared/DocumentViewer"

interface Props {
  claims: ClaimRow[];
  onForward: (claimId: string, newStatus: ClaimRow['status']) => void;
}

export function SdlcDashboard({ claims, onForward }: Props) {
  const claimsToReview = claims.filter(c => c.status === 'Under SDLC Review').length;
  const claimsForwarded = claims.filter(c => c.status === 'Under DLC Review').length;
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<ClaimRow | null>(null);

  const handleViewDocuments = (claim: ClaimRow) => {
    setSelectedClaim(claim);
    setIsViewerOpen(true);
  };
  
  return (
    <div className="space-y-6">
       <h1 className="text-3xl font-bold text-blue-800">SDLC Dashboard</h1>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Under SDLC Review" value={claimsToReview} description="Claims received from Gram Panchayats" Icon={AlertCircle} iconColorClass="text-amber-500" />
        <StatCard title="Forwarded to DLC" value={claimsForwarded} description="Claims sent for final district approval" Icon={CheckSquare} iconColorClass="text-blue-500" />
      </div>
       <ClaimsTable
        claims={claims}
        filterHierarchy={['Village']}
        renderActions={(claim) => (
          claim.status === 'Under SDLC Review' && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleViewDocuments(claim)}><FileText size={14} className="mr-1" /> View Docs</Button>
              <Button variant="outline" size="sm" onClick={() => onForward(claim.id, 'Under DLC Review')}><Send size={14} className="mr-1" /> Forward to DLC</Button>
            </div>
          )
        )}
      />
      <DocumentViewer
              isOpen={isViewerOpen}
              onOpenChange={setIsViewerOpen}
              claimId={selectedClaim?.id ?? null}
              // CHANGED: Use 'applicantName' to match the new data structure
              claimantName={selectedClaim?.applicantName ?? null}
            />
    </div>
  )
}