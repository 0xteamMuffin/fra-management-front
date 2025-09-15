"use client"
import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import type { ClaimRow } from "./types"

const StatusBadge = ({ status }: { status: ClaimRow['status'] }) => {
  const styles: Record<ClaimRow['status'], string> = {
    "Approved": "bg-green-100 text-green-800",
    "Rejected": "bg-red-100 text-red-800",
    "Under DLC Review": "bg-blue-100 text-blue-800",
    "Under SDLC Review": "bg-amber-100 text-amber-800",
    "Awaiting FRC Verification": "bg-yellow-100 text-yellow-800",
  }
  return <Badge className={`border-transparent ${styles[status]}`}>{status}</Badge>
}

interface ClaimsTableProps {
  claims: ClaimRow[];
  renderActions: (claim: ClaimRow) => React.ReactNode;
}

export function ClaimsTable({ claims, renderActions }: ClaimsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredClaims = useMemo(() => {
    if (!searchTerm) return claims;
    return claims.filter(c =>
      c.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.gramPanchayat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [claims, searchTerm])

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <Input
          placeholder="Search claims..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <Card className="border-2 border-slate-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-slate-600 font-semibold">
                  <th className="p-3">Claim ID</th>
                  <th className="p-3">Gram Panchayat</th>
                  <th className="p-3">Applicant</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClaims.map((claim) => (
                  <tr key={claim.id} className="border-b hover:bg-slate-50">
                    <td className="p-3">{claim.id}</td>
                    <td className="p-3">{claim.gramPanchayat}</td>
                    <td className="p-3">{claim.applicant}</td>
                    <td className="p-3"><StatusBadge status={claim.status} /></td>
                    <td className="p-3">
                      <div className="flex gap-2 justify-center">
                        {renderActions(claim)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}