"use client"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { ShieldCheck, Award, XCircle } from "lucide-react"
import { ClaimsTable } from "@/components/ui/verification/shared/ClaimsTable"
import { StatCard } from "@/components/ui/verification/shared/StatCards"
import type { ClaimRow } from "@/components/ui/verification/shared/types"

interface Props {
  claims: ClaimRow[];
  onApprove: (claimId: string, newStatus: ClaimRow['status']) => void;
  onReject: (claimId: string, newStatus: ClaimRow['status']) => void;
}

export function DlcDashboard({ claims, onApprove, onReject }: Props) {
  const claimsForDecision = claims.filter(c => c.status === 'Under DLC Review').length;
  const totalApproved = claims.filter(c => c.status === 'Approved').length;
  const totalRejected = claims.filter(c => c.status === 'Rejected').length;

  return (
    <div className="space-y-6">
       <h1 className="text-3xl font-bold text-purple-800">DLC Dashboard</h1>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending Final Decision" value={claimsForDecision} description="Claims awaiting final approval" Icon={ShieldCheck} iconColorClass="text-purple-500" />
        <StatCard title="Total Approved" value={totalApproved} description="Claims with titles issued" Icon={Award} iconColorClass="text-green-500" />
        <StatCard title="Total Rejected" value={totalRejected} description="Claims that have been denied" Icon={XCircle} iconColorClass="text-red-500" />
      </div>
       <ClaimsTable
        claims={claims}
        renderActions={(claim) => (
          claim.status === 'Under DLC Review' && (
            <>
              <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700" onClick={() => onApprove(claim.id, 'Approved')}><Check size={14} className="mr-1" /> Approve</Button>
              <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => onReject(claim.id, 'Rejected')}><X size={14} className="mr-1" /> Reject</Button>
            </>
          )
        )}
      />
    </div>
  )
}