import type {
  ClaimRow,
  ApplicantDetails,
} from "@/components/ui/verification/shared/types";

function generateClaimId(dateStr: string, index: number): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const sequential = (index + 1).toString().padStart(3, "0");
  return `FRA${year}${month}${day}-${sequential}`;
}

const aaravSharmaDetails: ApplicantDetails = {
  fullName: "Aarav Sharma",
  fatherName: "Ramesh Sharma",
  age: 27,
  gender: "Male",
  casteCategory: "OBC",
  aadharNumber: "9110 0234 1234 9874",
  phoneNumber: "9090903843",
  fullAddress: "Lembujharan, Jashipur, Mayurbhanj, Odisha",
};

const placeholderDetails = (name: string): ApplicantDetails => ({
  fullName: name,
  fatherName: "N/A",
  age: 0,
  gender: "Other",
  casteCategory: "General",
  aadharNumber: "XXXX XXXX XXXX XXXX",
  phoneNumber: "N/A",
  fullAddress: "N/A",
});

type OldClaim = {
  applicant: string;
  district: string;
  village: string;
  gramPanchayat: string;
  claimType: "Individual" | "Community";
  dateFiled: string;
  landArea: number;
  status: ClaimRow["status"];
};

const oldClaims: OldClaim[] = [
  {
    applicant: "Ramesh Kumar",
    district: "Bastar",
    village: "Tokapal",
    gramPanchayat: "Bastar",
    claimType: "Community",
    dateFiled: "2024-08-15",
    landArea: 10.8,
    status: "Under DLC Review",
  },
  {
    applicant: "Arjun Singh",
    district: "Bastar",
    village: "Lohandiguda",
    gramPanchayat: "Bastar",
    claimType: "Individual",
    dateFiled: "2024-09-12",
    landArea: 2.0,
    status: "Awaiting FRC Verification",
  },
  {
    applicant: "Vikram Mandavi",
    district: "Bastar",
    village: "Bastanar",
    gramPanchayat: "Bastar",
    claimType: "Community",
    dateFiled: "2025-04-10",
    landArea: 12.0,
    status: "Under DLC Review",
  },
  {
    applicant: "Sunita Kashyap",
    district: "Bastar",
    village: "Bakawand",
    gramPanchayat: "Jagdalpur",
    claimType: "Individual",
    dateFiled: "2025-08-20",
    landArea: 1.2,
    status: "Awaiting FRC Verification",
  },
  {
    applicant: "Lalita Baghel",
    district: "Bastar",
    village: "Bakawand",
    gramPanchayat: "Jagdalpur",
    claimType: "Individual",
    dateFiled: "2023-11-22",
    landArea: 2.1,
    status: "Approved",
  },
  {
    applicant: "Asha Devi",
    district: "Kondagaon",
    village: "Makdi",
    gramPanchayat: "Kondagaon",
    claimType: "Individual",
    dateFiled: "2024-07-02",
    landArea: 2.5,
    status: "Approved",
  },
  {
    applicant: "Vijay Lakra",
    district: "Kondagaon",
    village: "Pharasgaon",
    gramPanchayat: "Kondagaon",
    claimType: "Individual",
    dateFiled: "2024-09-01",
    landArea: 1.5,
    status: "Under SDLC Review",
  },
  {
    applicant: "Anjali Tudu",
    district: "Kondagaon",
    village: "Keskal",
    gramPanchayat: "Kondagaon",
    claimType: "Individual",
    dateFiled: "2025-05-25",
    landArea: 1.9,
    status: "Under DLC Review",
  },
  {
    applicant: "Sita Rao",
    district: "Dantewada",
    village: "Geedam",
    gramPanchayat: "Dantewada",
    claimType: "Individual",
    dateFiled: "2024-06-05",
    landArea: 3.2,
    status: "Rejected",
  },
  {
    applicant: "Prakash Oraon",
    district: "Dantewada",
    village: "Kuakonda",
    gramPanchayat: "Dantewada",
    claimType: "Individual",
    dateFiled: "2025-06-15",
    landArea: 2.8,
    status: "Under SDLC Review",
  },
  {
    applicant: "Kamal Kishor",
    district: "Dantewada",
    village: "Geedam",
    gramPanchayat: "Dantewada",
    claimType: "Individual",
    dateFiled: "2023-10-18",
    landArea: 3.5,
    status: "Rejected",
  },
  {
    applicant: "Meera Bai",
    district: "Sukma",
    village: "Chhindgarh",
    gramPanchayat: "Sukma",
    claimType: "Community",
    dateFiled: "2024-09-10",
    landArea: 5.1,
    status: "Awaiting FRC Verification",
  },
  {
    applicant: "Gita Murmu",
    district: "Sukma",
    village: "Konta",
    gramPanchayat: "Sukma",
    claimType: "Community",
    dateFiled: "2025-07-30",
    landArea: 8.5,
    status: "Under SDLC Review",
  },
  {
    applicant: "Santosh Yadav",
    district: "Sukma",
    village: "Chhindgarh",
    gramPanchayat: "Sukma",
    claimType: "Community",
    dateFiled: "2024-03-01",
    landArea: 6.2,
    status: "Rejected",
  },
  {
    applicant: "Mohan Netam",
    district: "Narayanpur",
    village: "Orchha",
    gramPanchayat: "Narayanpur",
    claimType: "Individual",
    dateFiled: "2025-09-01",
    landArea: 3.0,
    status: "Awaiting FRC Verification",
  },
  {
    applicant: "Rajesh Sodi",
    district: "Narayanpur",
    village: "Orchha",
    gramPanchayat: "Narayanpur",
    claimType: "Individual",
    dateFiled: "2024-01-05",
    landArea: 0.9,
    status: "Approved",
  },
];

export const initialClaimsData: ClaimRow[] = [
  {
    id: generateClaimId("2025-09-17", 0),
    district: "Mayurbhanj",
    village: "Lembujharan",
    gramPanchayat: "Jashipur",
    applicantName: "Aarav Sharma",
    claimType: "Individual",
    dateFiled: "2025-09-17",
    landArea: 4.5,
    status: "Awaiting FRC Verification",
    applicantDetails: aaravSharmaDetails,
  },

  ...oldClaims.map(
    (claim, index): ClaimRow => ({
      id: generateClaimId(claim.dateFiled, index + 1),
      district: claim.district,
      village: claim.village,
      gramPanchayat: claim.gramPanchayat,
      applicantName: claim.applicant,
      claimType: claim.claimType,
      dateFiled: claim.dateFiled,
      landArea: claim.landArea,
      status: claim.status,
      applicantDetails: placeholderDetails(claim.applicant),
    }),
  ),
];
