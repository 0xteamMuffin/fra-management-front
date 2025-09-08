"use client"

import { useState, useMemo } from "react"
import  MapComponent  from "./map-container"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Claim = {
  id: string
  applicant: string
  areaHa: number
  status: "Approved" | "Pending" | "Rejected"
  year: number
  polygon: [number, number][]
}

const sampleClaims: Claim[] = [
  {
    id: "CLM-1001",
    applicant: "Asha Devi",
    areaHa: 24.5,
    status: "Approved",
    year: 2022,
    polygon: [
      [20.98, 77.58],
      [21.02, 77.58],
      [21.02, 77.64],
      [20.98, 77.64],
    ],
  },
  {
    id: "CLM-1002",
    applicant: "Ramesh Kumar",
    areaHa: 12.1,
    status: "Pending",
    year: 2023,
    polygon: [
      [21.04, 77.62],
      [21.07, 77.62],
      [21.07, 77.68],
      [21.04, 77.68],
    ],
  },
  {
    id: "CLM-1003",
    applicant: "Sita Rao",
    areaHa: 30.2,
    status: "Rejected",
    year: 2021,
    polygon: [
      [21.0, 77.7],
      [21.03, 77.7],
      [21.03, 77.76],
      [21.0, 77.76],
    ],
  },
]

export default function AtlasView() {
  const [q, setQ] = useState("")
  const [status, setStatus] = useState<string>("all")
  const [year, setYear] = useState<string>("all")

  const filtered = useMemo(() => {
    return sampleClaims.filter((c) => {
      const matchQ =
        q.trim().length === 0 ||
        c.id.toLowerCase().includes(q.toLowerCase()) ||
        c.applicant.toLowerCase().includes(q.toLowerCase())
      const matchStatus = status === "all" || c.status === status
      const matchYear = year === "all" || String(c.year) === year
      return matchQ && matchStatus && matchYear
    })
  }, [q, status, year])

  return (
    <div className="mt-8 ml-8 relative grid grid-cols-1 md:grid-cols-[320px_1fr]">
      <aside className="border-r rounded-2xl gradient-green-subtle p-4 space-y-6 shadow-md">
        {/* Layers */}
        <div>
          <h2 className="font-semibold text-emerald-900">Layers</h2>
          <p className="text-xs text-emerald-800/70">Toggle contextual overlays</p>
          <ul className="mt-3 space-y-2 text-sm text-emerald-900">
            <li>
              <input type="checkbox" defaultChecked className="mr-2 accent-emerald-700" /> State Boundaries
            </li>
            <li>
              <input type="checkbox" defaultChecked className="mr-2 accent-emerald-700" /> District Boundaries
            </li>
            <li>
              <input type="checkbox" defaultChecked className="mr-2 accent-emerald-700" /> Forest Areas
            </li>
            <li>
              <input type="checkbox" defaultChecked className="mr-2 accent-emerald-700" /> Claimant Territories
            </li>
          </ul>
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <h2 className="font-semibold text-emerald-900">Filters</h2>
          <div className="space-y-1.5">
            <Label htmlFor="atlas-search" className="text-emerald-950">Search</Label>
            <Input
              id="atlas-search"
              placeholder="Find by claim ID or name..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="border-emerald-400 focus:border-emerald-600 focus:ring-emerald-600"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-emerald-950">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="border-emerald-400 focus:border-emerald-600 focus:ring-emerald-600">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-emerald-950">Year</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="border-emerald-400 focus:border-emerald-600 focus:ring-emerald-600">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Legend */}
        <Card className="bg-white/90 border-emerald-300 p-4 shadow-sm">
          <h3 className="font-semibold text-emerald-900 mb-2">Legend</h3>
          <ul className="space-y-2 text-sm text-emerald-900">
            <li>
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-600 mr-2" /> Approved
            </li>
            <li>
              <span className="inline-block h-2 w-2 rounded-full bg-amber-500 mr-2" /> Pending
            </li>
            <li>
              <span className="inline-block h-2 w-2 rounded-full bg-red-500 mr-2" /> Rejected
            </li>
          </ul>
        </Card>
      </aside>
      <MapComponent />
    </div>
  )
}
