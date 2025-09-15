"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DocumentUpload } from "./document-upload" // Assuming this component exists
import { User, MapPin, FileText, Upload, Send, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils" // Make sure to import your cn utility

// The data structure for the form
interface ClaimFormData {
  // Personal Information
  applicantName: string
  fatherName: string
  age: string
  gender: string
  caste: string
  aadharNumber: string
  phoneNumber: string
  email: string
  address: string
  // Land Details
  villageCode: string
  villageName: string
  tehsil: string
  district: string
  state: string
  surveyNumber: string
  landArea: string
  landType: string
  occupationSince: string
  // Claim Details
  claimType: string
  purposeOfUse: string
  familyMembers: string
  dependentMembers: string
  annualIncome: string
  // Supporting Information
  witnessName1: string
  witnessAddress1: string
  witnessName2: string
  witnessAddress2: string
  additionalInfo: string
}

// Define the steps for the form wizard
const steps = [
  { id: 1, name: "Personal Information", icon: User },
  { id: 2, name: "Land Details", icon: MapPin },
  { id: 3, name: "Claim Information", icon: FileText },
  { id: 4, name: "Documents & Submit", icon: Upload },
]

export function FRAClaimForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ClaimFormData>({
    applicantName: "",
    fatherName: "",
    age: "",
    gender: "",
    caste: "",
    aadharNumber: "",
    phoneNumber: "",
    email: "",
    address: "",
    villageCode: "",
    villageName: "",
    tehsil: "",
    district: "",
    state: "",
    surveyNumber: "",
    landArea: "",
    landType: "",
    occupationSince: "",
    claimType: "",
    purposeOfUse: "",
    familyMembers: "",
    dependentMembers: "",
    annualIncome: "",
    witnessName1: "",
    witnessAddress1: "",
    witnessName2: "",
    witnessAddress2: "",
    additionalInfo: "",
  })

  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([])

  const updateFormData = (field: keyof ClaimFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => currentStep < steps.length && setCurrentStep(currentStep + 1)
  const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitting FRA Claim:", { formData, uploadedDocuments })
    alert("Claim submitted successfully! (Check console for data)")
  }

  const StepperSidebar = () => (
    <aside className="md:col-span-1">
      <div className="p-4 bg-white rounded-lg border sticky top-8 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">FRA Application</h2>
          <p className="text-sm text-muted-foreground">Follow the steps to complete your claim.</p>
        </div>
        <nav>
          <ol className="space-y-2">
            {steps.map((step) => {
              const isCompleted = currentStep > step.id
              const isActive = currentStep === step.id
              return (
                <li key={step.id}>
                  <div
                    className={cn(
                      "flex items-center p-3 rounded-md transition-all duration-200",
                      isActive ? "bg-primary/10 border border-primary/30" : "",
                      isCompleted ? "opacity-70" : ""
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center h-8 w-8 rounded-full mr-3 text-white",
                        isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                        isCompleted ? "bg-green-600" : ""
                      )}
                    >
                      {isCompleted ? <CheckCircle2 size={20} className="text-slate-100" /> : <step.icon size={18} />}
                    </div>
                    <div>
                      <p className={cn("text-sm font-medium", isActive ? "text-primary" : "text-foreground")}>
                        Step {step.id}
                      </p>
                      <p className="text-sm text-muted-foreground">{step.name}</p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </nav>
      </div>
    </aside>
  )

  return (
    <div className=" bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <StepperSidebar />

        <main className="md:col-span-3">
          <Card className="bg-white border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">{steps[currentStep - 1].name}</CardTitle>
              <CardDescription>Please provide all the required information for this section.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-8 min-h-[25rem]">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="applicantName">Full Name <span className="text-red-600">*</span></Label>
                        <Input id="applicantName" placeholder="Enter full name" value={formData.applicantName} onChange={(e) => updateFormData("applicantName", e.target.value)} required className="bg-slate-50" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fatherName">Father's Name <span className="text-red-600">*</span></Label>
                        <Input id="fatherName" placeholder="Enter father's name" value={formData.fatherName} onChange={(e) => updateFormData("fatherName", e.target.value)} required className="bg-slate-50" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="age">Age <span className="text-red-600">*</span></Label>
                        <Input id="age" type="number" placeholder="Your age" value={formData.age} onChange={(e) => updateFormData("age", e.target.value)} required className="bg-slate-50" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender <span className="text-red-600">*</span></Label>
                        <Select value={formData.gender} onValueChange={(value) => updateFormData("gender", value)}>
                          <SelectTrigger className="bg-slate-50"><SelectValue placeholder="Select gender" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="caste">Caste Category <span className="text-red-600">*</span></Label>
                        <Select value={formData.caste} onValueChange={(value) => updateFormData("caste", value)}>
                          <SelectTrigger className="bg-slate-50"><SelectValue placeholder="Select category" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="st">Scheduled Tribe (ST)</SelectItem>
                            <SelectItem value="sc">Scheduled Caste (SC)</SelectItem>
                            <SelectItem value="obc">Other Backward Class (OBC)</SelectItem>
                            <SelectItem value="general">General</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="aadharNumber">Aadhar Number <span className="text-red-600">*</span></Label>
                        <Input id="aadharNumber" placeholder="XXXX XXXX XXXX" value={formData.aadharNumber} onChange={(e) => updateFormData("aadharNumber", e.target.value)} required className="bg-slate-50" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number <span className="text-red-600">*</span></Label>
                        <Input id="phoneNumber" type="tel" placeholder="+91 XXXXX XXXXX" value={formData.phoneNumber} onChange={(e) => updateFormData("phoneNumber", e.target.value)} required className="bg-slate-50" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Complete Address <span className="text-red-600">*</span></Label>
                      <Textarea id="address" placeholder="Enter your full residential address" value={formData.address} onChange={(e) => updateFormData("address", e.target.value)} required className="bg-slate-50" />
                    </div>
                  </div>
                )}

                {/* Step 2: Land Details */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="villageName">Village Name <span className="text-red-600">*</span></Label>
                        <Input id="villageName" placeholder="Enter village name" value={formData.villageName} onChange={(e) => updateFormData("villageName", e.target.value)} required className="bg-slate-50" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tehsil">Tehsil/Block <span className="text-red-600">*</span></Label>
                        <Input id="tehsil" placeholder="Enter tehsil or block" value={formData.tehsil} onChange={(e) => updateFormData("tehsil", e.target.value)} required className="bg-slate-50" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="district">District <span className="text-red-600">*</span></Label>
                        <Input id="district" placeholder="Enter district" value={formData.district} onChange={(e) => updateFormData("district", e.target.value)} required className="bg-slate-50" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State <span className="text-red-600">*</span></Label>
                        <Input id="state" placeholder="Enter state" value={formData.state} onChange={(e) => updateFormData("state", e.target.value)} required className="bg-slate-50" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="surveyNumber">Survey/Khasra Number <span className="text-red-600">*</span></Label>
                        <Input id="surveyNumber" placeholder="e.g., 123/4a" value={formData.surveyNumber} onChange={(e) => updateFormData("surveyNumber", e.target.value)} required className="bg-slate-50" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="landArea">Land Area (in acres) <span className="text-red-600">*</span></Label>
                        <Input id="landArea" type="number" step="0.01" placeholder="e.g., 2.5" value={formData.landArea} onChange={(e) => updateFormData("landArea", e.target.value)} required className="bg-slate-50" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="occupationSince">Occupation Since <span className="text-red-600">*</span></Label>
                        <Input id="occupationSince" type="date" value={formData.occupationSince} onChange={(e) => updateFormData("occupationSince", e.target.value)} required className="bg-slate-50" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="landType">Type of Land <span className="text-red-600">*</span></Label>
                      <Select value={formData.landType} onValueChange={(value) => updateFormData("landType", value)}>
                        <SelectTrigger className="bg-slate-50"><SelectValue placeholder="Select land type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="forest">Forest Land</SelectItem>
                          <SelectItem value="revenue">Revenue Land</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Step 3: Claim Information */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="claimType">Type of Forest Right Claimed <span className="text-red-600">*</span></Label>
                        <Select value={formData.claimType} onValueChange={(value) => updateFormData("claimType", value)}>
                          <SelectTrigger className="bg-slate-50"><SelectValue placeholder="Select claim type" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">Individual Forest Rights</SelectItem>
                            <SelectItem value="community">Community Forest Rights</SelectItem>
                            <SelectItem value="habitat">Habitat Rights</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="purposeOfUse">Purpose of Land Use <span className="text-red-600">*</span></Label>
                        <Select value={formData.purposeOfUse} onValueChange={(value) => updateFormData("purposeOfUse", value)}>
                          <SelectTrigger className="bg-slate-50"><SelectValue placeholder="Select purpose" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cultivation">Cultivation</SelectItem>
                            <SelectItem value="habitation">Habitation</SelectItem>
                            <SelectItem value="community-use">Community Use</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="familyMembers">Total Family Members <span className="text-red-600">*</span></Label>
                        <Input id="familyMembers" type="number" placeholder="Total members" value={formData.familyMembers} onChange={(e) => updateFormData("familyMembers", e.target.value)} required className="bg-slate-50" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="annualIncome">Annual Income (₹)</Label>
                        <Input id="annualIncome" type="number" placeholder="e.g., 50000" value={formData.annualIncome} onChange={(e) => updateFormData("annualIncome", e.target.value)} className="bg-slate-50" />
                      </div>
                    </div>
                    <div className="space-y-6 pt-4 border-t">
                      <h3 className="text-lg font-medium text-foreground">Witness Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="witnessName1">Witness 1 Full Name</Label>
                          <Input id="witnessName1" placeholder="Enter witness name" value={formData.witnessName1} onChange={(e) => updateFormData("witnessName1", e.target.value)} className="bg-slate-50" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="witnessAddress1">Witness 1 Address</Label>
                          <Input id="witnessAddress1" placeholder="Enter witness address" value={formData.witnessAddress1} onChange={(e) => updateFormData("witnessAddress1", e.target.value)} className="bg-slate-50" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="witnessName2">Witness 2 Full Name</Label>
                          <Input id="witnessName2" placeholder="Enter witness name" value={formData.witnessName2} onChange={(e) => updateFormData("witnessName2", e.target.value)} className="bg-slate-50" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="witnessAddress2">Witness 2 Address</Label>
                          <Input id="witnessAddress2" placeholder="Enter witness address" value={formData.witnessAddress2} onChange={(e) => updateFormData("witnessAddress2", e.target.value)} className="bg-slate-50" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Documents & Submit */}
                {currentStep === 4 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <DocumentUpload onDocumentsChange={setUploadedDocuments} uploadedDocuments={uploadedDocuments} />
                    <div className="pt-6 border-t">
                      <div className="flex items-start space-x-3">
                        <input id="declaration" type="checkbox" required className="h-4 w-4 mt-1 rounded border-border text-primary focus:ring-ring" />
                        <Label htmlFor="declaration" className="text-sm font-normal leading-relaxed">
                          I hereby declare that the information provided is true and correct to the best of my knowledge. I understand that any false information may result in the rejection of my claim.
                        </Label>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <div>
                  {currentStep > 1 && (
                    <Button type="button" variant="outline" onClick={prevStep}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Previous Step
                    </Button>
                  )}
                </div>
                <div>
                  {currentStep < steps.length && (
                    <Button type="button" onClick={nextStep} className="bg-green-600 hover:bg-green-700 text-white">
                      Next Step <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                  {currentStep === steps.length && (
                    <Button type="submit" size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                      <Send className="mr-2 h-4 w-4" /> Submit Claim
                    </Button>
                  )}
                </div>
              </CardFooter>
            </form>
          </Card>
        </main>
      </div>
    </div>
  )
}