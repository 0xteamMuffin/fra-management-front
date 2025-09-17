// @/app/verification/dashboards/GramPanchayatDashboard.tsx
"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Pencil, Send, Clock, AlertCircle } from "lucide-react";
import { ClaimsTable } from "../shared/ClaimsTable";
import { StatCard } from "../shared/StatCards";
import type { ClaimRow } from "../shared/types";
import { DocumentViewer } from "../shared/DocumentViewer";
import { EditClaimForm } from "../shared/EditClaimForm";

interface Props {
  claims: ClaimRow[];
  onForward: (claimId: string, newStatus: ClaimRow['status']) => void;
  onSave: (updatedClaim: ClaimRow) => void;
}

export function GramPanchayatDashboard({ claims, onForward, onSave }: Props) {
  // State for the document viewer modal
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedClaimForDocs, setSelectedClaimForDocs] = useState<ClaimRow | null>(null);

  // State to track the claim being edited, which controls the view
  const [editingClaim, setEditingClaim] = useState<ClaimRow | null>(null);

  const claimsToVerify = claims.filter(c => c.status === 'Awaiting FRC Verification').length;
  const claimsForwarded = claims.filter(c => c.status === 'Under SDLC Review').length;

  // Handlers for UI actions within this dashboard
  const handleViewDocuments = (claim: ClaimRow) => {
    setSelectedClaimForDocs(claim);
    setIsViewerOpen(true);
  };
  
  const handleEdit = (claim: ClaimRow) => {
    setEditingClaim(claim);
  };

  const handleSaveClaim = (updatedClaim: ClaimRow) => {
    onSave(updatedClaim); // Pass the updated data to the parent component
    setEditingClaim(null); // Return to the dashboard table view
  };

  // If a claim is being edited, render the form instead of the dashboard.
  if (editingClaim) {
    return (
      <EditClaimForm 
        claim={editingClaim} 
        onBack={() => setEditingClaim(null)}
        onSave={handleSaveClaim}
      />
    );
  }

  // Otherwise, render the main dashboard view.
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-green-800">Gram Panchayat Dashboard</h1>
          <p className="text-slate-600">Manage and verify local forest rights claims.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Awaiting Verification" value={claimsToVerify} description="Claims to be reviewed by FRC" Icon={Clock} iconColorClass="text-yellow-500" />
        <StatCard title="Forwarded to SDLC" value={claimsForwarded} description="Claims sent for sub-divisional review" Icon={AlertCircle} iconColorClass="text-amber-500" />
      </div>

      <ClaimsTable
        claims={claims}
        renderActions={(claim) => (
          claim.status === 'Awaiting FRC Verification' && (
            <div className="flex items-center flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => handleEdit(claim)}><Pencil size={14} className="mr-1" /> Edit</Button>
              <Button variant="outline" size="sm" onClick={() => handleViewDocuments(claim)}><FileText size={14} className="mr-1" /> View Docs</Button>
              <Button variant="outline" size="sm" onClick={() => onForward(claim.id, 'Under SDLC Review')}><Send size={14} className="mr-1" /> Forward</Button>
            </div>
          )
        )}
      />

      {/* The Document Viewer modal remains here, controlled by its state */}
      <DocumentViewer
        isOpen={isViewerOpen}
        onOpenChange={setIsViewerOpen}
        claimId={selectedClaimForDocs?.id ?? null}
        claimantName={selectedClaimForDocs?.applicantName ?? null}
      />
    </div>
  );
}