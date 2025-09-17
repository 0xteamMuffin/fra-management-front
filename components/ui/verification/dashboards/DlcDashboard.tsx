// @/app/verification/dashboards/DlcDashboard.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText, AlertCircle, Check, X } from "lucide-react"
import { ClaimsTable } from "../shared/ClaimsTable"
import { StatCard } from "../shared/StatCards"
import type { ClaimRow } from "../shared/types"
import { DocumentViewer } from "../shared/DocumentViewer"

interface Props {
  claims: ClaimRow[];
  onApprove: (claimId: string, newStatus: 'Approved') => void;
  onReject: (claimId: string, newStatus: 'Rejected') => void;
}

export function DlcDashboard({ claims, onApprove, onReject }: Props) {
  const claimsToReview = claims.filter(c => c.status === 'Under DLC Review').length;
  const claimsApproved = claims.filter(c => c.status === 'Approved').length;
  const claimsRejected = claims.filter(c => c.status === 'Rejected').length;

  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<ClaimRow | null>(null);

  const handleViewDocuments = (claim: ClaimRow) => {
    setSelectedClaim(claim);
    setIsViewerOpen(true);
  };
  
  return (
    <div className="space-y-6">
       <h1 className="text-3xl font-bold text-red-800">DLC Dashboard</h1>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Pending Final Review" value={claimsToReview} description="Claims received from SDLCs" Icon={AlertCircle} iconColorClass="text-amber-500" />
          <StatCard title="Total Approved" value={claimsApproved} description="Claims approved by the District Committee" Icon={Check} iconColorClass="text-green-500" />
          <StatCard title="Total Rejected" value={claimsRejected} description="Claims rejected by the District Committee" Icon={X} iconColorClass="text-red-500" />
       </div>
       <ClaimsTable
        claims={claims}
        filterHierarchy={['District', 'Village']}
        renderActions={(claim) => (
          claim.status === 'Under DLC Review' && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleViewDocuments(claim)}><FileText size={14} className="mr-1" /> View Docs</Button>
              <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700" onClick={() => onApprove(claim.id, 'Approved')}><Check size={14} className="mr-1" /> Approve</Button>
              <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => onReject(claim.id, 'Rejected')}><X size={14} className="mr-1" /> Reject</Button>
            </div>
          )
        )}
      />
      <DocumentViewer
          isOpen={isViewerOpen}
          onOpenChange={setIsViewerOpen}
          claimId={selectedClaim?.id ?? null}
          claimantName={selectedClaim?.applicantName ?? null}
        />
    </div>
  )
}