// Your main page file, e.g., @/app/verification/page.tsx

"use client"
import { useState } from "react";
import { GramPanchayatDashboard } from "./dashboards/GramPanchayatDashboard";
import { SdlcDashboard } from "./dashboards/SdlcDashboard";
import { DlcDashboard } from "./dashboards/DlcDashboard";
import type { ClaimRow } from "./shared/types";
import { Button } from "@/components/ui/button";

const initialClaimsData: ClaimRow[] = [
  // Bastar District
  { id: "CLM-1002", district: "Bastar", village: "Tokapal", gramPanchayat: "Bastar", applicant: "Ramesh Kumar", claimType: "Community", dateFiled: "2024-08-15", landArea: 10.8, status: "Under DLC Review" },
  { id: "CLM-1006", district: "Bastar", village: "Lohandiguda", gramPanchayat: "Bastar", applicant: "Arjun Singh", claimType: "Individual", dateFiled: "2024-09-12", landArea: 2.0, status: "Awaiting FRC Verification" },
  { id: "CLM-1012", district: "Bastar", village: "Bastanar", gramPanchayat: "Bastar", applicant: "Vikram Mandavi", claimType: "Community", dateFiled: "2025-04-10", landArea: 12.0, status: "Under DLC Review" },
  { id: "CLM-1007", district: "Bastar", village: "Bakawand", gramPanchayat: "Jagdalpur", applicant: "Sunita Kashyap", claimType: "Individual", dateFiled: "2025-08-20", landArea: 1.2, status: "Awaiting FRC Verification" },
  { id: "CLM-1013", district: "Bastar", village: "Bakawand", gramPanchayat: "Jagdalpur", applicant: "Lalita Baghel", claimType: "Individual", dateFiled: "2023-11-22", landArea: 2.1, status: "Approved" },

  // Kondagaon District
  { id: "CLM-1001", district: "Kondagaon", village: "Makdi", gramPanchayat: "Kondagaon", applicant: "Asha Devi", claimType: "Individual", dateFiled: "2024-07-02", landArea: 2.5, status: "Approved" },
  { id: "CLM-1004", district: "Kondagaon", village: "Pharasgaon", gramPanchayat: "Kondagaon", applicant: "Vijay Lakra", claimType: "Individual", dateFiled: "2024-09-01", landArea: 1.5, status: "Under SDLC Review" },
  { id: "CLM-1011", district: "Kondagaon", village: "Keskal", gramPanchayat: "Kondagaon", applicant: "Anjali Tudu", claimType: "Individual", dateFiled: "2025-05-25", landArea: 1.9, status: "Under DLC Review" },

  // Dantewada District
  { id: "CLM-1003", district: "Dantewada", village: "Geedam", gramPanchayat: "Dantewada", applicant: "Sita Rao", claimType: "Individual", dateFiled: "2024-06-05", landArea: 3.2, status: "Rejected" },
  { id: "CLM-1010", district: "Dantewada", village: "Kuakonda", gramPanchayat: "Dantewada", applicant: "Prakash Oraon", claimType: "Individual", dateFiled: "2025-06-15", landArea: 2.8, status: "Under SDLC Review" },
  { id: "CLM-1015", district: "Dantewada", village: "Geedam", gramPanchayat: "Dantewada", applicant: "Kamal Kishor", claimType: "Individual", dateFiled: "2023-10-18", landArea: 3.5, status: "Rejected" },

  // Sukma District
  { id: "CLM-1005", district: "Sukma", village: "Chhindgarh", gramPanchayat: "Sukma", applicant: "Meera Bai", claimType: "Community", dateFiled: "2024-09-10", landArea: 5.1, status: "Awaiting FRC Verification" },
  { id: "CLM-1009", district: "Sukma", village: "Konta", gramPanchayat: "Sukma", applicant: "Gita Murmu", claimType: "Community", dateFiled: "2025-07-30", landArea: 8.5, status: "Under SDLC Review" },
  { id: "CLM-1016", district: "Sukma", village: "Chhindgarh", gramPanchayat: "Sukma", applicant: "Santosh Yadav", claimType: "Community", dateFiled: "2024-03-01", landArea: 6.2, status: "Rejected" },

  // Narayanpur District
  { id: "CLM-1008", district: "Narayanpur", village: "Orchha", gramPanchayat: "Narayanpur", applicant: "Mohan Netam", claimType: "Individual", dateFiled: "2025-09-01", landArea: 3.0, status: "Awaiting FRC Verification" },
  { id: "CLM-1014", district: "Narayanpur", village: "Orchha", gramPanchayat: "Narayanpur", applicant: "Rajesh Sodi", claimType: "Individual", dateFiled: "2024-01-05", landArea: 0.9, status: "Approved" },
];

export function VerificationPortal() {
  const [claims, setClaims] = useState<ClaimRow[]>(initialClaimsData);
  const [currentUserRole, setCurrentUserRole] = useState<'GP' | 'SDLC' | 'DLC'>('GP');

  const handleStatusUpdate = (claimId: string, newStatus: ClaimRow['status']) => {
    setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: newStatus } : c));
  };
  const handleViewDocuments = (claimId: string) => alert(`Docs for ${claimId}`);
  const handleEditClaim = (claimId: string) => alert(`Editing ${claimId}`);

  return (
    <div className="p-8 space-y-4">
      <div className="p-4 border rounded-lg bg-slate-50">
        <h3 className="font-semibold">Dev Controls</h3>
        <p className="text-sm text-slate-600 mb-2">Switch dashboard view:</p>
        <div className="flex gap-2">
          <Button variant={currentUserRole === 'GP' ? 'default' : 'outline'} onClick={() => setCurrentUserRole('GP')}>Gram Panchayat</Button>
          <Button variant={currentUserRole === 'SDLC' ? 'default' : 'outline'} onClick={() => setCurrentUserRole('SDLC')}>SDLC</Button>
          <Button variant={currentUserRole === 'DLC' ? 'default' : 'outline'} onClick={() => setCurrentUserRole('DLC')}>DLC</Button>
        </div>
      </div>
      
      {currentUserRole === 'GP' && (
        <GramPanchayatDashboard
          claims={claims}
          onForward={handleStatusUpdate}
          onViewDocuments={handleViewDocuments}
          onEdit={handleEditClaim}
        />
      )}
      {currentUserRole === 'SDLC' && (
        <SdlcDashboard
          claims={claims}
          onForward={handleStatusUpdate}
        />
      )}
      {currentUserRole === 'DLC' && (
        <DlcDashboard
          claims={claims}
          onApprove={handleStatusUpdate}
          onReject={handleStatusUpdate}
        />
      )}
    </div>
  );
}