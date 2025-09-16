export type ClaimRow = {
  id: string
  gramPanchayat: string
  applicant: string
  claimType: "Individual" | "Community"
  dateFiled: string
  landArea: number // in acres
  status: "Awaiting FRC Verification" | "Under SDLC Review" | "Under DLC Review" | "Approved" | "Rejected"
}