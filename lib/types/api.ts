// API Types matching Prisma schema and backend responses

// User and Authentication
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  villageId?: string;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  VillagePerson = "VillagePerson",
  GramSabha = "GramSabha",
  SubDivisionalCommittee = "SubDivisionalCommittee",
  DistrictCommittee = "DistrictCommittee",
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user?: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

// Geographic entities
export interface State {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export interface District {
  id: string;
  name: string;
  code?: string;
  stateId: string;
  boundary: any; // PostGIS geometry
  createdAt: string;
  updatedAt: string;
}

export interface Village {
  id: string;
  name: string;
  districtId: string;
  coordinates: any; // PostGIS geometry
  boundary?: any; // PostGIS geometry
  createdAt: string;
  updatedAt: string;
}

// FRA Claims
export enum FRAType {
  IFR = "IFR",
  CR = "CR",
  CFR = "CFR",
}

export enum ClaimStatus {
  Pending = "Pending",
  Verified = "Verified",
  Granted = "Granted",
  Rejected = "Rejected",
}

export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  relationship: string;
  fraClaimId: string;
  createdAt: string;
}

export interface Evidence {
  id: string;
  s3Key: string;
  category: string;
  fraClaimId: string;
  createdAt: string;
}

export interface FRAClaim {
  id: string;
  // Section 1: Basic Information (following exact Prisma schema)
  type: FRAType; // Retained for high-level classification
  claimantName: string;
  spouseName?: string;
  fatherOrMotherName?: string;
  fullResidentialAddress?: string;
  villageName?: string;
  gramPanchayat?: string;
  tehsil?: string;
  district?: string;
  claimantCategory: string; // "ST" or "OTFD" as per schema
  casteOrTribeCertificateS3Key?: string;

  // Section 2: Details of the Forest Right Claimed (as JSON for flexibility)
  claimedRights?: any; // Json type from Prisma

  // Section 4: Additional Information
  otherRelevantInfo?: string;
  applicantSignatureOrThumbS3Key?: string;

  // --- Core Claim Details ---
  status: ClaimStatus;
  currentStage: UserRole;
  villageId: string;

  // --- Verification & Approval ---
  verifiedByUserId?: string;
  approvedByUserId?: string;
  grantedAt?: string; // DateTime? from Prisma becomes optional string in frontend
  remarks?: string;

  // Relationships (populated when included)
  familyMembers?: FamilyMember[];
  evidence?: Evidence[];
  village?: Village; // When populated
  verifiedByUser?: User; // When populated
  approvedByUser?: User; // When populated

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// S3 File handling
export interface PresignedUrlRequest {
  fileName: string;
  fileType: string;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  key: string;
}

// Document Processing
export interface DocumentProcessingRequest {
  s3Key: string;
}

export interface DocumentProcessingResponse {
  message: string;
  processingId: string;
}

export interface DocumentProcessingStatus {
  id: string;
  s3Key: string;
  status: "PENDING" | "OCR_COMPLETE" | "NER_COMPLETE" | "FAILED";
  ocrEngineUsed?: string;
  extractedText?: string;
  structuredData?: any;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response wrapper
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success?: boolean;
  error?: string;
}

// Error response
export interface ApiError {
  message: string;
  statusCode?: number;
  details?: any;
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}
