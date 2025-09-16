"use client"
import { Button } from "@/components/ui/button"
import { FilePlus, FileText, Pencil, Send } from "lucide-react"
import { Clock, AlertCircle } from "lucide-react"
import { ClaimsTable } from "@/components/ui/verification/shared/ClaimsTable"
import { StatCard } from "@/components/ui/verification/shared/StatCards"
import type { ClaimRow } from "@/components/ui/verification/shared/types"

interface Props {
  claims: ClaimRow[];
  onForward: (claimId: string, newStatus: ClaimRow['status']) => void;
  onViewDocuments: (claimId: string) => void;
  onEdit: (claimId: string) => void;
}

export function GramPanchayatDashboard({ claims, onForward, onViewDocuments, onEdit }: Props) {
  const claimsToVerify = claims.filter(c => c.status === 'Awaiting FRC Verification').length;
  const claimsForwarded = claims.filter(c => c.status === 'Under SDLC Review').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-green-800">Gram Panchayat Dashboard</h1>
          <p className="text-slate-600">Manage and verify local forest rights claims.</p>
        </div>
        <Button className="bg-green-700 hover:bg-green-800"><FilePlus size={16} className="mr-2" />Initiate New Claim</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Awaiting Verification" value={claimsToVerify} description="Claims to be reviewed by FRC" Icon={Clock} iconColorClass="text-yellow-500" />
        <StatCard title="Forwarded to SDLC" value={claimsForwarded} description="Claims sent for sub-divisional review" Icon={AlertCircle} iconColorClass="text-amber-500" />
      </div>

      <ClaimsTable
        claims={claims}
        renderActions={(claim) => (
          claim.status === 'Awaiting FRC Verification' && (
            <>
              <Button variant="outline" size="sm" onClick={() => onEdit(claim.id)}><Pencil size={14} className="mr-1" /> Edit</Button>
              <Button variant="outline" size="sm" onClick={() => onViewDocuments(claim.id)}><FileText size={14} className="mr-1" /> View Docs</Button>
              <Button variant="outline" size="sm" onClick={() => onForward(claim.id, 'Under SDLC Review')}><Send size={14} className="mr-1" /> Forward</Button>
            </>
          )
        )}
      />
    </div>
  )
}