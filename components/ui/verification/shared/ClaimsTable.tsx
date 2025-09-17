// @/components/ui/verification/shared/ClaimsTable.tsx

"use client"
import { useState, useMemo, useEffect } from "react"
import type { ClaimRow } from "./types"

const StatusBadge = ({ status }: { status: ClaimRow['status'] }) => {
  const styles: Record<ClaimRow['status'], string> = {
    "Approved": "bg-green-100 text-green-800",
    "Rejected": "bg-red-100 text-red-800",
    "Under DLC Review": "bg-blue-100 text-blue-800",
    "Under SDLC Review": "bg-amber-100 text-amber-800",
    "Awaiting FRC Verification": "bg-yellow-100 text-yellow-800",
  }
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded ${styles[status]}`}>
      {status}
    </span>
  )
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
    if (primaryFilterType && primaryFilterValue !== "All") {
      const key = primaryFilterType === 'District' ? 'district' : 'village';
      results = results.filter(c => c[key] === primaryFilterValue);
    }
    if (secondaryFilterType && secondaryFilterValue !== "All") {
      const key = secondaryFilterType === 'Village' ? 'village' : 'district';
      results = results.filter(c => c[key] === secondaryFilterValue);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      results = results.filter(c =>
        c.applicantName.toLowerCase().includes(lower) ||
        c.gramPanchayat.toLowerCase().includes(lower) ||
        c.village.toLowerCase().includes(lower) ||
        c.district.toLowerCase().includes(lower) ||
        c.id.toLowerCase().includes(lower)
      );
    }
    return results;
  }, [claims, searchTerm, primaryFilterValue, secondaryFilterValue, primaryFilterType, secondaryFilterType]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Search */}
        <div className="relative flex-grow max-w-[400px]">
          <input
            type="text"
            placeholder="Search claims..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        {/* Primary Filter */}
        {primaryFilterType && (
          <select
            value={primaryFilterValue}
            onChange={(e) => setPrimaryFilterValue(e.target.value)}
            className="border rounded px-2 py-2 text-sm"
          >
            <option value="All">All {primaryFilterType}s</option>
            {primaryOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )}

        {/* Secondary Filter */}
        {secondaryFilterType && primaryFilterValue !== 'All' && (
          <select
            value={secondaryFilterValue}
            onChange={(e) => setSecondaryFilterValue(e.target.value)}
            className="border rounded px-2 py-2 text-sm"
          >
            <option value="All">All {secondaryFilterType}s</option>
            {secondaryOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )}
      </div>

      <div className="border-2 border-slate-200 rounded overflow-hidden">
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
                  <td className="p-3">{claim.applicantName}</td>
                  <td className="p-3"><StatusBadge status={claim.status} /></td>
                  <td className="p-3">
                    <div className="flex gap-2 justify-center">{renderActions(claim)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}