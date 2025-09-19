"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t("fileFraClaim")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("fileFraClaimDescription")}
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full border-2 mb-2 transition-colors",
                      currentStep >= step.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border",
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
                      currentStep >= step.id
                        ? "text-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    {t(step.nameKey)}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-2 -translate-y-4",
                      currentStep > index + 1 ? "bg-primary" : "bg-border",
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {claimError && <ApiError error={claimError} className="mb-6" />}

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(steps[currentStep - 1].icon, {
                className: "w-5 h-5",
              })}
              {t("stepHeader", {
                currentStep,
                stepName: t(steps[currentStep - 1].nameKey),
              })}
            </CardTitle>
            <CardDescription>{t("stepDescription")}</CardDescription>
          </CardHeader>
          <CardContent>{renderStepContent()}</CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("previousButton")}
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={nextStep}>
              {t("nextButton")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || isCreating}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting || isCreating ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {t("submittingButton")}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="claimantName">{t("labelClaimantName")}</Label>
          <Input id="claimantName" value={formData.claimantName || ""} onChange={(e) => updateFormData("claimantName", e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="spouseName">{t("labelSpouseName")}</Label>
          <Input id="spouseName" value={formData.spouseName || ""} onChange={(e) => updateFormData("spouseName", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="fatherOrMotherName">{t("labelFatherMotherName")}</Label>
          <Input id="fatherOrMotherName" value={formData.fatherOrMotherName || ""} onChange={(e) => updateFormData("fatherOrMotherName", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="claimantCategory">{t("labelClaimantCategory")}</Label>
          <Select value={formData.claimantCategory} onValueChange={(value) => updateFormData("claimantCategory", value)}>
            <SelectTrigger><SelectValue placeholder={t("placeholderSelectCategory")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ST">{t("optionST")}</SelectItem>
              <SelectItem value="OTFD">{t("optionOTFD")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="fullResidentialAddress">{t("labelResidentialAddress")}</Label>
        <Textarea id="fullResidentialAddress" value={formData.fullResidentialAddress || ""} onChange={(e) => updateFormData("fullResidentialAddress", e.target.value)} rows={3} />
      </div>
    </div>
  );
}

function LocationDetailsStep({ formData, updateFormData, geographic, t }: any) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="state">{t("labelState")}</Label>
            <Select value={geographic.selectedStateId} onValueChange={geographic.setSelectedStateId}>
              <SelectTrigger><SelectValue placeholder={t("placeholderSelectState")} /></SelectTrigger>
              <SelectContent>
                {geographic.states.map((state: any) => (<SelectItem key={state.id} value={state.id}>{state.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="district">{t("labelDistrict")}</Label>
            <Select value={geographic.selectedDistrictId} onValueChange={geographic.setSelectedDistrictId} disabled={!geographic.selectedStateId}>
              <SelectTrigger><SelectValue placeholder={t("placeholderSelectDistrict")} /></SelectTrigger>
              <SelectContent>
                {geographic.districts.map((district: any) => (<SelectItem key={district.id} value={district.id}>{district.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="villageId">{t("labelVillage")}</Label>
            <VillageSearch districtId={geographic.selectedDistrictId} onVillageSelect={(village) => { updateFormData("villageId", village.id); updateFormData("villageName", village.name); }} />
          </div>
          <div>
            <Label htmlFor="gramPanchayat">{t("labelGramPanchayat")}</Label>
            <Input id="gramPanchayat" value={formData.gramPanchayat || ""} onChange={(e) => updateFormData("gramPanchayat", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="tehsil">{t("labelTehsil")}</Label>
            <Input id="tehsil" value={formData.tehsil || ""} onChange={(e) => updateFormData("tehsil", e.target.value)} />
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
      <div className="space-y-6">
        <div>
          <Label htmlFor="type">{t("labelTypeOfRights")}</Label>
          <Select value={formData.type} onValueChange={(value) => updateFormData("type", value)}>
            <SelectTrigger><SelectValue placeholder={t("placeholderSelectRightsType")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="IFR">{t("optionIFR")}</SelectItem>
              <SelectItem value="CR">{t("optionCR")}</SelectItem>
              <SelectItem value="CFR">{t("optionCFR")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>{t("labelRightsBeingClaimed")}</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {rights.map((right) => (
              <label key={right.key} className="flex items-center space-x-2">
                <input type="checkbox" checked={formData.claimedRights?.[right.key] || false} onChange={(e) => updateClaimedRights(right.key, e.target.checked)} className="rounded border-gray-300" />
                <span className="text-sm">{t(right.labelKey)}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="landArea">{t("labelLandArea")}</Label>
            <Input id="landArea" type="number" value={formData.claimedRights?.landArea || ""} onChange={(e) => updateClaimedRights("landArea", parseFloat(e.target.value) || 0)} step="0.01" min="0" />
          </div>
          <div>
            <Label htmlFor="boundaries">{t("labelBoundaries")}</Label>
            <Input id="boundaries" value={formData.claimedRights?.boundaries || ""} onChange={(e) => updateClaimedRights("boundaries", e.target.value)} />
          </div>
        </div>
        <div>
          <Label htmlFor="traditionOfUse">{t("labelTraditionOfUse")}</Label>
          <Textarea id="traditionOfUse" value={formData.claimedRights?.traditionOfUse || ""} onChange={(e) => updateClaimedRights("traditionOfUse", e.target.value)} rows={3} placeholder={t("placeholderTraditionOfUse")} />
        </div>
      </div>
    );
}

function FamilyMembersStep({ formData, addFamilyMember, updateFamilyMember, removeFamilyMember, t }: any) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">{t("headerFamilyMembers")}</h3>
          <Button onClick={addFamilyMember} variant="outline" size="sm">{t("buttonAddMember")}</Button>
        </div>
        {formData.familyMembers?.map((member: FamilyMember, index: number) => (
          <Card key={index} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>{t("labelNameRequired")}</Label>
                <Input value={member.name} onChange={(e) => updateFamilyMember(index, "name", e.target.value)} required />
              </div>
              <div>
                <Label>{t("labelAgeRequired")}</Label>
                <Input type="number" value={member.age} onChange={(e) => updateFamilyMember(index, "age", parseInt(e.target.value) || 0)} min="1" required />
              </div>
              <div>
                <Label>{t("labelRelationshipRequired")}</Label>
                <Input value={member.relationship} onChange={(e) => updateFamilyMember(index, "relationship", e.target.value)} required />
              </div>
              <div className="flex items-end">
                <Button onClick={() => removeFamilyMember(index)} variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">{t("buttonRemove")}</Button>
              </div>
            </div>
          </Card>
        ))}
        {(!formData.familyMembers || formData.familyMembers.length === 0) && (
          <div className="text-center py-8 text-muted-foreground">{t("emptyStateNoFamilyMembers")}</div>
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
        <h3 className="text-lg font-medium">{t("reviewHeader")}</h3>
        <Card className="p-4">
          <h4 className="font-medium mb-3">{t("reviewPersonalInfo")}</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="font-medium">{t("reviewName")}</span> {formData.claimantName}</div>
            <div><span className="font-medium">{t("reviewCategory")}</span> {formData.claimantCategory}</div>
            <div><span className="font-medium">{t("reviewSpouse")}</span> {formData.spouseName || na}</div>
            <div><span className="font-medium">{t("reviewFatherMother")}</span> {formData.fatherOrMotherName || na}</div>
          </div>
        </Card>
        <Card className="p-4">
          <h4 className="font-medium mb-3">{t("reviewLocation")}</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="font-medium">{t("reviewVillage")}</span> {selectedVillage?.name || na}</div>
            <div><span className="font-medium">{t("reviewDistrict")}</span> {selectedDistrict?.name || na}</div>
            <div><span className="font-medium">{t("reviewState")}</span> {selectedState?.name || na}</div>
            <div><span className="font-medium">{t("reviewGramPanchayat")}</span> {formData.gramPanchayat || na}</div>
          </div>
        </Card>
        <Card className="p-4">
          <h4 className="font-medium mb-3">{t("reviewForestRights")}</h4>
          <div className="text-sm">
            <div><span className="font-medium">{t("reviewType")}</span> {formData.type}</div>
            <div><span className="font-medium">{t("reviewLandArea")}</span> {formData.claimedRights?.landArea || 0} {t("acres")}</div>
          </div>
        </Card>
        <Card className="p-4">
          <h4 className="font-medium mb-3">{t("reviewDocuments")}</h4>
          <div className="text-sm">
            {Object.keys(uploadedDocuments).length > 0 ? (
              Object.keys(uploadedDocuments).map((docType) => (
                <div key={docType} className="flex justify-between">
                  <span>{docType}</span>
                  <span className="text-green-600">{t("statusUploaded")}</span>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground">{t("statusNoDocuments")}</div>
            )}
          </div>
        </Card>
      </div>
    );
}