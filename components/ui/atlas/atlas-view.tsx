"use client"

import { useState, useMemo, useCallback, useRef } from "react"
import domtoimage from "dom-to-image-more"
import MapComponent from "./map-container"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import LegendCard from "./legend"

const CustomAccordion = ({ title, children, isOpen, onToggle }: any) => (
  <div className="border-b border-green-200/60">
    <h2>
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between w-full py-2 font-semibold text-green-900 text-sm hover:bg-green-200/30 rounded-md px-1"
      >
        <span>{title}</span>
        <svg
          className={`w-3 h-3 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5 5 1 1 5"
          />
        </svg>
      </button>
    </h2>
    <div
      className={`grid transition-all duration-300 ease-in-out ${
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="overflow-hidden">
        <div className="pt-2 pb-3">{children}</div>
      </div>
    </div>
  </div>
)

export type Claim = {
  id: string
  applicant: string
  areaHa: number
  status: "Approved" | "Pending" | "Rejected"
  year: number
  polygon: [number, number][]
}

// NEW: Type definition for our simulated analysis data
type AnalysisData = {
  forest: number
  water: number
  land: number
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
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisImage, setAnalysisImage] = useState<string | null>(null)
  const [openSections, setOpenSections] = useState<string[]>(["", ""])
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)

  const mapContainerRef = useRef<HTMLDivElement>(null)

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

  const handleAnalyze = useCallback(async () => {
    if (!mapContainerRef.current) {
      console.error("Map container ref is not available.")
      return
    }
    setIsAnalyzing(true)
    setAnalysisImage(null)
    setAnalysisData(null) 
    try {
      const blob = await domtoimage.toBlob(mapContainerRef.current)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const localImageUrl = URL.createObjectURL(blob)
      setAnalysisImage(localImageUrl)

      const forest =  30 
      const water =  5
      const land = 100 - forest - water
      setAnalysisData({ forest, water, land })

    } catch (error) {
      console.error("Failed to capture map image:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }, [filtered])

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    )
  }

  return (
    <>
      {/*Analysis Details Popup */}
      {isPopupOpen && analysisImage && analysisData && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setIsPopupOpen(false)}
        >
          <Card
            className="w-full max-w-md mx-4 animate-in fade-in-50"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg text-green-900">Analysis Details</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsPopupOpen(false)}>
                  X
                </Button>
              </div>
              <div className="mb-4 border rounded-lg overflow-hidden">
                <img src={analysisImage} alt="Analysis Result" className="w-full" />
              </div>
              <div>
                <h4 className="font-semibold text-green-800 mb-2">Land Cover Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-green-900">🌲 Forest Area</span>
                    <span className="font-mono font-semibold bg-green-100 px-2 py-1 rounded">{analysisData.forest}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-900">💧 Water Bodies</span>
                    <span className="font-mono font-semibold bg-blue-100 px-2 py-1 rounded">{analysisData.water}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-900">🟫 Other Land</span>
                    <span className="font-mono font-semibold bg-yellow-100 px-2 py-1 rounded">{analysisData.land}%</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="mt-6 ml-6 mr-4 relative grid grid-cols-1 md:grid-cols-[300px_1fr] md:gap-6">
        {/* Sidebar */}
        <aside className="border-r rounded-2xl bg-gradient-to-b from-green-50 to-green-100 p-4 space-y-5 shadow-lg flex flex-col max-h-[85vh] overflow-y-auto">
          {/* Accordion Sections */}
          <div className="space-y-1">
            <CustomAccordion
              title="Layers"
              isOpen={openSections.includes("layers")}
              onToggle={() => toggleSection("layers")}
            >
              <p className="text-xs text-green-800/70 mb-2">
                Toggle contextual overlays
              </p>
              <ul className="space-y-1 text-xs text-green-900">
                <li><input type="checkbox" defaultChecked className="mr-1 accent-green-600"/> Forest Areas</li>
                <li><input type="checkbox" defaultChecked className="mr-1 accent-green-600"/> Claimant Territories</li>
              </ul>
            </CustomAccordion>
            <CustomAccordion
              title="Filters"
              isOpen={openSections.includes("filters")}
              onToggle={() => toggleSection("filters")}
            >
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="atlas-search" className="text-green-950 text-xs">Search</Label>
                  <Input id="atlas-search" placeholder="Find by claim ID or name..." value={q} onChange={(e) => setQ(e.target.value)} className="border-green-400 focus:border-green-600 focus:ring-green-600 h-8 text-xs rounded-md"/>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-green-950 text-xs">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger className="border-green-400 focus:border-green-600 focus:ring-green-600 h-8 text-xs rounded-md"><SelectValue placeholder="All" /></SelectTrigger>
                      <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="Approved">Approved</SelectItem><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Rejected">Rejected</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-green-950 text-xs">Year</Label>
                    <Select value={year} onValueChange={setYear}>
                      <SelectTrigger className="border-green-400 focus:border-green-600 focus:ring-green-600 h-8 text-xs rounded-md"><SelectValue placeholder="All" /></SelectTrigger>
                      <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="2021">2021</SelectItem><SelectItem value="2022">2022</SelectItem><SelectItem value="2023">2023</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CustomAccordion>
          </div>

          {/* Analysis Section */}
          <div className="space-y-3">
            <h2 className="font-semibold text-green-900 text-sm">Analysis</h2>
            <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full bg-green-600 hover:bg-green-700 text-white text-xs h-8">
              {isAnalyzing ? "Analyzing..." : "Analyze Current View"}
            </Button>
            <div className="w-full min-h-[150px] bg-white/90 border border-dashed border-green-300 rounded-lg flex items-center justify-center p-2">
              {isAnalyzing && (<p className="text-green-800 text-xs animate-pulse">Capturing and processing...</p>)}
              {!isAnalyzing && analysisImage && (
                <button
                  className="w-full h-full transition-opacity hover:opacity-80"
                  onClick={() => setIsPopupOpen(true)}
                >
                  <img src={analysisImage} alt="Analysis Result" className="rounded-md object-cover shadow-md max-h-full w-full"/>
                </button>
              )}
              {!isAnalyzing && !analysisImage && (<p className="text-green-800/70 text-xs text-center">Your analysis result will appear here.</p>)}
            </div>
          </div>
          
          <LegendCard/>
        </aside>

        {/* Map */}
        <div ref={mapContainerRef} className="rounded-2xl shadow-xl overflow-hidden h-[85vh] z-0">
          <MapComponent claims={filtered} />
        </div>
      </div>
    </>
  )
}