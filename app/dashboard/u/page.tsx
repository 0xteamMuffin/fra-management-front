"use client"

import React, { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  User,
  MapPin,
  FileText,
  Calendar,
  Hash,
  LandPlot,
  Users,
  Building,
  Eye,
  Banknote,
  Map,
  Phone,
  CheckCircle2,
  Loader2,
  XCircle,
  FileStack,
} from "lucide-react"
import { cn } from "@/lib/utils"

// --- Data Interfaces & Mock Data ---

interface Claim {
  applicationId: string
  submissionDate: string
  status: "Approved" | "Under Review" | "Rejected"
  applicantName: string
  fatherName: string
  age: string
  gender: string
  caste: string
  aadharNumber: string
  phoneNumber: string
  villageName: string
  tehsil: string
  district: string
  state: string
  surveyNumber: string
  landArea: string
  landType: string
  occupationSince: string
  claimType: "individual" | "community" | "habitat"
  purposeOfUse: string
  familyMembers: string
  annualIncome: string
  witnessName1: string
  witnessAddress1: string
  witnessName2: string
  witnessAddress2: string
}

const mockClaims: Claim[] = [
  {
    applicationId: "FRA20250917-001",
    submissionDate: "2025-09-18",
    status: "Under Review",
    claimType: "individual",
    applicantName: "Aarav Sharma",
    fatherName: "Ramesh Sharma",
    age: "27",
    gender: "Male",
    caste: "OBC",
    aadharNumber: "9110 0234 1234 9874",
    phoneNumber: "+91 9090903843",
    villageName: "Lembujharan",
    tehsil: "Tamenglong",
    district: "Mayurbhanj",
    state: "Odisha",
    surveyNumber: "155/2B",
    landArea: "2",
    landType: "forest",
    occupationSince: "2004-01-01",
    purposeOfUse: "cultivation",
    familyMembers: "5",
    annualIncome: "75000",
    witnessName1: "Haipou Jadonang",
    witnessAddress1: "Nungkao Village",
    witnessName2: "Gaibonliu Pamei",
    witnessAddress2: "Nungkao Village",
  },
  {
    applicationId: "FRA20240310-015",
    submissionDate: "2024-03-10",
    status: "Approved",
    claimType: "community",
    applicantName: "Nungkao Village Council",
    fatherName: "N/A",
    age: "N/A",
    gender: "N/A",
    caste: "st",
    aadharNumber: "N/A",
    phoneNumber: "+91 9876500001",
    villageName: "Nungkao",
    tehsil: "Tamenglong",
    district: "Tamenglong",
    state: "Manipur",
    surveyNumber: "Community Plot 7",
    landArea: "52.0",
    landType: "forest",
    occupationSince: "1980-06-15",
    purposeOfUse: "community-use",
    familyMembers: "150 (approx)",
    annualIncome: "N/A",
    witnessName1: "Village Elder 1",
    witnessAddress1: "Nungkao Village",
    witnessName2: "Village Elder 2",
    witnessAddress2: "Nungkao Village",
  },
  {
    applicationId: "FRA20231120-008",
    submissionDate: "2023-11-20",
    status: "Rejected",
    claimType: "individual",
    applicantName: "Birsa Munda",
    fatherName: "Sugana Munda",
    age: "42",
    gender: "Male",
    caste: "st",
    aadharNumber: "XXXX XXXX 5678",
    phoneNumber: "+91 9123456789",
    villageName: "Ulihatu",
    tehsil: "Khunti",
    district: "Khunti",
    state: "Jharkhand",
    surveyNumber: "98/C",
    landArea: "2.1",
    landType: "revenue",
    occupationSince: "2006-05-10",
    purposeOfUse: "habitation",
    familyMembers: "4",
    annualIncome: "55000",
    witnessName1: "Donka Munda",
    witnessAddress1: "Ulihatu Village",
    witnessName2: "Pasna Munda",
    witnessAddress2: "Ulihatu Village",
  },
]


const statusConfig = {
  Approved: { icon: CheckCircle2, className: "bg-green-100 text-green-800 border-green-300", iconColor: "text-green-600" },
  "Under Review": { icon: Loader2, className: "bg-yellow-100 text-yellow-800 border-yellow-300", iconColor: "text-yellow-600" },
  Rejected: { icon: XCircle, className: "bg-red-100 text-red-800 border-red-300", iconColor: "text-red-600" },
}

const formatValue = (key: keyof Claim, value: string) => {
  if (!value || value === "N/A") return "N/A"
  switch (key) {
    case "gender": return value.charAt(0).toUpperCase() + value.slice(1)
    case "caste": return { st: "Scheduled Tribe (ST)", sc: "Scheduled Caste (SC)", obc: "Other Backward Class (OBC)", general: "General" }[value] || "N/A"
    case "landType": return { forest: "Forest Land", revenue: "Revenue Land", other: "Other" }[value] || "N/A"
    case "claimType": return { individual: "Individual Rights", community: "Community Rights", habitat: "Habitat Rights" }[value] || "N/A"
    case "purposeOfUse": return { cultivation: "Cultivation", habitation: "Habitation", "community-use": "Community Use" }[value] || "N/A"
    case "annualIncome": return `₹ ${Number(value).toLocaleString("en-IN")}`
    case "landArea": return `${value} acres`
    default: return value
  }
}

