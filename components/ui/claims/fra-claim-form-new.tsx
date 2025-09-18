"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DocumentUpload } from "./document-upload"
import { User, MapPin, FileText, Upload, Send, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { FRAClaimFormData, StepFormData, DocumentCategories } from "@/lib/types/claim-form"
import { useGeographicHierarchy } from "@/lib/hooks/useGeographic"
import { useClaims } from "@/lib/hooks/useClaims"
import { formatClaimForAPI } from "@/lib/utils/claim-helpers"
import { LoadingSpinner } from "@/components/ui/loading"
import { ApiError } from "@/components/ui/error-boundary"
import { toast } from "sonner"

const steps = [
  { id: 1, name: "Personal Information", icon: User },
  { id: 2, name: "Location Details", icon: MapPin },
  { id: 3, name: "Forest Rights", icon: FileText },
  { id: 4, name: "Family Members", icon: User },
  { id: 5, name: "Evidence Upload", icon: Upload },
  { id: 6, name: "Review & Submit", icon: Send },
]

interface FamilyMember {
  name: string
  age: number
  relationship: string
}

export function FRAClaimFormNew() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form data following exact Prisma schema
  const [formData, setFormData] = useState<Partial<FRAClaimFormData>>({
    type: 'IFR',
    claimantName: '',
    spouseName: '',
    fatherOrMotherName: '',
    fullResidentialAddress: '',
    villageName: '',
    gramPanchayat: '',
    tehsil: '',
    district: '',
    claimantCategory: 'ST',
    casteOrTribeCertificateS3Key: '',
    claimedRights: {
      habitationRights: false,
      cultivationRights: false,
      grazingRights: false,
      fishingRights: false,
      waterRights: false,
      ntfpRights: false,
      landArea: 0,
      surveyNumbers: [],
      boundaries: '',
      traditionOfUse: '',
      evidenceOfUse: '',
      otherRights: '',
    },
    familyMembers: [],
    evidence: [],
    otherRelevantInfo: '',
    applicantSignatureOrThumbS3Key: '',
    villageId: '',
  })

  const [uploadedDocuments, setUploadedDocuments] = useState<{ [key: string]: string }>({})
  
  // API hooks
  const geographic = useGeographicHierarchy()
  const { createClaim, isCreating, error: claimError } = useClaims({ autoFetch: false })

  const updateFormData = (field: keyof FRAClaimFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateClaimedRights = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      claimedRights: {
        ...prev.claimedRights,
        [field]: value
      }
    }))
  }

  const addFamilyMember = () => {
    const newMember: FamilyMember = { name: '', age: 0, relationship: '' }
    setFormData(prev => ({
      ...prev,
      familyMembers: [...(prev.familyMembers || []), newMember]
    }))
  }

  const updateFamilyMember = (index: number, field: keyof FamilyMember, value: any) => {
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers?.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    }))
  }

  const removeFamilyMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers?.filter((_, i) => i !== index)
    }))
  }

  const handleDocumentsChange = (documents: { [key: string]: string }) => {
    setUploadedDocuments(documents)
    
    // Convert uploaded documents to evidence array
    const evidence = Object.entries(documents).map(([category, s3Key]) => ({
      s3Key,
      category
    }))
    
    updateFormData('evidence', evidence)
  }

  const handleSubmit = async () => {
    if (!formData.claimantName || !formData.villageId) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    
    try {
      const claimData = formatClaimForAPI(formData)
      const result = await createClaim(claimData)
      
      if (result) {
        toast.success('FRA Claim submitted successfully!')
        router.push('/dashboard/u')
      }
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('Failed to submit claim')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInformationStep
            formData={formData}
            updateFormData={updateFormData}
          />
        )
      case 2:
        return (
          <LocationDetailsStep
            formData={formData}
            updateFormData={updateFormData}
            geographic={geographic}
          />
        )
      case 3:
        return (
          <ForestRightsStep
            formData={formData}
            updateFormData={updateFormData}
            updateClaimedRights={updateClaimedRights}
          />
        )
      case 4:
        return (
          <FamilyMembersStep
            formData={formData}
            addFamilyMember={addFamilyMember}
            updateFamilyMember={updateFamilyMember}
            removeFamilyMember={removeFamilyMember}
          />
        )
      case 5:
        return (
          <EvidenceUploadStep
            uploadedDocuments={uploadedDocuments}
            handleDocumentsChange={handleDocumentsChange}
          />
        )
      case 6:
        return (
          <ReviewSubmitStep
            formData={formData}
            uploadedDocuments={uploadedDocuments}
            geographic={geographic}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">File FRA Claim</h1>
          <p className="text-muted-foreground mt-1">
            Submit your Forest Rights Act claim following the official process
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 mb-2 transition-colors",
                    currentStep >= step.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border"
                  )}
                >
                  {currentStep > step.id ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium text-center",
                    currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 w-20 mt-2 transition-colors",
                      currentStep > step.id ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {claimError && <ApiError error={claimError} className="mb-6" />}

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(steps[currentStep - 1].icon, { className: "w-5 h-5" })}
              Step {currentStep}: {steps[currentStep - 1].name}
            </CardTitle>
            <CardDescription>
              Complete this step to proceed to the next section
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={nextStep}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || isCreating}
              className="bg-green-600 hover:bg-green-700"
            >
              {(isSubmitting || isCreating) ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Claim
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// Step Components
function PersonalInformationStep({ formData, updateFormData }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="claimantName">Claimant Name *</Label>
          <Input
            id="claimantName"
            value={formData.claimantName || ''}
            onChange={(e) => updateFormData('claimantName', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="spouseName">Spouse Name</Label>
          <Input
            id="spouseName"
            value={formData.spouseName || ''}
            onChange={(e) => updateFormData('spouseName', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="fatherOrMotherName">Father/Mother Name</Label>
          <Input
            id="fatherOrMotherName"
            value={formData.fatherOrMotherName || ''}
            onChange={(e) => updateFormData('fatherOrMotherName', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="claimantCategory">Claimant Category *</Label>
          <Select
            value={formData.claimantCategory}
            onValueChange={(value) => updateFormData('claimantCategory', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ST">Scheduled Tribe (ST)</SelectItem>
              <SelectItem value="OTFD">Other Traditional Forest Dwellers (OTFD)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="fullResidentialAddress">Full Residential Address</Label>
        <Textarea
          id="fullResidentialAddress"
          value={formData.fullResidentialAddress || ''}
          onChange={(e) => updateFormData('fullResidentialAddress', e.target.value)}
          rows={3}
        />
      </div>
    </div>
  )
}

function LocationDetailsStep({ formData, updateFormData, geographic }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="state">State</Label>
          <Select
            value={geographic.selectedStateId}
            onValueChange={geographic.setSelectedStateId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {geographic.states.map((state) => (
                <SelectItem key={state.id} value={state.id}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="district">District</Label>
          <Select
            value={geographic.selectedDistrictId}
            onValueChange={geographic.setSelectedDistrictId}
            disabled={!geographic.selectedStateId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent>
              {geographic.districts.map((district) => (
                <SelectItem key={district.id} value={district.id}>
                  {district.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="villageId">Village *</Label>
          <Select
            value={formData.villageId}
            onValueChange={(value) => {
              updateFormData('villageId', value)
              const village = geographic.villages.find(v => v.id === value)
              if (village) {
                updateFormData('villageName', village.name)
              }
            }}
            disabled={!geographic.selectedDistrictId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select village" />
            </SelectTrigger>
            <SelectContent>
              {geographic.villages.map((village) => (
                <SelectItem key={village.id} value={village.id}>
                  {village.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="gramPanchayat">Gram Panchayat</Label>
          <Input
            id="gramPanchayat"
            value={formData.gramPanchayat || ''}
            onChange={(e) => updateFormData('gramPanchayat', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="tehsil">Tehsil/Block</Label>
          <Input
            id="tehsil"
            value={formData.tehsil || ''}
            onChange={(e) => updateFormData('tehsil', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

function ForestRightsStep({ formData, updateFormData, updateClaimedRights }: any) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="type">Type of Forest Rights *</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => updateFormData('type', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select rights type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="IFR">Individual Forest Rights (IFR)</SelectItem>
            <SelectItem value="CR">Community Rights (CR)</SelectItem>
            <SelectItem value="CFR">Community Forest Rights (CFR)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Rights Being Claimed</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
          {[
            { key: 'habitationRights', label: 'Habitation Rights' },
            { key: 'cultivationRights', label: 'Cultivation Rights' },
            { key: 'grazingRights', label: 'Grazing Rights' },
            { key: 'fishingRights', label: 'Fishing Rights' },
            { key: 'waterRights', label: 'Water Rights' },
            { key: 'ntfpRights', label: 'NTFP Rights' },
          ].map((right) => (
            <label key={right.key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.claimedRights?.[right.key] || false}
                onChange={(e) => updateClaimedRights(right.key, e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">{right.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="landArea">Land Area (in acres)</Label>
          <Input
            id="landArea"
            type="number"
            value={formData.claimedRights?.landArea || ''}
            onChange={(e) => updateClaimedRights('landArea', parseFloat(e.target.value) || 0)}
            step="0.01"
            min="0"
          />
        </div>
        <div>
          <Label htmlFor="boundaries">Boundaries Description</Label>
          <Input
            id="boundaries"
            value={formData.claimedRights?.boundaries || ''}
            onChange={(e) => updateClaimedRights('boundaries', e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="traditionOfUse">Tradition of Use</Label>
        <Textarea
          id="traditionOfUse"
          value={formData.claimedRights?.traditionOfUse || ''}
          onChange={(e) => updateClaimedRights('traditionOfUse', e.target.value)}
          rows={3}
          placeholder="Describe how you or your community has traditionally used this land/forest"
        />
      </div>
    </div>
  )
}

function FamilyMembersStep({ formData, addFamilyMember, updateFamilyMember, removeFamilyMember }: any) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Family Members</h3>
        <Button onClick={addFamilyMember} variant="outline" size="sm">
          Add Member
        </Button>
      </div>

      {formData.familyMembers?.map((member: FamilyMember, index: number) => (
        <Card key={index} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Name</Label>
              <Input
                value={member.name}
                onChange={(e) => updateFamilyMember(index, 'name', e.target.value)}
              />
            </div>
            <div>
              <Label>Age</Label>
              <Input
                type="number"
                value={member.age}
                onChange={(e) => updateFamilyMember(index, 'age', parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>
            <div>
              <Label>Relationship</Label>
              <Input
                value={member.relationship}
                onChange={(e) => updateFamilyMember(index, 'relationship', e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => removeFamilyMember(index)}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Remove
              </Button>
            </div>
          </div>
        </Card>
      ))}

      {(!formData.familyMembers || formData.familyMembers.length === 0) && (
        <div className="text-center py-8 text-muted-foreground">
          No family members added yet. Click "Add Member" to include family information.
        </div>
      )}
    </div>
  )
}

function EvidenceUploadStep({ uploadedDocuments, handleDocumentsChange }: any) {
  return (
    <div className="space-y-6">
      <DocumentUpload
        uploadedDocuments={uploadedDocuments}
        onDocumentsChange={handleDocumentsChange}
      />
    </div>
  )
}

function ReviewSubmitStep({ formData, uploadedDocuments, geographic }: any) {
  const selectedVillage = geographic.villages.find((v: any) => v.id === formData.villageId)
  const selectedDistrict = geographic.districts.find((d: any) => d.id === geographic.selectedDistrictId)
  const selectedState = geographic.states.find((s: any) => s.id === geographic.selectedStateId)

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Review Your Application</h3>
      
      {/* Personal Information */}
      <Card className="p-4">
        <h4 className="font-medium mb-3">Personal Information</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="font-medium">Name:</span> {formData.claimantName}</div>
          <div><span className="font-medium">Category:</span> {formData.claimantCategory}</div>
          <div><span className="font-medium">Spouse:</span> {formData.spouseName || 'N/A'}</div>
          <div><span className="font-medium">Father/Mother:</span> {formData.fatherOrMotherName || 'N/A'}</div>
        </div>
      </Card>

      {/* Location */}
      <Card className="p-4">
        <h4 className="font-medium mb-3">Location</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="font-medium">Village:</span> {selectedVillage?.name || 'N/A'}</div>
          <div><span className="font-medium">District:</span> {selectedDistrict?.name || 'N/A'}</div>
          <div><span className="font-medium">State:</span> {selectedState?.name || 'N/A'}</div>
          <div><span className="font-medium">Gram Panchayat:</span> {formData.gramPanchayat || 'N/A'}</div>
        </div>
      </Card>

      {/* Rights */}
      <Card className="p-4">
        <h4 className="font-medium mb-3">Forest Rights</h4>
        <div className="text-sm">
          <div><span className="font-medium">Type:</span> {formData.type}</div>
          <div><span className="font-medium">Land Area:</span> {formData.claimedRights?.landArea || 0} acres</div>
        </div>
      </Card>

      {/* Documents */}
      <Card className="p-4">
        <h4 className="font-medium mb-3">Uploaded Documents</h4>
        <div className="text-sm">
          {Object.keys(uploadedDocuments).length > 0 ? (
            Object.keys(uploadedDocuments).map((docType) => (
              <div key={docType} className="flex justify-between">
                <span>{docType}</span>
                <span className="text-green-600">✓ Uploaded</span>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground">No documents uploaded</div>
          )}
        </div>
      </Card>
    </div>
  )
}
