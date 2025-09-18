// @/app/verification/dashboards/GramPanchayatDashboard.tsx
"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Pencil, Send, Clock, AlertCircle, Filter } from "lucide-react";
import { ClaimsTable } from "../shared/ClaimsTable";
import { StatCard } from "../shared/StatCards";
import type { ClaimRow } from "../shared/types";
import { DocumentViewer } from "../shared/DocumentViewer";
import { EditClaimForm } from "../shared/EditClaimForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGeographicHierarchy } from "@/lib/hooks/useGeographic";
import { FRAClaim } from "@/lib/types/api";
import { s3Service } from "@/lib/api";
import { toast } from "sonner";
import { ForwardClaimDialog } from "../shared/ForwardClaimDialog";
import { generateClaimDisplayId } from "@/lib/utils/claim-helpers";
import { useDashboardStats } from "@/lib/hooks/useDashboardStats";

interface Props {
  claims: ClaimRow[];
  rawClaims: FRAClaim[];
  onForward: (claimId: string, remarks: string) => void;
  onSave: (updatedClaim: ClaimRow) => void;
}

export function GramPanchayatDashboard({ claims, rawClaims, onForward, onSave }: Props) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isForwardDialogOpen, setIsForwardDialogOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<FRAClaim | null>(null);
  const [editingClaim, setEditingClaim] = useState<ClaimRow | null>(null);
  const [selectedVillage, setSelectedVillage] = useState<string>("all");
  const { villages } = useGeographicHierarchy();
  const { stats, fetchStats } = useDashboardStats();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const filteredClaims = selectedVillage === "all"
    ? claims
    : claims.filter(c => rawClaims.find(rc => rc.id === c.id)?.villageId === selectedVillage);

  const handleViewDocuments = (claim: ClaimRow) => {
    const originalClaim = rawClaims.find(c => generateClaimDisplayId(c) === claim.id);
    setSelectedClaim(originalClaim || null);
    setIsViewerOpen(true);
  };
  
  const handleEdit = (claim: ClaimRow) => {
    setEditingClaim(claim);
  };

  const handleSaveClaim = (updatedClaim: ClaimRow) => {
    onSave(updatedClaim);
    setEditingClaim(null);
  };
  
  const handleForwardClick = (claim: ClaimRow) => {
    const originalClaim = rawClaims.find(c => generateClaimDisplayId(c) === claim.id);
    setSelectedClaim(originalClaim || null);
    setIsForwardDialogOpen(true);
  };

  const handleConfirmForward = async (remarks: string) => {
    if (selectedClaim) {
      await onForward(selectedClaim.id, remarks);
      fetchStats(); // Re-fetch stats after forwarding
    }
  };

  const handleViewDocument = async (s3Key: string) => {
    const toastId = toast.loading("Generating secure link...");
    const url = await s3Service.getViewUrl(s3Key);
    if (url) {
      toast.success("Link generated!", { id: toastId });
      window.open(url, "_blank");
    } else {
      toast.error("Could not generate link.", { id: toastId });
    }
  };

  if (editingClaim) {
    return (
      <EditClaimForm 
        claim={editingClaim} 
        onBack={() => setEditingClaim(null)}
        onSave={handleSaveClaim}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-green-800">Gram Panchayat Dashboard</h1>
          <p className="text-slate-600">Manage and verify local forest rights claims.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Awaiting Verification" value={stats?.pending || 0} description="Claims to be reviewed by FRC" Icon={Clock} iconColorClass="text-yellow-500" />
        <StatCard title="Forwarded to SDLC" value={stats?.forwardedToSdlc || 0} description="Claims sent for sub-divisional review" Icon={AlertCircle} iconColorClass="text-amber-500" />
      </div>

      <div className="flex items-center space-x-2">
        <Filter className="h-5 w-5 text-muted-foreground" />
        <Select value={selectedVillage} onValueChange={setSelectedVillage}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by village..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Villages</SelectItem>
            {villages.map(v => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <ClaimsTable
        claims={filteredClaims}
        renderActions={(claim) => (
          claim.status === 'Awaiting FRC Verification' && (
            <div className="flex items-center flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => handleEdit(claim)}><Pencil size={14} className="mr-1" /> Edit</Button>
              <Button variant="outline" size="sm" onClick={() => handleViewDocuments(claim)}><FileText size={14} className="mr-1" /> View Docs</Button>
              <Button variant="outline" size="sm" onClick={() => handleForwardClick(claim)}><Send size={14} className="mr-1" /> Forward</Button>
            </div>
          )
        )}
      />

      <DocumentViewer
        isOpen={isViewerOpen}
        onOpenChange={setIsViewerOpen}
        claim={selectedClaim}
        onViewDocument={handleViewDocument}
      />
      <ForwardClaimDialog
        isOpen={isForwardDialogOpen}
        onOpenChange={setIsForwardDialogOpen}
        onConfirm={handleConfirmForward}
      />
    </div>
  );
}