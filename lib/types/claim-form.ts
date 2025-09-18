// Frontend form types that follow the exact Prisma schema structure
import { FRAType, FamilyMember, Evidence } from './api';

// Form data interface matching the Prisma FRAClaim model exactly
export interface FRAClaimFormData {
  // Section 1: Basic Information (matching Prisma schema exactly)
  type: FRAType;
  claimantName: string;
  spouseName: string;
  fatherOrMotherName: string;
  fullResidentialAddress: string;
  villageName: string;
  gramPanchayat: string;
  tehsil: string;
  district: string;
  claimantCategory: string; // "ST" or "OTFD"
  casteOrTribeCertificateS3Key: string;

  // Section 2: Details of the Forest Right Claimed
  claimedRights: {
    // Specific forest rights being claimed
    habitationRights?: boolean;
    cultivationRights?: boolean;
    grazingRights?: boolean;
    fishingRights?: boolean;
    waterRights?: boolean;
    ntfpRights?: boolean; // Non-Timber Forest Produce
    
    // Area and location details
    landArea?: number; // in acres
    surveyNumbers?: string[];
    boundaries?: string;
    
    // Additional details
    traditionOfUse?: string;
    evidenceOfUse?: string;
    
    // Other rights
    otherRights?: string;
  };

  // Section 3: Family Members (matching FamilyMember schema)
  familyMembers: Array<{
    name: string;
    age: number;
    relationship: string;
  }>;

  // Section 4: Evidence (matching Evidence schema)  
  evidence: Array<{
    s3Key: string;
    category: string;
  }>;

  // Section 5: Additional Information
  otherRelevantInfo: string;
  applicantSignatureOrThumbS3Key: string;

  // Core required field
  villageId: string;
}

// Step-by-step form data (for multi-step form)
export interface StepFormData {
  // Step 1: Personal Information
  personalInfo: {
    claimantName: string;
    spouseName: string;
    fatherOrMotherName: string;
    fullResidentialAddress: string;
    claimantCategory: string;
    casteOrTribeCertificateS3Key: string;
  };

  // Step 2: Location Information
  locationInfo: {
    villageName: string;
    gramPanchayat: string;
    tehsil: string;
    district: string;
    villageId: string;
  };

  // Step 3: Forest Rights Claimed
  rightsInfo: {
    type: FRAType;
    claimedRights: FRAClaimFormData['claimedRights'];
  };

  // Step 4: Family Members
  familyInfo: {
    familyMembers: FRAClaimFormData['familyMembers'];
  };

  // Step 5: Evidence Upload
  evidenceInfo: {
    evidence: FRAClaimFormData['evidence'];
  };

  // Step 6: Additional Information
  additionalInfo: {
    otherRelevantInfo: string;
    applicantSignatureOrThumbS3Key: string;
  };
}

// Validation schemas for each step
export const stepValidationConfig = {
  personalInfo: {
    required: ['claimantName', 'claimantCategory'],
    optional: ['spouseName', 'fatherOrMotherName', 'fullResidentialAddress', 'casteOrTribeCertificateS3Key']
  },
  locationInfo: {
    required: ['villageId'],
    optional: ['villageName', 'gramPanchayat', 'tehsil', 'district']
  },
  rightsInfo: {
    required: ['type'],
    optional: ['claimedRights']
  },
  familyInfo: {
    required: [],
    optional: ['familyMembers']
  },
  evidenceInfo: {
    required: ['evidence'],
    optional: []
  },
  additionalInfo: {
    required: [],
    optional: ['otherRelevantInfo', 'applicantSignatureOrThumbS3Key']
  }
};

// Helper type for document categories (matching Evidence.category)
export const DocumentCategories = {
  IDENTITY_PROOF: 'IdentityProof',
  ADDRESS_PROOF: 'AddressProof', 
  CASTE_CERTIFICATE: 'CasteCertificate',
  OCCUPATION_PROOF: 'OccupationProof',
  LAND_RECORDS: 'LandRecords',
  GOVERNMENT_RECORDS: 'GovernmentRecords',
  PHYSICAL_EVIDENCE: 'PhysicalEvidence',
  WITNESS_STATEMENT: 'WitnessStatement',
  OTHER: 'Other'
} as const;

export type DocumentCategory = typeof DocumentCategories[keyof typeof DocumentCategories];
