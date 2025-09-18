// src/components/ui/verification/shared/types.ts

// NEW: A detailed type for the applicant's personal information
export interface ApplicantDetails {
  fullName: string;
  fatherName: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  casteCategory: "ST" | "OBC" | "SC" | "General";
  aadharNumber: string;
  phoneNumber: string;
  fullAddress: string;
}

// Represents one row in the main claims table
export interface ClaimRow {
  id: string; // Will use the new format e.g., FRA20250917-001
  district: string;
  village: string;
  gramPanchayat: string;
  applicantName: string; // This is what shows in the table
  claimType: "Individual" | "Community";
  dateFiled: string; // Format: "YYYY-MM-DD"
  landArea: number; // in acres
  status:
    | "Awaiting FRC Verification"
    | "Under SDLC Review"
    | "Under DLC Review"
    | "Approved"
    | "Rejected";
  // NEW: The complete, detailed information for the applicant
  applicantDetails: ApplicantDetails;
}
