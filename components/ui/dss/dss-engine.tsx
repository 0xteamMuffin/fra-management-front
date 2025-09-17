"use client"

import { useState, useMemo, useCallback, useRef } from "react"
import domtoimage from "dom-to-image-more"
import axios from "axios"

// Component Imports from the first file
import MapComponent from "../atlas/map-container"
import LegendCard from "../atlas/legend"

// UI Component Imports from both files
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Icon Imports from the second file
import {
  Droplets,
  Zap,
  Wifi,
  GraduationCap,
  Heart,
  TrendingUp,
  ArrowRight,
} from "lucide-react"

// --- Helper from first file: Convert Blob to Base64 ---
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// --- Helper Component from first file: CustomAccordion ---
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

// --- Type Definition and Sample Data from first file ---
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

export function DSSEnginePage() {
  // --- State and Logic from AtlasView (first file) ---
  const [q, setQ] = useState("")
  const [status, setStatus] = useState<string>("all")
  const [year, setYear] = useState<string>("all")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [openSections, setOpenSections] = useState<string[]>(["layers", "filters"]) // Default open
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [segmentedImage, setSegmentedImage] = useState<string | null>(null)
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
    if (!mapContainerRef.current) return

    setIsAnalyzing(true)
    setCapturedImage(null)
    setSegmentedImage(null)
    setAnalysisError(null)

    try {
      const originalImageBlob = await domtoimage.toBlob(mapContainerRef.current)
      const originalImageBase64 = await blobToBase64(originalImageBlob)
      setCapturedImage(originalImageBase64)

      const formData = new FormData()
      formData.append("file", originalImageBlob, "map-capture.png")

      const response = await axios.post(
        "http://109.230.237.112:3000/api/v1/segment/segment",
        formData,
        { responseType: "blob" },
      )

      const segmentedImageBlob = response.data
      const segmentedImageBase64 = await blobToBase64(segmentedImageBlob)
      setSegmentedImage(segmentedImageBase64)
    } catch (error) {
      console.error("Failed to analyze map image:", error)
      setAnalysisError("Failed to get analysis. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    )
  }

  // --- State and Data from original DSSEnginePage (second file) ---
  const [selectedArea, setSelectedArea] = useState("") // Note: No component sets this state anymore, but kept for the lower section
  const mockSchemes = [
    {
      id: 1,
      name: "Jal Jeevan Mission",
      category: "Water Supply",
      priority: "Critical",
      attentionLevel: "Immediate",
      eligibility: "95%",
      funding: "₹2.5 Cr",
      timeline: "18 months",
      description: "Provides functional household tap connections to every rural household",
      benefits: ["Clean drinking water access", "Reduced water-borne diseases", "Women empowerment"],
      status: "Recommended",
      urgencyScore: 95,
    },
    {
      id: 2,
      name: "Digital India - BharatNet",
      category: "Connectivity",
      priority: "High",
      attentionLevel: "High",
      eligibility: "92%",
      funding: "₹3.2 Cr",
      timeline: "24 months",
      description: "High-speed broadband connectivity to rural areas",
      benefits: ["Digital literacy", "E-governance access", "Economic opportunities"],
      status: "Recommended",
      urgencyScore: 88,
    },
    {
      id: 3,
      name: "PM-KUSUM Scheme",
      category: "Solar Energy",
      priority: "Medium",
      attentionLevel: "Moderate",
      eligibility: "87%",
      funding: "₹1.8 Cr",
      timeline: "12 months",
      description: "Solar pumps and grid-connected solar power plants for farmers",
      benefits: ["Renewable energy access", "Reduced electricity costs", "Income generation"],
      status: "Under Review",
      urgencyScore: 72,
    },
    {
      id: 4,
      name: "Pradhan Mantri Gram Sadak Yojana",
      category: "Infrastructure",
      priority: "Medium",
      attentionLevel: "Moderate",
      eligibility: "78%",
      funding: "₹4.1 Cr",
      timeline: "30 months",
      description: "All-weather road connectivity to unconnected habitations",
      benefits: ["Better market access", "Emergency services", "Economic development"],
      status: "Feasible",
      urgencyScore: 65,
    },
    {
      id: 5,
      name: "Ayushman Bharat - Health & Wellness Centers",
      category: "Healthcare",
      priority: "High",
      attentionLevel: "High",
      eligibility: "89%",
      funding: "₹1.2 Cr",
      timeline: "15 months",
      description: "Comprehensive primary healthcare services at village level",
      benefits: ["Primary healthcare access", "Preventive care", "Maternal health"],
      status: "Recommended",
      urgencyScore: 82,
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <>
      {/* --- Popup Modal from first file --- */}
      {isPopupOpen && capturedImage && segmentedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setIsPopupOpen(false)}
        >
          <Card
            className="w-full max-w-lg mx-4 animate-in fade-in-50 p-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-lg text-green-900">Analysis Details</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsPopupOpen(false)}>
                X
              </Button>
            </div>
            <h4 className="font-semibold text-green-800 mb-2">Original View</h4>
            <div className="mb-4 border rounded-lg overflow-hidden">
              <img src={capturedImage} alt="Original View" className="w-full" />
            </div>
            <h4 className="font-semibold text-green-800 mb-2 mt-4">Segmented Analysis</h4>
            <div className="mb-4 border rounded-lg overflow-hidden">
              <img src={segmentedImage} alt="Segmented Analysis" className="w-full" />
            </div>
          </Card>
        </div>
      )}

      <div className="container max-w-8xl mx-auto py-8 px-4 space-y-8">

        {/* --- REPLACED SECTION: Sidebar and Map from the first file --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 border-r rounded-2xl bg-gradient-to-b from-green-50 to-green-100 p-4 space-y-5 shadow-lg flex flex-col h-[85vh] overflow-y-auto">
            <div className="space-y-1">
              <CustomAccordion title="Layers" isOpen={openSections.includes("layers")} onToggle={() => toggleSection("layers")}>
                <p className="text-xs text-green-800/70 mb-2">Toggle contextual overlays</p>
                <ul className="space-y-1 text-xs text-green-900">
                  <li><input type="checkbox" defaultChecked className="mr-1 accent-green-600"/> Forest Areas</li>
                  <li><input type="checkbox" defaultChecked className="mr-1 accent-green-600"/> Claimant Territories</li>
                </ul>
              </CustomAccordion>
              <CustomAccordion title="Filters" isOpen={openSections.includes("filters")} onToggle={() => toggleSection("filters")}>
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
            <div className="space-y-3">
              <h2 className="font-semibold text-green-900 text-sm">Analysis</h2>
              <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full bg-green-600 hover:bg-green-700 text-white text-xs h-8">
                {isAnalyzing ? "Analyzing..." : "Analyze Current View"}
              </Button>
              <div className="w-full min-h-[150px] bg-white/90 border border-dashed border-green-300 rounded-lg flex items-center justify-center p-2">
                {isAnalyzing && (<p className="text-green-800 text-xs animate-pulse">Capturing and processing...</p>)}
                {!isAnalyzing && capturedImage && !analysisError && (
                  <button className="w-full h-full transition-opacity hover:opacity-80" onClick={() => setIsPopupOpen(true)} disabled={!segmentedImage}>
                    <img src={capturedImage} alt="Analysis Result" className="rounded-md object-cover shadow-md max-h-full w-full hover:cursor-pointer"/>
                  </button>
                )}
                {!isAnalyzing && analysisError && (<p className="text-red-800 text-xs text-center">{analysisError}</p>)}
                {!isAnalyzing && !capturedImage && !analysisError && (<p className="text-green-800/70 text-xs text-center">Your analysis result will appear here.</p>)}
              </div>
            </div>
            <LegendCard/>
          </aside>

          {/* Map */}
          <div ref={mapContainerRef} className="lg:col-span-3 rounded-2xl shadow-xl overflow-hidden h-[85vh] z-0">
            <MapComponent claims={filtered} />
          </div>
        </div>
        
        <div className="h-3"></div>

        {/* --- RETAINED SECTION: Scheme Recommender from the second file --- */}
        <div>
          <div className="mb-4">
            <div className="flex items-center gap-2 font-semibold text-lg">Scheme Recommender</div>
            <p className="text-sm text-muted-foreground">Prioritized schemes based on area needs</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[80vh] overflow-y-auto pr-2">
            {mockSchemes.sort((a, b) => b.urgencyScore - a.urgencyScore).map((scheme) => (
              <Card key={scheme.id} className="border-l-4 border-l-green-500 h-fit">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-semibold text-sm">{scheme.name}</h4>
                        <p className="text-xs text-muted-foreground">{scheme.category}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-lg font-bold text-green-600">{scheme.urgencyScore}%</div>
                        <p className="text-xs text-muted-foreground">Match</p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Badge className={getPriorityColor(scheme.priority)} variant="outline">{scheme.priority}</Badge>
                      <Badge variant="secondary" className="text-xs">{scheme.attentionLevel} Attention</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{scheme.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-muted-foreground">Funding: </span><span className="font-semibold">{scheme.funding}</span></div>
                      <div><span className="text-muted-foreground">Timeline: </span><span className="font-semibold">{scheme.timeline}</span></div>
                    </div>
                    <Button size="sm" className="w-full gradient-green text-white hover:gradient-green-hover">View Details<ArrowRight className="h-3 w-3 ml-1" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {selectedArea && (
          <Card className="gradient-green-subtle">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Detailed Analysis - {selectedArea}
              </CardTitle>
              <CardDescription>Comprehensive resource assessment and implementation roadmap</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { name: "Water", icon: Droplets, score: 25, status: "Critical" },
                  { name: "Energy", icon: Zap, score: 40, status: "Low" },
                  { name: "Connectivity", icon: Wifi, score: 30, status: "Poor" },
                  { name: "Education", icon: GraduationCap, score: 65, status: "Moderate" },
                  { name: "Healthcare", icon: Heart, score: 35, status: "Low" },
                ].map((resource) => (
                  <Card key={resource.name} className="text-center">
                    <CardContent className="p-4">
                      <resource.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h3 className="font-semibold mb-1">{resource.name}</h3>
                      <div className="text-2xl font-bold mb-1">{resource.score}%</div>
                      <Badge variant={resource.score < 40 ? "destructive" : resource.score < 70 ? "secondary" : "default"}>
                        {resource.status}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}