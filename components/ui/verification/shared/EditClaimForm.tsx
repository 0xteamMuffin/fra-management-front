"use client";

import { useState } from "react";
import type { ApplicantDetails, ClaimRow } from "./types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next"; // 1. Import useTranslation

interface Props {
  claim: ClaimRow;
  onBack: () => void;
  onSave: (updatedClaim: ClaimRow) => void;
}

export function EditClaimForm({ claim, onBack, onSave }: Props) {
  const { t } = useTranslation(); // 2. Initialize the t function
  const [formData, setFormData] = useState<ClaimRow>(claim);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (Object.keys(formData.applicantDetails).includes(name)) {
      setFormData((prev) => ({
        ...prev,
        applicantDetails: {
          ...prev.applicantDetails,
          [name]: name === "age" ? parseInt(value) || 0 : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "landArea" ? parseFloat(value) || 0 : value,
      }));
    }
  };

  const handleSelectChange = (
    name: keyof ClaimRow | keyof ApplicantDetails,
    value: string,
  ) => {
    if (Object.keys(formData.applicantDetails).includes(name)) {
      setFormData((prev) => ({
        ...prev,
        applicantDetails: { ...prev.applicantDetails, [name]: value as any },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft size={16} />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-green-800">
            {t("edit_claim_title", { claimId: claim.id })} {/* Mapped */}
          </h1>
          <p className="text-slate-600">{t("edit_claim_subtitle")}</p> {/* Mapped */}
        </div>
      </div>

      {/* Applicant Information Section */}
      <div className="p-6 border rounded-lg bg-white shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-700 mb-4 border-b pb-2">
          {t("section_applicant_info")} {/* Mapped */}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="fullName">{t("label_full_name")}</Label> {/* Mapped */}
            <Input id="fullName" name="fullName" value={formData.applicantDetails.fullName} onChange={handleChange}/>
          </div>
          <div>
            <Label htmlFor="fatherName">{t("label_father_name")}</Label> {/* Mapped */}
            <Input id="fatherName" name="fatherName" value={formData.applicantDetails.fatherName} onChange={handleChange}/>
          </div>
          <div>
            <Label htmlFor="age">{t("label_age")}</Label> {/* Mapped */}
            <Input id="age" name="age" type="number" value={formData.applicantDetails.age} onChange={handleChange}/>
          </div>
          <div>
            <Label htmlFor="gender">{t("label_gender")}</Label> {/* Mapped */}
            <Select name="gender" value={formData.applicantDetails.gender} onValueChange={(v) => handleSelectChange("gender", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">{t("gender_male")}</SelectItem> {/* Mapped */}
                <SelectItem value="Female">{t("gender_female")}</SelectItem> {/* Mapped */}
                <SelectItem value="Other">{t("gender_other")}</SelectItem> {/* Mapped */}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="casteCategory">{t("label_caste_category")}</Label> {/* Mapped */}
            <Select name="casteCategory" value={formData.applicantDetails.casteCategory} onValueChange={(v) => handleSelectChange("casteCategory", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ST">{t("caste_st")}</SelectItem> {/* Mapped */}
                <SelectItem value="SC">{t("caste_sc")}</SelectItem> {/* Mapped */}
                <SelectItem value="OBC">{t("caste_obc")}</SelectItem> {/* Mapped */}
                <SelectItem value="General">{t("caste_general")}</SelectItem> {/* Mapped */}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="phoneNumber">{t("label_phone_number")}</Label> {/* Mapped */}
            <Input id="phoneNumber" name="phoneNumber" value={formData.applicantDetails.phoneNumber} onChange={handleChange}/>
          </div>
          <div>
            <Label htmlFor="aadharNumber">{t("label_aadhar_number")}</Label> {/* Mapped */}
            <Input id="aadharNumber" name="aadharNumber" value={formData.applicantDetails.aadharNumber} onChange={handleChange}/>
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <Label htmlFor="fullAddress">{t("label_complete_address")}</Label> {/* Mapped */}
            <Input id="fullAddress" name="fullAddress" value={formData.applicantDetails.fullAddress} onChange={handleChange}/>
          </div>
        </div>
      </div>

      {/* Claim Details Section */}
      <div className="p-6 border rounded-lg bg-white shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-700 mb-4 border-b pb-2">
          {t("section_claim_details")} {/* Mapped */}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <Label>{t("label_claim_id_readonly")}</Label> {/* Mapped */}
            <Input value={formData.id} disabled />
          </div>
          <div>
            <Label htmlFor="district">{t("label_district")}</Label> {/* Mapped */}
            <Input id="district" name="district" value={formData.district} onChange={handleChange}/>
          </div>
          <div>
            <Label htmlFor="gramPanchayat">{t("label_gram_panchayat")}</Label> {/* Mapped */}
            <Input id="gramPanchayat" name="gramPanchayat" value={formData.gramPanchayat} onChange={handleChange}/>
          </div>
          <div>
            <Label htmlFor="village">{t("label_village")}</Label> {/* Mapped */}
            <Input id="village" name="village" value={formData.village} onChange={handleChange}/>
          </div>
          <div>
            <Label htmlFor="claimType">{t("label_claim_type")}</Label> {/* Mapped */}
            <Select name="claimType" value={formData.claimType} onValueChange={(v) => handleSelectChange("claimType", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Individual">{t("claim_type_individual")}</SelectItem> {/* Mapped */}
                <SelectItem value="Community">{t("claim_type_community")}</SelectItem> {/* Mapped */}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="landArea">{t("label_land_area")}</Label> {/* Mapped */}
            <Input id="landArea" name="landArea" type="number" step="0.1" value={formData.landArea} onChange={handleChange}/>
          </div>
          <div>
            <Label htmlFor="dateFiled">{t("label_date_filed")}</Label> {/* Mapped */}
            <Input id="dateFiled" name="dateFiled" type="date" value={formData.dateFiled} onChange={handleChange}/>
          </div>
          <div>
            <Label htmlFor="status">{t("label_current_status")}</Label> {/* Mapped */}
            <Select name="status" value={formData.status} onValueChange={(v) => handleSelectChange("status", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Awaiting FRC Verification">{t("status_awaiting_frc")}</SelectItem> {/* Mapped */}
                <SelectItem value="Under SDLC Review">{t("status_under_sdlc")}</SelectItem> {/* Mapped */}
                <SelectItem value="Under DLC Review">{t("status_under_dlc")}</SelectItem> {/* Mapped */}
                <SelectItem value="Approved">{t("status_approved")}</SelectItem> {/* Mapped */}
                <SelectItem value="Rejected">{t("status_rejected")}</SelectItem> {/* Mapped */}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onBack}>
          {t("button_cancel")} {/* Mapped */}
        </Button>
        <Button onClick={() => onSave(formData)}>
          {t("button_save_changes")} {/* Mapped */}
        </Button>
      </div>
    </div>
  );
}