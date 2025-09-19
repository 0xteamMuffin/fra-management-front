// @/components/ui/verification/shared/ClaimsTable.tsx

"use client";
import { useState, useMemo, useEffect } from "react";
import type { ClaimRow } from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

const StatusBadge = ({ status }: { status: ClaimRow["status"] }) => {
  const { t } = useTranslation();
  const styles: Record<ClaimRow["status"], string> = {
    Approved: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
    "Under DLC Review": "bg-blue-100 text-blue-800",
    "Under SDLC Review": "bg-amber-100 text-amber-800",
    "Awaiting FRC Verification": "bg-yellow-100 text-yellow-800",
  };

  const statusKeyMap: Record<ClaimRow["status"], string> = {
    Approved: "status_approved",
    Rejected: "status_rejected",
    "Under DLC Review": "status_under_dlc",
    "Under SDLC Review": "status_under_sdlc",
    "Awaiting FRC Verification": "status_awaiting_frc",
  };

  const translatedStatus = t(statusKeyMap[status] || status);

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded ${styles[status]}`}>
      {translatedStatus}
    </span>
  );
};

interface ClaimsTableProps {
  claims: ClaimRow[];
  renderActions: (claim: ClaimRow) => React.ReactNode;
  filterHierarchy?: ("District" | "Village")[];
}

export function ClaimsTable({
  claims,
  renderActions,
  filterHierarchy = [],
}: ClaimsTableProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [primaryFilterValue, setPrimaryFilterValue] = useState("All");
  const [secondaryFilterValue, setSecondaryFilterValue] = useState("All");

  const primaryFilterType =
    filterHierarchy.length > 0 ? filterHierarchy[0] : null;
  const secondaryFilterType =
    filterHierarchy.length > 1 ? filterHierarchy[1] : null;

  useEffect(() => {
    setSecondaryFilterValue("All");
  }, [primaryFilterValue]);

  const primaryOptions = useMemo(() => {
    if (!primaryFilterType) return [];
    const key = primaryFilterType === "District" ? "district" : "village";
    return [...new Set(claims.map((c) => c[key]))].sort();
  }, [claims, primaryFilterType]);

  const secondaryOptions = useMemo(() => {
    if (!secondaryFilterType || primaryFilterValue === "All") return [];
    const primaryKey =
      primaryFilterType === "District" ? "district" : "village";
    const secondaryKey =
      secondaryFilterType === "Village" ? "village" : "district";
    const relevantClaims = claims.filter(
      (c) => c[primaryKey] === primaryFilterValue,
    );
    return [...new Set(relevantClaims.map((c) => c[secondaryKey]))].sort();
  }, [claims, primaryFilterValue, primaryFilterType, secondaryFilterType]);

  const filteredClaims = useMemo(() => {
    let results = claims;
    if (primaryFilterType && primaryFilterValue !== "All") {
      const key = primaryFilterType === "District" ? "district" : "village";
      results = results.filter((c) => c[key] === primaryFilterValue);
    }
    if (secondaryFilterType && secondaryFilterValue !== "All") {
      const key = secondaryFilterType === "Village" ? "village" : "district";
      results = results.filter((c) => c[key] === secondaryFilterValue);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      results = results.filter(
        (c) =>
          c.applicantName.toLowerCase().includes(lower) ||
          c.gramPanchayat.toLowerCase().includes(lower) ||
          c.village.toLowerCase().includes(lower) ||
          c.district.toLowerCase().includes(lower) ||
          c.id.toLowerCase().includes(lower),
      );
    }
    return results;
  }, [
    claims,
    searchTerm,
    primaryFilterValue,
    secondaryFilterValue,
    primaryFilterType,
    secondaryFilterType,
  ]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-grow max-w-[400px]">
          <input
            type="text"
            placeholder={t("placeholder_search_claims")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        {primaryFilterType && (
          <Select
            value={primaryFilterValue}
            onValueChange={setPrimaryFilterValue}
          >
            <SelectTrigger className="w-full border-slate-200 sm:w-[200px]">
              <SelectValue
                placeholder={t("placeholder_filter_by", {
                  filterType: primaryFilterType,
                })}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">
                {t("all_filter_items", { filterType: primaryFilterType + "s" })}
              </SelectItem>
              {primaryOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {secondaryFilterType && primaryFilterValue !== "All" && (
          <Select
            value={secondaryFilterValue}
            onValueChange={setSecondaryFilterValue}
          >
            <SelectTrigger className="w-full border-slate-200 sm:w-[200px]">
              <SelectValue
                placeholder={t("placeholder_filter_by", {
                  filterType: secondaryFilterType,
                })}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">
                {t("all_filter_items", {
                  filterType: secondaryFilterType + "s",
                })}
              </SelectItem>
              {secondaryOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="border-2 border-slate-200 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-slate-600 font-semibold">
                <th className="p-3">{t("th_claim_id")}</th>
                <th className="p-3">{t("th_district")}</th>
                <th className="p-3">{t("th_village")}</th>
                <th className="p-3">{t("th_gram_panchayat")}</th>
                <th className="p-3">{t("th_applicant")}</th>
                <th className="p-3">{t("th_status")}</th>
                <th className="p-3 text-center">{t("th_actions")}</th>
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
                  <td className="p-3">
                    <StatusBadge status={claim.status} />
                  </td>
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
      </div>
    </div>
  );
}