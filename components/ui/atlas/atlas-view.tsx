"use client"

import { useState, useMemo } from "react"
import MapComponent from "./map-container"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type Claim = {
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
    <div className="mt-6 ml-6 mr-4 relative grid grid-cols-1 md:grid-cols-[300px_1fr] md:gap-6">
      {/* Sidebar */}
      <aside className="border-r rounded-2xl bg-gradient-to-b from-green-50 to-green-100 p-4 space-y-5 shadow-lg flex flex-col max-h-[85vh] overflow-y-auto">
        {/* Layers */}
        <div>
          <h2 className="font-semibold text-green-900 text-sm">Layers</h2>
          <p className="text-xs text-green-800/70">Toggle contextual overlays</p>
          <ul className="mt-2 space-y-1 text-xs text-green-900">
            <li>
              <input
                type="checkbox"
                defaultChecked
                className="mr-1 accent-green-600"
              />{" "}
              Forest Areas
            </li>
            <li>
              <input
                type="checkbox"
                defaultChecked
                className="mr-1 accent-green-600"
              />{" "}
              Claimant Territories
            </li>
          </ul>
        </div>

        {/* Filters */}
        <div className="space-y-2">
          <h2 className="font-semibold text-green-900 text-sm">Filters</h2>
          <div className="space-y-1">
            <Label htmlFor="atlas-search" className="text-green-950 text-xs">
              Search
            </Label>
            <Input
              id="atlas-search"
              placeholder="Find by claim ID or name..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="border-green-400 focus:border-green-600 focus:ring-green-600 h-8 text-xs rounded-md"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-green-950 text-xs">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="border-green-400 focus:border-green-600 focus:ring-green-600 h-8 text-xs rounded-md">
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
            <div className="space-y-1">
              <Label className="text-green-950 text-xs">Year</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="border-green-400 focus:border-green-600 focus:ring-green-600 h-8 text-xs rounded-md">
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
        <div className="flex-1 overflow-auto">
          <Card className="bg-white/90 border-green-300 p-3 shadow-sm rounded-lg">
            <h3 className="font-semibold text-green-900 text-center text-sm border-b pb-1">
              LEGEND
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs text-green-900 mt-2">
              {/* Same Colors */}
              <div className="flex items-center">
                <div className="w-5 h-0.5 border-t border-dotted border-red-500 mr-2"></div>
                <span>District Boundary</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-green-200 mr-2"></div>
                <span>Coast</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-green-700 mr-2"></div>
                <span>Forest</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-amber-50 mr-2"></div>
                <span>Island</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-sky-300 mr-2"></div>
                <span>Lake</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-lime-300 mr-2"></div>
                <span>Muhana</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-yellow-300 mr-2"></div>
                <span>Non-Potential</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-green-100 mr-2"></div>
                <span>Potential</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-blue-400 mr-2"></div>
                <span>Reservoir</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-blue-700 mr-2"></div>
                <span>River</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-white border mr-2"></div>
                <span>Sand</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-red-800 mr-2"></div>
                <span>ULB</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-rose-400 mr-2"></div>
                <span>Uninhabited</span>
              </div>
              <div className="flex items-center">
                <div
                  className="w-3 h-3 bg-purple-100 mr-2"
                  style={{
                    backgroundImage:
                      'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M6 0H0V6\' stroke=\'%23a78bfa\' stroke-width=\'0.5\' fill=\'none\'/%3E%3C/svg%3E")',
                    backgroundRepeat: "repeat",
                  }}
                ></div>
                <span>Waterlogged</span>
              </div>
            </div>

            {/* Claim Status */}
            <h4 className="font-medium text-green-800 text-center text-xs mt-3">
              CLAIM STATUS
            </h4>
            <div className="grid grid-cols-3 gap-1 text-xs mt-1">
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-emerald-600 mr-1"></span>
                Approved
              </div>
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-amber-500 mr-1"></span>
                Pending
              </div>
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span>
                Rejected
              </div>
            </div>
          </Card>
        </div>
      </aside>

      {/* Map */}
      <div className="rounded-2xl shadow-xl overflow-hidden h-[85vh] z-0">
        <MapComponent claims={filtered} />
      </div>
    </div>
  )
}
