"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import domtoimage from "dom-to-image-more";
import axios from "axios";
import MapComponent from "./map-container";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LegendCard from "./legend";
import { useTranslation } from "react-i18next"; // Import the hook

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
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" />
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
);

export type Claim = {
  id: string;
  applicant: string;
  areaHa: number;
  status: "Approved" | "Pending" | "Rejected";
  year: number;
  polygon: [number, number][];
};

// Data model should remain in a consistent language (e.g., English)
const sampleClaims: Claim[] = [
  { id: "CLM-1001", applicant: "Asha Devi", areaHa: 24.5, status: "Approved", year: 2022, polygon: [[20.98, 77.58], [21.02, 77.58], [21.02, 77.64], [20.98, 77.64]] },
  { id: "CLM-1002", applicant: "Ramesh Kumar", areaHa: 12.1, status: "Pending", year: 2023, polygon: [[21.04, 77.62], [21.07, 77.62], [21.07, 77.68], [21.04, 77.68]] },
  { id: "CLM-1003", applicant: "Sita Rao", areaHa: 30.2, status: "Rejected", year: 2021, polygon: [[21.0, 77.7], [21.03, 77.7], [21.03, 77.76], [21.0, 77.76]] },
];

export default function AtlasView() {
  const { t } = useTranslation(); // Initialize the translation hook
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [year, setYear] = useState<string>("all");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>(["layers", "filters"]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [segmentedImage, setSegmentedImage] = useState<string | null>(null);

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
    setCapturedImage(null);
    setSegmentedImage(null);
    setAnalysisError(null);

    try {
      const originalImageBlob = await domtoimage.toBlob(mapContainerRef.current);
      const originalImageBase64 = await blobToBase64(originalImageBlob);
      setCapturedImage(originalImageBase64);

      const formData = new FormData();
      formData.append("file", originalImageBlob, "map-capture.png");

      const response = await axios.post("http://109.230.237.112:3000/api/v1/segment/segment", formData, { responseType: "blob" });

      const segmentedImageBlob = response.data;
      const segmentedImageBase64 = await blobToBase64(segmentedImageBlob);
      setSegmentedImage(segmentedImageBase64);
    } catch (error) {
      console.error("Failed to analyze map image:", error);
      setAnalysisError(t("sidebarAnalysisError"));
    } finally {
      setIsAnalyzing(false);
    }
  }, [t]);

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    );
  };

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

      <div className="mt-6 ml-6 mr-4 relative grid grid-cols-1 md:grid-cols-[300px_1fr] md:gap-6">
        <aside className="border-r rounded-2xl bg-gradient-to-b from-green-50 to-green-100 p-4 space-y-5 shadow-lg flex flex-col max-h-[85vh] overflow-y-auto">
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
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger className="border-green-400 focus:border-green-600 focus:ring-green-600 h-8 text-xs rounded-md">
                        <SelectValue placeholder={t("sidebarFiltersAllPlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("sidebarFiltersAllOption")}</SelectItem>
                        <SelectItem value="Approved">{t("statusApproved")}</SelectItem>
                        <SelectItem value="Pending">{t("statusPending")}</SelectItem>
                        <SelectItem value="Rejected">{t("statusRejected")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-green-950 text-xs">{t("sidebarFiltersYearLabel")}</Label>
                    <Select value={year} onValueChange={setYear}>
                      <SelectTrigger className="border-green-400 focus:border-green-600 focus:ring-green-600 h-8 text-xs rounded-md">
                        <SelectValue placeholder={t("sidebarFiltersAllPlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("sidebarFiltersAllOption")}</SelectItem>
                        <SelectItem value="2021">2021</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CustomAccordion>
          </div>

          {/* <div className="space-y-3">
            <h2 className="font-semibold text-green-900 text-sm">{t("sidebarAnalysisTitle")}</h2>
            <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full bg-green-600 hover:bg-green-700 text-white text-xs h-8">
              {isAnalyzing ? t("sidebarAnalysisButtonAnalyzing") : t("sidebarAnalysisButtonAnalyze")}
            </Button>
            <div className="w-full min-h-[150px] bg-white/90 border border-dashed border-green-300 rounded-lg flex items-center justify-center p-2">
              {isAnalyzing && (<p className="text-green-800 text-xs animate-pulse">{t("sidebarAnalysisProcessing")}</p>)}
              {!isAnalyzing && capturedImage && !analysisError && (
                <button
                  className="w-full h-full transition-opacity hover:opacity-80"
                  onClick={() => setIsPopupOpen(true)}
                  disabled={!segmentedImage}
                >
                  <img src={capturedImage} alt={t("sidebarAnalysisTitle")} className="rounded-md object-cover shadow-md max-h-full w-full hover:cursor-pointer"/>
                </button>
              )}
              {!isAnalyzing && analysisError && (<p className="text-red-800 text-xs text-center">{analysisError}</p>)}
              {!isAnalyzing && !capturedImage && !analysisError && (<p className="text-green-800/70 text-xs text-center">{t("sidebarAnalysisPlaceholder")}</p>)}
            </div>
          </div> */}
          
          <LegendCard />
        </aside>

        <div ref={mapContainerRef} className="rounded-2xl shadow-xl overflow-hidden h-[85vh] z-0">
          <MapComponent claims={filtered} isVillageBoundriesNeeded={true} />
        </div>
      </div>
    </>
  );
}