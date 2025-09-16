// @/components/ui/verification/shared/ClaimsTable.tsx

"use client"
import { useState, useMemo, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import type { ClaimRow } from "./types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  filterHierarchy?: ('District' | 'Village')[];
}

export function ClaimsTable({ claims, renderActions, filterHierarchy = [] }: ClaimsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [primaryFilterValue, setPrimaryFilterValue] = useState("All")
  const [secondaryFilterValue, setSecondaryFilterValue] = useState("All")

  const primaryFilterType = filterHierarchy.length > 0 ? filterHierarchy[0] : null;
  const secondaryFilterType = filterHierarchy.length > 1 ? filterHierarchy[1] : null;

  // When the primary filter changes, reset the secondary filter
  useEffect(() => {
    setSecondaryFilterValue("All");
  }, [primaryFilterValue]);

  const primaryOptions = useMemo(() => {
    if (!primaryFilterType) return [];
    const key = primaryFilterType === 'District' ? 'district' : 'village';
    return [...new Set(claims.map(c => c[key]))].sort();
  }, [claims, primaryFilterType]);

  const secondaryOptions = useMemo(() => {
    if (!secondaryFilterType || primaryFilterValue === 'All') return [];
    const primaryKey = primaryFilterType === 'District' ? 'district' : 'village';
    const secondaryKey = secondaryFilterType === 'Village' ? 'village' : 'district';
    const relevantClaims = claims.filter(c => c[primaryKey] === primaryFilterValue);
    return [...new Set(relevantClaims.map(c => c[secondaryKey]))].sort();
  }, [claims, primaryFilterValue, primaryFilterType, secondaryFilterType]);

  const filteredClaims = useMemo(() => {
    let results = claims;
    // 1. Apply primary filter
    if (primaryFilterType && primaryFilterValue !== "All") {
      const key = primaryFilterType === 'District' ? 'district' : 'village';
      results = results.filter(c => c[key] === primaryFilterValue);
    }
    // 2. Apply secondary filter
    if (secondaryFilterType && secondaryFilterValue !== "All") {
      const key = secondaryFilterType === 'Village' ? 'village' : 'district';
      results = results.filter(c => c[key] === secondaryFilterValue);
    }
    // 3. Apply search term filter
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      results = results.filter(c =>
        c.applicant.toLowerCase().includes(lowercasedSearch) ||
        c.gramPanchayat.toLowerCase().includes(lowercasedSearch) ||
        c.village.toLowerCase().includes(lowercasedSearch) ||
        c.district.toLowerCase().includes(lowercasedSearch) ||
        c.id.toLowerCase().includes(lowercasedSearch)
      );
    }
    return results;
  }, [claims, searchTerm, primaryFilterValue, secondaryFilterValue, primaryFilterType, secondaryFilterType]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        {/* --- Dropdowns are now on the left --- */}
        <div className="relative flex-grow max-w-[400px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <Input placeholder="Search claims..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
        {primaryFilterType && (
          <Select value={primaryFilterValue} onValueChange={setPrimaryFilterValue}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder={`Filter by ${primaryFilterType}...`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All {primaryFilterType}s</SelectItem>
              {primaryOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        {secondaryFilterType && primaryFilterValue !== 'All' && (
          <Select value={secondaryFilterValue} onValueChange={setSecondaryFilterValue}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder={`Filter by ${secondaryFilterType}...`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All {secondaryFilterType}s</SelectItem>
              {secondaryOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        {/* --- Search bar is now on the right --- */}
        
      </div>
      <Card className="border-2 border-slate-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-slate-600 font-semibold">
                  <th className="p-3">Claim ID</th>
                  <th className="p-3">District</th>
                  <th className="p-3">Village</th>
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
                    <td className="p-3">{claim.district}</td>
                    <td className="p-3">{claim.village}</td>
                    <td className="p-3">{claim.gramPanchayat}</td>
                    <td className="p-3">{claim.applicant}</td>
                    <td className="p-3"><StatusBadge status={claim.status} /></td>
                    <td className="p-3">
                      <div className="flex gap-2 justify-center">{renderActions(claim)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}