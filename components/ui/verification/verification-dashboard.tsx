"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "../input"
import { VerificationStats } from "./verification-stats"
import { Clock, CheckCircle, XCircle, AlertCircle, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export type ClaimRow = {
  id: string
  state: string
  district: string
  villageName: string
  applicant: string
  dateFiled: string
  landArea: number
  status: "Pending" | "Under-review" | "Approved" | "Rejected"
}

// Mock data
const claims: ClaimRow[] = [
  { id: "CLM-1001", state: "Maharashtra", district: "Nagpur", villageName: "Kondagaon", applicant: "Asha Devi", dateFiled: "2023-07-02", landArea: 2.5, status: "Approved" },
  { id: "CLM-1002", state: "Odisha", district: "Mayurbhanj", villageName: "Bastar", applicant: "Ramesh Kumar", dateFiled: "2023-08-15", landArea: 1.8, status: "Pending" },
  { id: "CLM-1003", state: "Chhattisgarh", district: "Bastar", villageName: "Dantewada", applicant: "Sita Rao", dateFiled: "2022-12-05", landArea: 3.2, status: "Rejected" },
  { id: "CLM-1004", state: "Jharkhand", district: "Ranchi", villageName: "Kondagaon", applicant: "Vijay Lakra", dateFiled: "2024-02-19", landArea: 1.5, status: "Under-review" },
  { id: "CLM-1005", state: "Madhya Pradesh", district: "Balaghat", villageName: "Sukma", applicant: "Meera Bai", dateFiled: "2024-05-11", landArea: 2.1, status: "Pending" },
]

export function VerificationDashboard() {
  const [selectedClaim, setSelectedClaim] = useState<ClaimRow | null>(null)
  const [q, setQ] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedDateRange, setSelectedDateRange] = useState("all")
  const [sortKey, setSortKey] = useState<keyof ClaimRow>("dateFiled")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")

  const handleSearchChange = (value: string) => setSearchTerm(value)
  const handleStatusChange = (value: string) => setSelectedStatus(value)
  const handleDateRangeChange = (value: string) => setSelectedDateRange(value)

  // Filtered & sorted claims
  const filtered = useMemo(() => {
    const list = claims.filter(
      (c) =>
        c.id.toLowerCase().includes(q.toLowerCase()) ||
        c.state.toLowerCase().includes(q.toLowerCase()) ||
        c.district.toLowerCase().includes(q.toLowerCase()) ||
        c.villageName.toLowerCase().includes(q.toLowerCase()) ||
        c.applicant.toLowerCase().includes(q.toLowerCase())
    )
    return [...list].sort((a, b) => {
      const A = a[sortKey]
      const B = b[sortKey]
      if (A < B) return sortDir === "asc" ? -1 : 1
      if (A > B) return sortDir === "asc" ? 1 : -1
      return 0
    })
  }, [q, sortKey, sortDir])

  const onSort = (k: keyof ClaimRow) => {
    if (sortKey === k) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(k)
      setSortDir("asc")
    }
  }

  const statusCounts = {
    pending: claims.filter((c) => c.status === "Pending").length,
    underReview: claims.filter((c) => c.status === "Under-review").length,
    approved: claims.filter((c) => c.status === "Approved").length,
    rejected: claims.filter((c) => c.status === "Rejected").length,
  }

  const statusColor = (s: ClaimRow["status"]) =>
    s === "Approved"
      ? "bg-green-100 text-green-800 border-green-300"
      : s === "Pending"
        ? "bg-yellow-100 text-yellow-800 border-yellow-300"
        : s === "Rejected"
          ? "bg-red-100 text-red-800 border-red-300"
          : "bg-amber-100 text-amber-800 border-amber-300"

  return (
    <div className="space-y-8 m-8">
      {/* Statistics */}
      <VerificationStats
        pending={statusCounts.pending}
        underReview={statusCounts.underReview}
        approved={statusCounts.approved}
        rejected={statusCounts.rejected}
      />

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            placeholder="Search by village..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 w-full border-slate-300 border-2 rounded-xl"
          />
        </div>

        <Select value={selectedStatus} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full md:w-auto min-w-[160px] border-slate-300 border-2 rounded-xl">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Under-review">Under-review</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedDateRange} onValueChange={handleDateRangeChange}>
          <SelectTrigger className="w-full md:w-auto min-w-[160px] border-slate-300 border-2 rounded-xl">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dates</SelectItem>
            <SelectItem value="2-3 days">Last 2-3 Days</SelectItem>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="2-3 months">Last 2-3 Months</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="bg-green-50/10 border-2 border-slate-300 shadow-lg rounded-xl">
        <CardContent className="overflow-x-auto">
          <table className="min-w-full text-sm border-separate border-spacing-y-1">
            <thead className="gradient-green-subtle text-green-700">
              <tr>
                {[
                  ["id", "ID"],
                  ["state", "State"],
                  ["district", "District"],
                  ["villageName", "Village"],
                  ["applicant", "Applicant"],
                  ["dateFiled", "Date Filed"],
                  ["landArea", "Land Area"],
                  ["status", "Status"],
                ].map(([k, label]) => (
                  <th
                    key={k}
                    className="px-4 py-3 text-left cursor-pointer select-none hover:text-green-900"
                    onClick={() => onSort(k as keyof ClaimRow)}
                  >
                    {label} {sortKey === k ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="bg-green-50/20 hover:bg-green-100 rounded-lg">
                  <td className="px-4 py-3">{row.id}</td>
                  <td className="px-4 py-3">{row.state}</td>
                  <td className="px-4 py-3">{row.district}</td>
                  <td className="px-4 py-3">{row.villageName}</td>
                  <td className="px-4 py-3">{row.applicant}</td>
                  <td className="px-4 py-3">{row.dateFiled}</td>
                  <td className="px-4 py-3">{row.landArea}</td>
                  <td className="px-4 py-3">
                    <Badge className={`border ${statusColor(row.status)}`}>{row.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
