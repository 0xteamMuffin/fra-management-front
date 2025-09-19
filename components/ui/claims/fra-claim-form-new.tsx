"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Removed Card imports - using custom components now
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DocumentUpload } from "./document-upload";
import { VillageSearch } from "./village-search";
import {
  User,
  MapPin,
  FileText,
  Upload,
  Send,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FRAClaimFormData,
  DocumentCategories,
} from "@/lib/types/claim-form";
import { useGeographicHierarchy } from "@/lib/hooks/useGeographic";
import { useClaims } from "@/lib/hooks/useClaims";
import { formatClaimForAPI } from "@/lib/utils/claim-helpers";
import { LoadingSpinner } from "@/components/ui/loading";
import { ApiError } from "@/components/ui/error-boundary";
import { toast } from "sonner";
import { FRAType } from "@/lib/types/api";
import { useTranslation } from "react-i18next"; // Import the hook

// Use translation keys for step names
const steps = [
  { id: 1, nameKey: "stepPersonalInformation", icon: User },
  { id: 2, nameKey: "stepLocationDetails", icon: MapPin },
  { id: 3, nameKey: "stepForestRights", icon: FileText },
  { id: 4, nameKey: "stepFamilyMembers", icon: User },
  { id: 5, nameKey: "stepEvidenceUpload", icon: Upload },
  { id: 6, nameKey: "stepReviewSubmit", icon: Send },
];

interface FamilyMember {
  name: string;
  age: number;
  relationship: string;
}

