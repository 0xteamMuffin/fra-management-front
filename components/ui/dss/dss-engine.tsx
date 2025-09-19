"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import domtoimage from "dom-to-image-more";
import axios from "axios";
import { useTranslation } from "react-i18next"; // Import the hook

// Component Imports
import MapComponent from "../atlas/map-container";
import LegendCard from "../atlas/legend";

// UI Component Imports
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Icon Imports
import {
  Droplets,
  Zap,
  Wifi,
  GraduationCap,
  Heart,
  TrendingUp,
  LandPlot,
  TreePine,
} from "lucide-react";

// --- Type Definitions for API data ---
type SchemeRecommendation = {
  schemeName: string;
  eligibilityReason: string;
  priority: "High" | "Medium" | "Low";
};

type Intervention = {
  intervention: string;
  reason: string;
  urgency: "High" | "Medium" | "Low";
};

type DssData = {
  schemeRecommendations: SchemeRecommendation[];
  interventions: Intervention[];
  additionalNotes: string;
};

type AnalysisStats = {
  forest: number;
  water: number;
  soil: number;
  buildings: number;
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

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
      className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
    >
      <div className="overflow-hidden">
        <div className="pt-2 pb-3">{children}</div>
      </div>
    </div>
  </div>
);

const SchemeCardSkeleton = () => (
  <Card className="h-fit"><CardContent className="p-4"><div className="space-y-3 animate-pulse"><div className="flex items-start justify-between"><div className="space-y-2"><div className="h-4 bg-gray-200 rounded w-32"></div></div></div><div className="flex gap-2"><div className="h-5 bg-gray-200 rounded-full w-20"></div></div><div className="space-y-1 mt-1"><div className="h-3 bg-gray-200 rounded w-full"></div><div className="h-3 bg-gray-200 rounded w-5/6"></div></div><div className="h-9 bg-gray-300 rounded w-full mt-3"></div></div></CardContent></Card>
);

const AnalysisStatsDisplay = ({ stats, t }: { stats: AnalysisStats; t: any }) => (
  <div className="space-y-2">
    <h3 className="font-semibold text-green-900 text-sm">{t("statsTitleLandUse")}</h3>
    <div className="p-3 bg-white/90 border border-green-300 rounded-lg space-y-2 text-xs text-green-950">
      <div className="flex justify-between items-center">
        <span className="flex items-center gap-2"><LandPlot className="h-4 w-4 text-green-700" /> {t("statsLabelSoil")}</span>
        <span className="font-bold">{stats.soil}%</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="flex items-center gap-2"><Droplets className="h-4 w-4 text-green-700" /> {t("statsLabelWater")}</span>
        <span className="font-bold">{stats.water}%</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="flex items-center gap-2"><TreePine className="h-4 w-4 text-green-700" /> {t("statsLabelForest")}</span>
        <span className="font-bold">{stats.forest}%</span>
      </div>
    </div>
  </div>
);


export type Claim = {
  id: string; applicant: string; areaHa: number; status: "Approved" | "Pending" | "Rejected"; year: number; polygon: [number, number][];
};
const sampleClaims: Claim[] = [
  { id: "CLM-1001", applicant: "Asha Devi", areaHa: 24.5, status: "Approved", year: 2022, polygon: [[20.98, 77.58], [21.02, 77.58], [21.02, 77.64], [20.98, 77.64],], },
  { id: "CLM-1002", applicant: "Ramesh Kumar", areaHa: 12.1, status: "Pending", year: 2023, polygon: [[21.04, 77.62], [21.07, 77.62], [21.07, 77.68], [21.04, 77.68],], },
  { id: "CLM-1003", applicant: "Sita Rao", areaHa: 30.2, status: "Rejected", year: 2021, polygon: [[21.0, 77.7], [21.03, 77.7], [21.03, 77.76], [21.0, 77.76],], },
];

