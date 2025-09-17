"use client"

import { useState } from "react";
import type { ApplicantDetails, ClaimRow } from "./types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  claim: ClaimRow;
  onBack: () => void;
  onSave: (updatedClaim: ClaimRow) => void;
}

export function EditClaimForm({ claim, onBack, onSave }: Props) {
  const [formData, setFormData] = useState<ClaimRow>(claim);

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    
    if (Object.keys(formData.applicantDetails).includes(name)) {
      setFormData(prev => ({
        ...prev,
        applicantDetails: {
          ...prev.applicantDetails,
          [name]: name === 'age' ? parseInt(value) || 0 : value,
        }
      }));
    } else { 
      setFormData(prev => ({
        ...prev,
        [name]: name === 'landArea' ? parseFloat(value) || 0 : value,
      }));
    }
  };

  
  const handleSelectChange = (name: keyof ClaimRow | keyof ApplicantDetails, value: string) => {
     if (Object.keys(formData.applicantDetails).includes(name)) {
        setFormData(prev => ({
          ...prev,
          applicantDetails: { ...prev.applicantDetails, [name]: value as any }
        }));
     } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
     }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft size={16} />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-green-800">Edit Claim: {claim.id}</h1>
          <p className="text-slate-600">Review and update the applicant and claim details below.</p>
        </div>
      </div>

      {/* Applicant Information Section */}
      <div className="p-6 border rounded-lg bg-white shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-700 mb-4 border-b pb-2">
          Applicant Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div><Label htmlFor="fullName">Full Name</Label><Input id="fullName" name="fullName" value={formData.applicantDetails.fullName} onChange={handleChange} /></div>
          <div><Label htmlFor="fatherName">Father's Name</Label><Input id="fatherName" name="fatherName" value={formData.applicantDetails.fatherName} onChange={handleChange} /></div>
          <div><Label htmlFor="age">Age</Label><Input id="age" name="age" type="number" value={formData.applicantDetails.age} onChange={handleChange} /></div>
          <div><Label htmlFor="gender">Gender</Label><Select name="gender" value={formData.applicantDetails.gender} onValueChange={(v) => handleSelectChange('gender', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select></div>
          <div><Label htmlFor="casteCategory">Caste Category</Label><Select name="casteCategory" value={formData.applicantDetails.casteCategory} onValueChange={(v) => handleSelectChange('casteCategory', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ST">ST</SelectItem><SelectItem value="SC">SC</SelectItem><SelectItem value="OBC">OBC</SelectItem><SelectItem value="General">General</SelectItem></SelectContent></Select></div>
          <div><Label htmlFor="phoneNumber">Phone Number</Label><Input id="phoneNumber" name="phoneNumber" value={formData.applicantDetails.phoneNumber} onChange={handleChange} /></div>
          <div><Label htmlFor="aadharNumber">Aadhar Number</Label><Input id="aadharNumber" name="aadharNumber" value={formData.applicantDetails.aadharNumber} onChange={handleChange} /></div>
          <div className="md:col-span-2 lg:col-span-3"><Label htmlFor="fullAddress">Complete Address</Label><Input id="fullAddress" name="fullAddress" value={formData.applicantDetails.fullAddress} onChange={handleChange} /></div>
        </div>
      </div>
      
      {/* Claim Details Section */}
      <div className="p-6 border rounded-lg bg-white shadow-sm">
         <h2 className="text-2xl font-semibold text-slate-700 mb-4 border-b pb-2">
          Claim Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div><Label>Claim ID (Read-only)</Label><Input value={formData.id} disabled /></div>
            <div><Label htmlFor="district">District</Label><Input id="district" name="district" value={formData.district} onChange={handleChange} /></div>
            <div><Label htmlFor="gramPanchayat">Gram Panchayat</Label><Input id="gramPanchayat" name="gramPanchayat" value={formData.gramPanchayat} onChange={handleChange} /></div>
            <div><Label htmlFor="village">Village</Label><Input id="village" name="village" value={formData.village} onChange={handleChange} /></div>
            <div><Label htmlFor="claimType">Claim Type</Label><Select name="claimType" value={formData.claimType} onValueChange={(v) => handleSelectChange('claimType', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Individual">Individual</SelectItem><SelectItem value="Community">Community</SelectItem></SelectContent></Select></div>
            <div><Label htmlFor="landArea">Land Area (Acres)</Label><Input id="landArea" name="landArea" type="number" step="0.1" value={formData.landArea} onChange={handleChange} /></div>
            <div><Label htmlFor="dateFiled">Date Filed</Label><Input id="dateFiled" name="dateFiled" type="date" value={formData.dateFiled} onChange={handleChange} /></div>
            <div><Label htmlFor="status">Current Status</Label><Select name="status" value={formData.status} onValueChange={(v) => handleSelectChange('status', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Awaiting FRC Verification">Awaiting FRC Verification</SelectItem><SelectItem value="Under SDLC Review">Under SDLC Review</SelectItem><SelectItem value="Under DLC Review">Under DLC Review</SelectItem><SelectItem value="Approved">Approved</SelectItem><SelectItem value="Rejected">Rejected</SelectItem></SelectContent></Select></div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
         <Button variant="outline" onClick={onBack}>Cancel</Button>
         <Button onClick={() => onSave(formData)}>Save Changes</Button>
      </div>
    </div>
  );
}