const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-sm text-muted-foreground flex items-center mb-1">
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </p>
    <p className="font-semibold text-foreground ml-6">{value || "N/A"}</p>
  </div>
)

const ClaimDetailsView = ({ claim }: { claim: Claim }) => {
  const currentStatus = statusConfig[claim.status]

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Card className="bg-white border-border shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Application Details</CardTitle>
              <CardDescription>ID: {claim.applicationId}</CardDescription>
            </div>
            <Badge className={cn("text-sm px-3 py-1 border", currentStatus.className)}>
              <currentStatus.icon className={cn("h-4 w-4 mr-2", currentStatus.iconColor, claim.status === "Under Review" && "animate-spin")} />
              {claim.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailItem icon={Calendar} label="Submission Date" value={new Date(claim.submissionDate).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })} />
          <DetailItem icon={FileText} label="Claim Type" value={formatValue("claimType", claim.claimType)} />
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="bg-white border-border shadow-sm border-t-4 border-blue-500">
        <CardHeader className="flex flex-row items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-full"><User className="w-6 h-6 text-blue-600" /></div>
          <CardTitle className="mb-0">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
          <DetailItem icon={User} label="Applicant Name" value={claim.applicantName} />
          <DetailItem icon={Users} label="Father's Name" value={claim.fatherName} />
          <DetailItem icon={Building} label="Caste Category" value={formatValue("caste", claim.caste)} />
          <DetailItem icon={Phone} label="Phone Number" value={claim.phoneNumber} />
        </CardContent>
      </Card>

      {/* Land & Location Details */}
      <Card className="bg-white border-border shadow-sm border-t-4 border-teal-500">
        <CardHeader className="flex flex-row items-center space-x-4">
          <div className="bg-teal-100 p-3 rounded-full"><Map className="w-6 h-6 text-teal-600" /></div>
          <CardTitle className="mb-0">Land & Location Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
          <DetailItem icon={MapPin} label="Village" value={claim.villageName} />
          <DetailItem icon={MapPin} label="District" value={claim.district} />
          <DetailItem icon={Hash} label="Survey / Khasra No." value={claim.surveyNumber} />
          <DetailItem icon={LandPlot} label="Land Area" value={formatValue("landArea", claim.landArea)} />
          <DetailItem icon={Calendar} label="Occupation Since" value={new Date(claim.occupationSince).toLocaleDateString("en-IN", { year: "numeric", month: "long" })} />
        </CardContent>
      </Card>
      
       {/* Witness Information */}
      <Card className="bg-white border-border shadow-sm border-t-4 border-purple-500">
        <CardHeader className="flex flex-row items-center space-x-4">
          <div className="bg-purple-100 p-3 rounded-full"><Eye className="w-6 h-6 text-purple-600" /></div>
          <CardTitle className="mb-0">Witness Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
            <DetailItem icon={User} label="Witness 1" value={<>{claim.witnessName1} <span className="text-sm font-normal text-muted-foreground">({claim.witnessAddress1})</span></>} />
            <DetailItem icon={User} label="Witness 2" value={<>{claim.witnessName2} <span className="text-sm font-normal text-muted-foreground">({claim.witnessAddress2})</span></>} />
        </CardContent>
      </Card>
    </div>
  )
}


const UserDashboardPage = () => {
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(mockClaims[0]?.applicationId || null)
  const selectedClaim = mockClaims.find((c) => c.applicationId === selectedClaimId)

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {mockClaims[0]?.applicantName.split(" ")[0]}!</h1>
          <p className="text-muted-foreground mt-1">Here is a summary of your submitted FRA claims.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Left Sidebar: Claims List */}
          <aside className="lg:col-span-1 sticky top-34">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <FileStack className="mr-2 h-5 w-5" />
                  Your Claims
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="space-y-1">
                  {mockClaims.map((claim) => {
                    const status = statusConfig[claim.status]
                    const isActive = claim.applicationId === selectedClaimId
                    return (
                      <button
                        key={claim.applicationId}
                        onClick={() => setSelectedClaimId(claim.applicationId)}
                        className={cn(
                          "w-full text-left p-3 rounded-md border-l-4 transition-colors duration-200 hover:bg-slate-100",
                          isActive ? "border-primary bg-primary/5" : "border-transparent"
                        )}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <p className={cn("font-semibold text-sm", isActive ? "text-primary" : "text-foreground")}>
                            {formatValue("claimType", claim.claimType)}
                          </p>
                          <Badge variant="outline" className={cn("text-xs py-0.5", status.className)}>
                            {claim.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">ID: {claim.applicationId}</p>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Right Main Content: Selected Claim Details */}
          <main className="lg:col-span-3">
            {selectedClaim ? (
              <ClaimDetailsView claim={selectedClaim} />
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg min-h-[50vh]">
                <FileStack className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground">No Claim Selected</h3>
                <p className="text-muted-foreground mt-2">Please select a claim from the list on the left to view its details.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default UserDashboardPage