export function DSSEnginePage() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [year, setYear] = useState<string>("all");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDssLoading, setIsDssLoading] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>(["", ""]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [segmentedImage, setSegmentedImage] = useState<string | null>(null);
  const [dssData, setDssData] = useState<DssData | null>(null);
  const [analysisStats, setAnalysisStats] = useState<AnalysisStats | null>(null);
  const [selectedArea, setSelectedArea] = useState("");
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    return sampleClaims.filter((c) => {
      const matchQ = q.trim().length === 0 || c.id.toLowerCase().includes(q.toLowerCase()) || c.applicant.toLowerCase().includes(q.toLowerCase());
      const matchStatus = status === "all" || c.status === status;
      const matchYear = year === "all" || String(c.year) === year;
      return matchQ && matchStatus && matchYear;
    });
  }, [q, status, year]);

  const handleAnalyze = useCallback(async () => {
    if (!mapContainerRef.current) return;
    setIsAnalyzing(true);
    setIsDssLoading(true);
    setDssData(null);
    setAnalysisStats(null);
    setCapturedImage(null);
    setSegmentedImage(null);
    setAnalysisError(null);

    try {
      const originalImageBlob = await domtoimage.toBlob(mapContainerRef.current);
      const originalImageBase64 = await blobToBase64(originalImageBlob);
      setCapturedImage(originalImageBase64);

      const formData = new FormData();
      formData.append("file", originalImageBlob, "map-capture.png");

      const segmentationResponse = await axios.post("http://109.230.237.112:3000/api/v1/analysis/segment", formData);
      const responseData = segmentationResponse.data;
      setSegmentedImage(responseData.segmentedImage);
      setAnalysisStats(responseData.stats);

      const stats = responseData.stats;
      const assetMapping: { [key: string]: string } = {};
      if (typeof stats.soil === "number") assetMapping.land = `${stats.soil}%`;
      if (typeof stats.water === "number") assetMapping.water = `${stats.water}%`;
      if (typeof stats.buildings === "number") assetMapping.buildings = `${stats.buildings}%`;
      if (typeof stats.forest === "number") assetMapping.forest = `${stats.forest}%`;

      const dssPayload = { assetMapping };
      const dssResponse = await axios.post("http://109.230.237.112:3000/api/v1/dss/dss", dssPayload);
      const dssData = dssResponse.data;

      if (dssData && typeof dssData === "object") {
        setDssData(dssData);
      } else {
        throw new Error(t("errorInvalidDssData"));
      }
    } catch (error) {
      console.error("Analysis process failed:", error);
      setAnalysisError(t("sidebarAnalysisError"));
      setDssData(null);
    } finally {
      setIsAnalyzing(false);
      setIsDssLoading(false);
    }
  }, [t]);

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  const getPriorityBorderColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high": return "border-l-red-500";
      case "medium": return "border-l-orange-500";
      default: return "border-l-gray-400";
    }
  };

  const resourceData = [
    { nameKey: "resourceWater", icon: Droplets, score: 25, statusKey: "statusCritical" },
    { nameKey: "resourceEnergy", icon: Zap, score: 40, statusKey: "statusLow" },
    { nameKey: "resourceConnectivity", icon: Wifi, score: 30, statusKey: "statusPoor" },
    { nameKey: "resourceEducation", icon: GraduationCap, score: 65, statusKey: "statusModerate" },
    { nameKey: "resourceHealthcare", icon: Heart, score: 35, statusKey: "statusLow" },
  ];

  return (
    <>
      {isPopupOpen && capturedImage && segmentedImage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center" onClick={() => setIsPopupOpen(false)}>
          <Card className="w-full max-w-lg mx-4 animate-in fade-in-50 p-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-lg text-green-900">{t("popupTitleAnalysisDetails")}</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsPopupOpen(false)}>X</Button>
            </div>
            <h4 className="font-semibold text-green-800 mb-2">{t("popupSubtitleOriginalView")}</h4>
            <div className="mb-4 border rounded-lg overflow-hidden">
              <img src={capturedImage} alt={t("popupSubtitleOriginalView")} className="w-full" />
            </div>
            <h4 className="font-semibold text-green-800 mb-2 mt-4">{t("popupSubtitleSegmentedAnalysis")}</h4>
            <div className="mb-4 border rounded-lg overflow-hidden">
              <img src={segmentedImage} alt={t("popupSubtitleSegmentedAnalysis")} className="w-full" />
            </div>
          </Card>
        </div>
      )}

      <div className="container max-w-8xl mx-auto py-8 px-4 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 border-r rounded-2xl bg-gradient-to-b from-green-50 to-green-100 p-4 space-y-5 shadow-lg flex flex-col h-[85vh] overflow-y-auto">
            <div className="space-y-1">
              <CustomAccordion title={t("sidebarLayersTitle")} isOpen={openSections.includes("layers")} onToggle={() => toggleSection("layers")}>
                <p className="text-xs text-green-800/70 mb-2">{t("sidebarLayersDescription")}</p>
                <ul className="space-y-1 text-xs text-green-900">
                  <li><input type="checkbox" defaultChecked className="mr-1 accent-green-600" /> {t("sidebarLayersForestAreas")}</li>
                  <li><input type="checkbox" defaultChecked className="mr-1 accent-green-600" /> {t("sidebarLayersClaimantTerritories")}</li>
                </ul>
              </CustomAccordion>
              <CustomAccordion title={t("sidebarFiltersTitle")} isOpen={openSections.includes("filters")} onToggle={() => toggleSection("filters")}>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="atlas-search" className="text-green-950 text-xs">{t("sidebarFiltersSearchLabel")}</Label>
                    <Input id="atlas-search" placeholder={t("sidebarFiltersSearchPlaceholder")} value={q} onChange={(e) => setQ(e.target.value)} className="border-green-400 focus:border-green-600 focus:ring-green-600 h-8 text-xs rounded-md" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-green-950 text-xs">{t("sidebarFiltersStatusLabel")}</Label>
                      <Select value={status} onValueChange={setStatus}><SelectTrigger className="border-green-400 focus:border-green-600 focus:ring-green-600 h-8 text-xs rounded-md"><SelectValue placeholder={t("sidebarFiltersAllPlaceholder")} /></SelectTrigger><SelectContent><SelectItem value="all">{t("sidebarFiltersAllOption")}</SelectItem><SelectItem value="Approved">{t("statusApproved")}</SelectItem><SelectItem value="Pending">{t("statusPending")}</SelectItem><SelectItem value="Rejected">{t("statusRejected")}</SelectItem></SelectContent></Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-green-950 text-xs">{t("sidebarFiltersYearLabel")}</Label>
                      <Select value={year} onValueChange={setYear}><SelectTrigger className="border-green-400 focus:border-green-600 focus:ring-green-600 h-8 text-xs rounded-md"><SelectValue placeholder={t("sidebarFiltersAllPlaceholder")} /></SelectTrigger><SelectContent><SelectItem value="all">{t("sidebarFiltersAllOption")}</SelectItem><SelectItem value="2021">2021</SelectItem><SelectItem value="2022">2022</SelectItem><SelectItem value="2023">2023</SelectItem></SelectContent></Select>
                    </div>
                  </div>
                </div>
              </CustomAccordion>
            </div>
            <div className="space-y-3">
              <h2 className="font-semibold text-green-900 text-sm">{t("sidebarAnalysisTitle")}</h2>
              <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full bg-green-600 hover:bg-green-700 text-white text-xs h-8">
                {isAnalyzing ? t("sidebarAnalysisButtonAnalyzing") : t("sidebarAnalysisButtonAnalyze")}
              </Button>
              <div className="w-full min-h-[150px] bg-white/90 border border-dashed border-green-300 rounded-lg flex items-center justify-center p-2">
                {isAnalyzing && (<p className="text-green-800 text-xs animate-pulse">{t("sidebarAnalysisProcessing")}</p>)}
                {!isAnalyzing && capturedImage && !analysisError && (<button className="w-full h-full transition-opacity hover:opacity-80" onClick={() => setIsPopupOpen(true)} disabled={!segmentedImage}><img src={capturedImage} alt={t("sidebarAnalysisResultAlt")} className="rounded-md object-cover shadow-md max-h-full w-full hover:cursor-pointer" /></button>)}
                {!isAnalyzing && analysisError && (<p className="text-red-800 text-xs text-center">{analysisError}</p>)}
                {!isAnalyzing && !capturedImage && !analysisError && (<p className="text-green-800/70 text-xs text-center">{t("sidebarAnalysisPlaceholder")}</p>)}
              </div>
            </div>
            {analysisStats && !isAnalyzing && (<AnalysisStatsDisplay stats={analysisStats} t={t} />)}
            <LegendCard />
          </aside>
          <div ref={mapContainerRef} className="lg:col-span-3 rounded-2xl shadow-xl overflow-hidden h-[85vh] z-0">
            <MapComponent claims={filtered} isVillageBoundriesNeeded={false} />
          </div>
        </div>

        <div className="h-3"></div>

        <div>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">{t("dssTitleRecommendations")}</h2>
            <p className="text-sm text-muted-foreground">
              {isDssLoading ? t("dssDescriptionGenerating") : dssData ? "" : t("dssDescriptionRunAnalysis")}
            </p>
          </div>
          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-3 text-green-900">{t("dssSubtitleSchemes")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {isDssLoading ? (<><SchemeCardSkeleton /><SchemeCardSkeleton /><SchemeCardSkeleton /></>)
                : dssData && dssData.schemeRecommendations.length > 0 ? (
                  dssData.schemeRecommendations.map((scheme, index) => (
                    <Card key={index} className={`shadow-sm hover:shadow-md transition-shadow ${getPriorityBorderColor(scheme.priority)} border-l-4 bg-white`}>
                      <CardContent className="p-4">
                        <div className="flex flex-col h-full space-y-3">
                          <h4 className="font-semibold text-sm text-gray-800">{scheme.schemeName}</h4>
                          <Badge className={`${getPriorityColor(scheme.priority)} w-fit`} variant="outline">
                            {scheme.priority} {t("priorityLabel")}
                          </Badge>
                          <p className="text-xs text-muted-foreground flex-grow">{scheme.eligibilityReason}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (!isDssLoading && (<p className="text-sm text-muted-foreground col-span-full">{t("dssNoSchemes")}</p>))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-3 text-green-900">{t("dssSubtitleInterventions")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {isDssLoading ? (<><SchemeCardSkeleton /><SchemeCardSkeleton /><SchemeCardSkeleton /></>)
                : dssData && dssData.interventions.length > 0 ? (
                  dssData.interventions.map((item, index) => (
                    <Card key={index} className={`shadow-sm hover:shadow-md transition-shadow ${getPriorityBorderColor(item.urgency)} border-l-4 bg-white`}>
                      <CardContent className="p-4">
                        <div className="flex flex-col h-full space-y-3">
                          <h4 className="font-semibold text-sm text-gray-800">{item.intervention}</h4>
                          <Badge className={`${getPriorityColor(item.urgency)} w-fit`} variant="outline">
                            {item.urgency} {t("urgencyLabel")}
                          </Badge>
                          <p className="text-xs text-muted-foreground flex-grow">{item.reason}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (!isDssLoading && (<p className="text-sm text-muted-foreground col-span-full">{t("dssNoInterventions")}</p>))}
            </div>
          </div>
        </div>
        {selectedArea && (
          <Card className="gradient-green-subtle">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />{t("detailedAnalysisTitle", { area: selectedArea })}</CardTitle>
              <CardDescription>{t("detailedAnalysisDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {resourceData.map((resource) => (
                  <Card key={resource.nameKey} className="text-center">
                    <CardContent className="p-4">
                      <resource.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h3 className="font-semibold mb-1">{t(resource.nameKey)}</h3>
                      <div className="text-2xl font-bold mb-1">{resource.score}%</div>
                      <Badge variant={resource.score < 40 ? "destructive" : resource.score < 70 ? "secondary" : "default"}>
                        {t(resource.statusKey)}
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
  );
}