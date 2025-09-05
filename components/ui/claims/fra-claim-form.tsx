"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DocumentUpload } from "./document-upload"
import { Progress } from "@/components/ui/progress"
import { User, MapPin, FileText, Upload, Send } from "lucide-react"

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

export function FRAClaimForm() {
  const [currentTab, setCurrentTab] = useState("personal")
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

  const getProgress = () => {
    const tabs = ["personal", "land", "claim", "documents"]
    const currentIndex = tabs.indexOf(currentTab)
    return ((currentIndex + 1) / tabs.length) * 100
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitting FRA Claim:", { formData, uploadedDocuments })
    // Handle form submission
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-xl">FRA Claim Application</CardTitle>
        <CardDescription>Complete all sections to submit your Forest Rights Act claim</CardDescription>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{Math.round(getProgress())}% Complete</span>
          </div>
          <Progress value={getProgress()} className="h-2" />
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Personal</span>
              </TabsTrigger>
              <TabsTrigger value="land" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Land Details</span>
              </TabsTrigger>
              <TabsTrigger value="claim" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Claim Info</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Documents</span>
              </TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="applicantName">Full Name *</Label>
                    <Input
                      id="applicantName"
                      placeholder="Enter full name"
                      value={formData.applicantName}
                      onChange={(e) => updateFormData("applicantName", e.target.value)}
                      required
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fatherName">Father's Name *</Label>
                    <Input
                      id="fatherName"
                      placeholder="Enter father's name"
                      value={formData.fatherName}
                      onChange={(e) => updateFormData("fatherName", e.target.value)}
                      required
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Age"
                      value={formData.age}
                      onChange={(e) => updateFormData("age", e.target.value)}
                      required
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select value={formData.gender} onValueChange={(value) => updateFormData("gender", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="caste">Caste Category *</Label>
                    <Select value={formData.caste} onValueChange={(value) => updateFormData("caste", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="st">Scheduled Tribe (ST)</SelectItem>
                        <SelectItem value="sc">Scheduled Caste (SC)</SelectItem>
                        <SelectItem value="obc">Other Backward Class (OBC)</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="aadharNumber">Aadhar Number *</Label>
                    <Input
                      id="aadharNumber"
                      placeholder="XXXX XXXX XXXX"
                      value={formData.aadharNumber}
                      onChange={(e) => updateFormData("aadharNumber", e.target.value)}
                      required
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.phoneNumber}
                      onChange={(e) => updateFormData("phoneNumber", e.target.value)}
                      required
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Complete Address *</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter complete address"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    required
                    className="bg-background min-h-[80px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Land Details Tab */}
            <TabsContent value="land" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Land Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="villageCode">Village Code</Label>
                    <Input
                      id="villageCode"
                      placeholder="Enter village code"
                      value={formData.villageCode}
                      onChange={(e) => updateFormData("villageCode", e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="villageName">Village Name *</Label>
                    <Input
                      id="villageName"
                      placeholder="Enter village name"
                      value={formData.villageName}
                      onChange={(e) => updateFormData("villageName", e.target.value)}
                      required
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tehsil">Tehsil/Block *</Label>
                    <Input
                      id="tehsil"
                      placeholder="Enter tehsil"
                      value={formData.tehsil}
                      onChange={(e) => updateFormData("tehsil", e.target.value)}
                      required
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">District *</Label>
                    <Input
                      id="district"
                      placeholder="Enter district"
                      value={formData.district}
                      onChange={(e) => updateFormData("district", e.target.value)}
                      required
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      placeholder="Enter state"
                      value={formData.state}
                      onChange={(e) => updateFormData("state", e.target.value)}
                      required
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="surveyNumber">Survey Number *</Label>
                    <Input
                      id="surveyNumber"
                      placeholder="Survey/Khasra number"
                      value={formData.surveyNumber}
                      onChange={(e) => updateFormData("surveyNumber", e.target.value)}
                      required
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="landArea">Land Area (in acres) *</Label>
                    <Input
                      id="landArea"
                      type="number"
                      step="0.01"
                      placeholder="Area in acres"
                      value={formData.landArea}
                      onChange={(e) => updateFormData("landArea", e.target.value)}
                      required
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occupationSince">Occupation Since *</Label>
                    <Input
                      id="occupationSince"
                      type="date"
                      value={formData.occupationSince}
                      onChange={(e) => updateFormData("occupationSince", e.target.value)}
                      required
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="landType">Type of Land *</Label>
                  <Select value={formData.landType} onValueChange={(value) => updateFormData("landType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select land type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="forest">Forest Land</SelectItem>
                      <SelectItem value="revenue">Revenue Land</SelectItem>
                      <SelectItem value="sarkar">Sarkar Land</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Claim Information Tab */}
            <TabsContent value="claim" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Claim Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="claimType">Type of Forest Right Claimed *</Label>
                  <Select value={formData.claimType} onValueChange={(value) => updateFormData("claimType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select claim type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual Forest Rights</SelectItem>
                      <SelectItem value="community">Community Forest Rights</SelectItem>
                      <SelectItem value="habitat">Habitat Rights</SelectItem>
                      <SelectItem value="conversion">Conversion of Pattas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purposeOfUse">Purpose of Land Use *</Label>
                  <Select
                    value={formData.purposeOfUse}
                    onValueChange={(value) => updateFormData("purposeOfUse", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cultivation">Cultivation</SelectItem>
                      <SelectItem value="habitation">Habitation</SelectItem>
                      <SelectItem value="self-cultivation">Self-cultivation and habitation</SelectItem>
                      <SelectItem value="community-use">Community use</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="familyMembers">Total Family Members *</Label>
                    <Input
                      id="familyMembers"
                      type="number"
                      placeholder="Number of members"
                      value={formData.familyMembers}
                      onChange={(e) => updateFormData("familyMembers", e.target.value)}
                      required
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dependentMembers">Dependent Members</Label>
                    <Input
                      id="dependentMembers"
                      type="number"
                      placeholder="Number of dependents"
                      value={formData.dependentMembers}
                      onChange={(e) => updateFormData("dependentMembers", e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="annualIncome">Annual Income (₹)</Label>
                    <Input
                      id="annualIncome"
                      type="number"
                      placeholder="Annual income"
                      value={formData.annualIncome}
                      onChange={(e) => updateFormData("annualIncome", e.target.value)}
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Witness Information</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="witnessName1">Witness 1 Name</Label>
                      <Input
                        id="witnessName1"
                        placeholder="Enter witness name"
                        value={formData.witnessName1}
                        onChange={(e) => updateFormData("witnessName1", e.target.value)}
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="witnessAddress1">Witness 1 Address</Label>
                      <Input
                        id="witnessAddress1"
                        placeholder="Enter witness address"
                        value={formData.witnessAddress1}
                        onChange={(e) => updateFormData("witnessAddress1", e.target.value)}
                        className="bg-background"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="witnessName2">Witness 2 Name</Label>
                      <Input
                        id="witnessName2"
                        placeholder="Enter witness name"
                        value={formData.witnessName2}
                        onChange={(e) => updateFormData("witnessName2", e.target.value)}
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="witnessAddress2">Witness 2 Address</Label>
                      <Input
                        id="witnessAddress2"
                        placeholder="Enter witness address"
                        value={formData.witnessAddress2}
                        onChange={(e) => updateFormData("witnessAddress2", e.target.value)}
                        className="bg-background"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Additional Information</Label>
                  <Textarea
                    id="additionalInfo"
                    placeholder="Any additional information or special circumstances"
                    value={formData.additionalInfo}
                    onChange={(e) => updateFormData("additionalInfo", e.target.value)}
                    className="bg-background min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Document Upload</h3>
                <p className="text-sm text-muted-foreground">
                  Upload all required documents to support your FRA claim. Accepted formats: PDF, JPG, PNG (Max 5MB
                  each)
                </p>

                <DocumentUpload onDocumentsChange={setUploadedDocuments} uploadedDocuments={uploadedDocuments} />

                <div className="pt-6 border-t">
                  <div className="flex items-center space-x-2 mb-4">
                    <input
                      id="declaration"
                      type="checkbox"
                      required
                      className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
                    />
                    <Label htmlFor="declaration" className="text-sm font-normal leading-relaxed">
                      I hereby declare that the information provided above is true and correct to the best of my
                      knowledge. I understand that any false information may result in rejection of my claim.
                    </Label>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    <Send className="mr-2 h-4 w-4" />
                    Submit FRA Claim
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </CardContent>
    </Card>
  )
}