export function FRAClaimFormNew() {
  const { t } = useTranslation(); // Initialize the translation hook
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data state...
  const [formData, setFormData] = useState<Partial<FRAClaimFormData>>({
    type: FRAType.IFR,
    claimantName: "",
    spouseName: "",
    fatherOrMotherName: "",
    fullResidentialAddress: "",
    villageName: "",
    gramPanchayat: "",
    tehsil: "",
    district: "",
    claimantCategory: "ST",
    casteOrTribeCertificateS3Key: "",
    claimedRights: {
      habitationRights: false,
      cultivationRights: false,
      grazingRights: false,
      fishingRights: false,
      waterRights: false,
      ntfpRights: false,
      landArea: 0,
      surveyNumbers: [],
      boundaries: "",
      traditionOfUse: "",
      evidenceOfUse: "",
      otherRights: "",
    },
    familyMembers: [],
    evidence: [],
    otherRelevantInfo: "",
    applicantSignatureOrThumbS3Key: "",
    villageId: "",
  });

  const [uploadedDocuments, setUploadedDocuments] = useState<{
    [key: string]: string;
  }>({});

  const geographic = useGeographicHierarchy();
  const {
    createClaim,
    isCreating,
    error: claimError,
  } = useClaims({ autoFetch: false });

  // Handler functions (add, update, remove, etc.) remain the same...
  const updateFormData = (field: keyof FRAClaimFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateClaimedRights = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      claimedRights: {
        ...prev.claimedRights,
        [field]: value,
      },
    }));
  };

  const addFamilyMember = () => {
    const newMember: FamilyMember = { name: "", age: 0, relationship: "" };
    setFormData((prev) => ({
      ...prev,
      familyMembers: [...(prev.familyMembers || []), newMember],
    }));
  };

  const updateFamilyMember = (
    index: number,
    field: keyof FamilyMember,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      familyMembers: prev.familyMembers?.map((member, i) =>
        i === index ? { ...member, [field]: value } : member,
      ),
    }));
  };

  const removeFamilyMember = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      familyMembers: prev.familyMembers?.filter((_, i) => i !== index),
    }));
  };

  const handleDocumentsChange = (documents: { [key: string]: string }) => {
    setUploadedDocuments(documents);
    const evidence = Object.entries(documents).map(([category, s3Key]) => ({
      s3Key,
      category,
    }));
    updateFormData("evidence", evidence);
  };

  const handleSubmit = async () => {
    if (!formData.claimantName || !formData.villageId) {
      toast.error(t("toastErrorRequiredFields"));
      return;
    }

    if (formData.familyMembers && formData.familyMembers.length > 0) {
      for (const member of formData.familyMembers) {
        if (!member.name || !member.relationship || member.age <= 0) {
          toast.error(t("toastErrorFamilyMemberInfo"));
          setCurrentStep(4);
          return;
        }
      }
    }

    if (!formData.evidence || formData.evidence.length < 2) {
      toast.error(t("toastErrorMinEvidence"));
      setCurrentStep(5);
      return;
    }

    setIsSubmitting(true);
    try {
      const claimData = formatClaimForAPI(formData);
      const result = await createClaim(claimData);
      if (result) {
        toast.success(t("toastSuccessClaimSubmitted"));
        router.push("/dashboard/u");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(t("toastErrorClaimFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.claimantName) {
        toast.error(t("toastErrorClaimantName"));
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.villageId) {
        toast.error(t("toastErrorLocationSelection"));
        return;
      }
    }
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInformationStep
            formData={formData}
            updateFormData={updateFormData}
            t={t}
          />
        );
      case 2:
        return (
          <LocationDetailsStep
            formData={formData}
            updateFormData={updateFormData}
            geographic={geographic}
            t={t}
          />
        );
      case 3:
        return (
          <ForestRightsStep
            formData={formData}
            updateFormData={updateFormData}
            updateClaimedRights={updateClaimedRights}
            t={t}
          />
        );
      case 4:
        return (
          <FamilyMembersStep
            formData={formData}
            addFamilyMember={addFamilyMember}
            updateFamilyMember={updateFamilyMember}
            removeFamilyMember={removeFamilyMember}
            t={t}
          />
        );
      case 5:
        return (
          <EvidenceUploadStep
            uploadedDocuments={uploadedDocuments}
            handleDocumentsChange={handleDocumentsChange}
            t={t}
          />
        );
      case 6:
        return (
          <ReviewSubmitStep
            formData={formData}
            uploadedDocuments={uploadedDocuments}
            geographic={geographic}
            t={t}
          />
        );
      default:
        return null;
    }
  };
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto p-6 sm:p-8">
          <h1 className="text-4xl font-bold mb-2">{t("fileFraClaim")}</h1>
          <p className="text-green-100 text-lg">
            {t("fileFraClaimDescription")}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Progress Stepper */}
        <div className="mb-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex items-center justify-center w-14 h-14 rounded-full border-3 mb-3 transition-all duration-300 shadow-lg",
                      currentStep >= step.id
                        ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white border-green-400 transform scale-110"
                        : "bg-white text-gray-500 border-gray-300 hover:border-green-300",
                    )}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-semibold text-center max-w-20",
                      currentStep >= step.id
                        ? "text-green-700"
                        : "text-gray-500",
                    )}
                  >
                    {t(step.nameKey)}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-1 mx-4 rounded-full -translate-y-6 transition-all duration-300",
                      currentStep > index + 1 
                        ? "bg-gradient-to-r from-green-400 to-emerald-500" 
                        : "bg-gray-200",
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {claimError && <ApiError error={claimError} className="mb-6" />}

        {/* Custom Card Component */}
        <div className="bg-white rounded-3xl shadow-xl border border-green-100 mb-8 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
            <div className="flex items-center gap-3 text-white">
              {React.createElement(steps[currentStep - 1].icon, {
                className: "w-7 h-7",
              })}
              <div>
                <h2 className="text-2xl font-bold">
                  {t("stepHeader", {
                    currentStep,
                    stepName: t(steps[currentStep - 1].nameKey),
                  })}
                </h2>
                <p className="text-green-100 mt-1">{t("stepDescription")}</p>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-8 bg-gradient-to-br from-white to-green-50">
            {renderStepContent()}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-8 py-3 text-lg font-semibold border-2 border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 rounded-xl transition-all duration-200 disabled:opacity-50"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t("previousButton")}
          </Button>

          {currentStep < steps.length ? (
            <Button 
              onClick={nextStep}
              className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              {t("nextButton")}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || isCreating}
              className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
            >
              {isSubmitting || isCreating ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {t("submittingButton")}
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  {t("submitClaimButton")}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function PersonalInformationStep({ formData, updateFormData, t }: any) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="claimantName" className="text-green-700 font-semibold">{t("labelClaimantName")}</Label>
          <Input 
            id="claimantName" 
            value={formData.claimantName || ""} 
            onChange={(e) => updateFormData("claimantName", e.target.value)} 
            className="border-green-200 focus:border-green-500 focus:ring-green-200 rounded-lg shadow-sm"
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="spouseName" className="text-green-700 font-semibold">{t("labelSpouseName")}</Label>
          <Input 
            id="spouseName" 
            value={formData.spouseName || ""} 
            onChange={(e) => updateFormData("spouseName", e.target.value)} 
            className="border-green-200 focus:border-green-500 focus:ring-green-200 rounded-lg shadow-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fatherOrMotherName" className="text-green-700 font-semibold">{t("labelFatherMotherName")}</Label>
          <Input 
            id="fatherOrMotherName" 
            value={formData.fatherOrMotherName || ""} 
            onChange={(e) => updateFormData("fatherOrMotherName", e.target.value)} 
            className="border-green-200 focus:border-green-500 focus:ring-green-200 rounded-lg shadow-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="claimantCategory" className="text-green-700 font-semibold">{t("labelClaimantCategory")}</Label>
          <Select value={formData.claimantCategory} onValueChange={(value) => updateFormData("claimantCategory", value)}>
            <SelectTrigger className="border-green-200 focus:border-green-500 focus:ring-green-200 rounded-lg shadow-sm">
              <SelectValue placeholder={t("placeholderSelectCategory")} />
            </SelectTrigger>
            <SelectContent className="border-green-200">
              <SelectItem value="ST">{t("optionST")}</SelectItem>
              <SelectItem value="OTFD">{t("optionOTFD")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="fullResidentialAddress" className="text-green-700 font-semibold">{t("labelResidentialAddress")}</Label>
        <Textarea 
          id="fullResidentialAddress" 
          value={formData.fullResidentialAddress || ""} 
          onChange={(e) => updateFormData("fullResidentialAddress", e.target.value)} 
          rows={3} 
          className="border-green-200 focus:border-green-500 focus:ring-green-200 rounded-lg shadow-sm resize-none"
        />
      </div>
    </div>
  );
}

function LocationDetailsStep({ formData, updateFormData, geographic, t }: any) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="state" className="text-green-700 font-semibold">{t("labelState")}</Label>
            <Select value={geographic.selectedStateId} onValueChange={geographic.setSelectedStateId}>
              <SelectTrigger className="border-green-200 focus:border-green-500 focus:ring-green-200 rounded-lg shadow-sm">
                <SelectValue placeholder={t("placeholderSelectState")} />
              </SelectTrigger>
              <SelectContent className="border-green-200">
                {geographic.states.map((state: any) => (
                  <SelectItem key={state.id} value={state.id}>{state.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="district" className="text-green-700 font-semibold">{t("labelDistrict")}</Label>
            <Select value={geographic.selectedDistrictId} onValueChange={geographic.setSelectedDistrictId} disabled={!geographic.selectedStateId}>
              <SelectTrigger className="border-green-200 focus:border-green-500 focus:ring-green-200 rounded-lg shadow-sm disabled:bg-gray-50">
                <SelectValue placeholder={t("placeholderSelectDistrict")} />
              </SelectTrigger>
              <SelectContent className="border-green-200">
                {geographic.districts.map((district: any) => (
                  <SelectItem key={district.id} value={district.id}>{district.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="villageId" className="text-green-700 font-semibold">{t("labelVillage")}</Label>
            <VillageSearch 
              districtId={geographic.selectedDistrictId} 
              onVillageSelect={(village) => { 
                updateFormData("villageId", village.id); 
                updateFormData("villageName", village.name); 
              }} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gramPanchayat" className="text-green-700 font-semibold">{t("labelGramPanchayat")}</Label>
            <Input 
              id="gramPanchayat" 
              value={formData.gramPanchayat || ""} 
              onChange={(e) => updateFormData("gramPanchayat", e.target.value)} 
              className="border-green-200 focus:border-green-500 focus:ring-green-200 rounded-lg shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tehsil" className="text-green-700 font-semibold">{t("labelTehsil")}</Label>
            <Input 
              id="tehsil" 
              value={formData.tehsil || ""} 
              onChange={(e) => updateFormData("tehsil", e.target.value)} 
              className="border-green-200 focus:border-green-500 focus:ring-green-200 rounded-lg shadow-sm"
            />
          </div>
        </div>
      </div>
    );
}

function ForestRightsStep({ formData, updateFormData, updateClaimedRights, t }: any) {
    const rights = [
        { key: "habitationRights", labelKey: "rightHabitation" },
        { key: "cultivationRights", labelKey: "rightCultivation" },
        { key: "grazingRights", labelKey: "rightGrazing" },
        { key: "fishingRights", labelKey: "rightFishing" },
        { key: "waterRights", labelKey: "rightWater" },
        { key: "ntfpRights", labelKey: "rightNTFP" },
    ];
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="type" className="text-green-700 font-semibold">{t("labelTypeOfRights")}</Label>
          <Select value={formData.type} onValueChange={(value) => updateFormData("type", value)}>
            <SelectTrigger className="border-green-200 focus:border-green-500 focus:ring-green-200 rounded-lg shadow-sm">
              <SelectValue placeholder={t("placeholderSelectRightsType")} />
            </SelectTrigger>
            <SelectContent className="border-green-200">
              <SelectItem value="IFR">{t("optionIFR")}</SelectItem>
              <SelectItem value="CR">{t("optionCR")}</SelectItem>
              <SelectItem value="CFR">{t("optionCFR")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-4">
          <Label className="text-green-700 font-semibold">{t("labelRightsBeingClaimed")}</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rights.map((right) => (
              <label key={right.key} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.claimedRights?.[right.key] || false} 
                  onChange={(e) => updateClaimedRights(right.key, e.target.checked)} 
                  className="w-4 h-4 text-green-600 border-green-300 rounded focus:ring-green-500"
                />
                <span className="text-sm font-medium text-green-800">{t(right.labelKey)}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="landArea" className="text-green-700 font-semibold">{t("labelLandArea")}</Label>
            <Input 
              id="landArea" 
              type="number" 
              value={formData.claimedRights?.landArea || ""} 
              onChange={(e) => updateClaimedRights("landArea", parseFloat(e.target.value) || 0)} 
              step="0.01" 
              min="0" 
              className="border-green-200 focus:border-green-500 focus:ring-green-200 rounded-lg shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="boundaries" className="text-green-700 font-semibold">{t("labelBoundaries")}</Label>
            <Input 
              id="boundaries" 
              value={formData.claimedRights?.boundaries || ""} 
              onChange={(e) => updateClaimedRights("boundaries", e.target.value)} 
              className="border-green-200 focus:border-green-500 focus:ring-green-200 rounded-lg shadow-sm"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="traditionOfUse" className="text-green-700 font-semibold">{t("labelTraditionOfUse")}</Label>
          <Textarea 
            id="traditionOfUse" 
            value={formData.claimedRights?.traditionOfUse || ""} 
            onChange={(e) => updateClaimedRights("traditionOfUse", e.target.value)} 
            rows={4} 
            placeholder={t("placeholderTraditionOfUse")} 
            className="border-green-200 focus:border-green-500 focus:ring-green-200 rounded-lg shadow-sm resize-none"
          />
        </div>
      </div>
    );
}

function FamilyMembersStep({ formData, addFamilyMember, updateFamilyMember, removeFamilyMember, t }: any) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-green-700">{t("headerFamilyMembers")}</h3>
          <Button 
            onClick={addFamilyMember} 
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
          >
            {t("buttonAddMember")}
          </Button>
        </div>
        {formData.familyMembers?.map((member: FamilyMember, index: number) => (
          <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-green-700 font-semibold">{t("labelNameRequired")}</Label>
                <Input 
                  value={member.name} 
                  onChange={(e) => updateFamilyMember(index, "name", e.target.value)} 
                  className="border-green-200 focus:border-green-500 focus:ring-green-200 rounded-lg shadow-sm"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-green-700 font-semibold">{t("labelAgeRequired")}</Label>
                <Input 
                  type="number" 
                  value={member.age} 
                  onChange={(e) => updateFamilyMember(index, "age", parseInt(e.target.value) || 0)} 
                  min="1" 
                  className="border-green-200 focus:border-green-500 focus:ring-green-200 rounded-lg shadow-sm"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-green-700 font-semibold">{t("labelRelationshipRequired")}</Label>
                <Input 
                  value={member.relationship} 
                  onChange={(e) => updateFamilyMember(index, "relationship", e.target.value)} 
                  className="border-green-200 focus:border-green-500 focus:ring-green-200 rounded-lg shadow-sm"
                  required 
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={() => removeFamilyMember(index)} 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 rounded-lg font-medium transition-all duration-200"
                >
                  {t("buttonRemove")}
                </Button>
              </div>
            </div>
          </div>
        ))}
        {(!formData.familyMembers || formData.familyMembers.length === 0) && (
          <div className="text-center py-12 text-green-600 bg-green-50 rounded-xl border border-green-200">
            <div className="text-lg font-medium mb-2">{t("emptyStateNoFamilyMembers")}</div>
            <p className="text-green-500">Click "Add Member" to get started</p>
          </div>
        )}
      </div>
    );
}

function EvidenceUploadStep({ uploadedDocuments, handleDocumentsChange, t }: any) {
    return (
      <div className="space-y-6">
        <DocumentUpload uploadedDocuments={uploadedDocuments} onDocumentsChange={handleDocumentsChange} />
      </div>
    );
}

function ReviewSubmitStep({ formData, uploadedDocuments, geographic, t }: any) {
    const selectedVillage = geographic.villages.find((v: any) => v.id === formData.villageId);
    const selectedDistrict = geographic.districts.find((d: any) => d.id === geographic.selectedDistrictId);
    const selectedState = geographic.states.find((s: any) => s.id === geographic.selectedStateId);
    const na = t("notAvailable");
  
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-green-700 mb-6">{t("reviewHeader")}</h3>
        
        {/* Personal Information Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 shadow-sm">
          <h4 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            {t("reviewPersonalInfo")}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-white rounded-lg border border-green-100">
              <span className="font-semibold text-green-800">{t("reviewName")}: </span>
              <span className="text-gray-700">{formData.claimantName}</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-green-100">
              <span className="font-semibold text-green-800">{t("reviewCategory")}: </span>
              <span className="text-gray-700">{formData.claimantCategory}</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-green-100">
              <span className="font-semibold text-green-800">{t("reviewSpouse")}: </span>
              <span className="text-gray-700">{formData.spouseName || na}</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-green-100">
              <span className="font-semibold text-green-800">{t("reviewFatherMother")}: </span>
              <span className="text-gray-700">{formData.fatherOrMotherName || na}</span>
            </div>
          </div>
        </div>
        
        {/* Location Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 shadow-sm">
          <h4 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            {t("reviewLocation")}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-white rounded-lg border border-blue-100">
              <span className="font-semibold text-blue-800">{t("reviewVillage")}: </span>
              <span className="text-gray-700">{selectedVillage?.name || na}</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-blue-100">
              <span className="font-semibold text-blue-800">{t("reviewDistrict")}: </span>
              <span className="text-gray-700">{selectedDistrict?.name || na}</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-blue-100">
              <span className="font-semibold text-blue-800">{t("reviewState")}: </span>
              <span className="text-gray-700">{selectedState?.name || na}</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-blue-100">
              <span className="font-semibold text-blue-800">{t("reviewGramPanchayat")}: </span>
              <span className="text-gray-700">{formData.gramPanchayat || na}</span>
            </div>
          </div>
        </div>
        
        {/* Forest Rights Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 shadow-sm">
          <h4 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            {t("reviewForestRights")}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-white rounded-lg border border-teal-100">
              <span className="font-semibold text-teal-800">{t("reviewType")}: </span>
              <span className="text-gray-700">{formData.type}</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-teal-100">
              <span className="font-semibold text-teal-800">{t("reviewLandArea")}: </span>
              <span className="text-gray-700">{formData.claimedRights?.landArea || 0} {t("acres")}</span>
            </div>
          </div>
        </div>
        
        {/* Documents Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 shadow-sm">
          <h4 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            {t("reviewDocuments")}
          </h4>
          <div className="space-y-2">
            {Object.keys(uploadedDocuments).length > 0 ? (
              Object.keys(uploadedDocuments).map((docType) => (
                <div key={docType} className="flex justify-between items-center p-3 bg-white rounded-lg border border-purple-100">
                  <span className="font-medium text-purple-800">{docType}</span>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">{t("statusUploaded")}</span>
                </div>
              ))
            ) : (
              <div className="p-4 bg-white rounded-lg border border-purple-100 text-center text-gray-500">{t("statusNoDocuments")}</div>
            )}
          </div>
        </div>
      </div>
    );
}