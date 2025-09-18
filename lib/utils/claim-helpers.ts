import { FRAClaim, ClaimStatus, FRAType, UserRole } from '@/lib/types/api';
import type { ClaimRow, ApplicantDetails } from '@/components/ui/verification/shared/types';
import type { CreateClaimRequest } from '@/lib/api/claims.service';

// Helper function to extract land area from claimedRights JSON
export function extractLandArea(claimedRights: any): number {
  if (!claimedRights) return 0;
  
  // Try to find land area in various possible JSON structures
  if (typeof claimedRights === 'object') {
    return claimedRights.landArea || 
           claimedRights.area || 
           claimedRights.areaInAcres || 
           0;
  }
  
  return 0;
}

// Helper function to generate claim ID in the expected format
export function generateClaimDisplayId(fraClaim: FRAClaim): string {
  const date = new Date(fraClaim.createdAt);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  // Use last 3 characters of UUID for uniqueness
  const sequential = fraClaim.id.slice(-3).toUpperCase();
  
  return `FRA${year}${month}${day}-${sequential}`;
}

// Convert FRAClaim to ClaimRow for UI compatibility (temporary bridge function)
export function convertFRAClaimToClaimRow(fraClaim: FRAClaim, userRole?: UserRole): ClaimRow {
  const applicantDetails: ApplicantDetails = {
    fullName: fraClaim.claimantName,
    fatherName: fraClaim.fatherOrMotherName || 'N/A',
    age: 0, // This would need to be calculated or stored separately
    gender: 'Other', // This would need to be added to the backend schema
    // Map backend claimantCategory to UI casteCategory
    casteCategory: mapClaimantCategoryToUI(fraClaim.claimantCategory),
    aadharNumber: 'XXXX XXXX XXXX XXXX', // Not stored for privacy
    phoneNumber: 'N/A', // This would need to be added to the schema
    fullAddress: fraClaim.fullResidentialAddress || 'N/A',
  };

  return {
    id: generateClaimDisplayId(fraClaim),
    district: fraClaim.district || fraClaim.village?.name || 'Unknown',
    village: fraClaim.villageName || fraClaim.village?.name || 'Unknown',
    gramPanchayat: fraClaim.gramPanchayat || 'Unknown',
    applicantName: fraClaim.claimantName,
    claimType: mapFRATypeToUI(fraClaim.type),
    dateFiled: fraClaim.createdAt.split('T')[0], // Convert to YYYY-MM-DD
    landArea: extractLandArea(fraClaim.claimedRights),
    status: mapBackendStatusToUI(fraClaim.status, userRole),
    applicantDetails,
  };
}

// Map backend ClaimStatus to UI status strings
export function mapBackendStatusToUI(backendStatus: ClaimStatus, userRole?: UserRole): ClaimRow['status'] {
  switch (backendStatus) {
    case ClaimStatus.Pending:
      return 'Awaiting FRC Verification';
    case ClaimStatus.Verified:
      // For officials, "Verified" means it's at their desk for the next step
      if (userRole === UserRole.SubDivisionalCommittee) {
        return 'Under SDLC Review';
      }
      if (userRole === UserRole.DistrictCommittee) {
        return 'Under DLC Review';
      }
      // For citizens, it's a generic "under review"
      return 'Under SDLC Review';
    case ClaimStatus.Granted:
      return 'Approved';
    case ClaimStatus.Rejected:
      return 'Rejected';
    default:
      return 'Awaiting FRC Verification';
  }
}

// Map UI status back to backend ClaimStatus
export function mapUIStatusToBackend(uiStatus: ClaimRow['status']): ClaimStatus {
  switch (uiStatus) {
    case 'Awaiting FRC Verification':
      return ClaimStatus.Pending;
    case 'Under SDLC Review':
    case 'Under DLC Review':
      return ClaimStatus.Verified;
    case 'Approved':
      return ClaimStatus.Granted;
    case 'Rejected':
      return ClaimStatus.Rejected;
    default:
      return ClaimStatus.Pending;
  }
}

// Map backend claimantCategory to UI casteCategory
export function mapClaimantCategoryToUI(backendCategory: string): ApplicantDetails['casteCategory'] {
  switch (backendCategory) {
    case 'ST':
      return 'ST';
    case 'OTFD':
      return 'OBC'; // Other Traditional Forest Dwellers mapped to OBC for UI
    default:
      return 'General';
  }
}

// Map UI casteCategory back to backend claimantCategory
export function mapUICategoryToBackend(uiCategory: ApplicantDetails['casteCategory']): string {
  switch (uiCategory) {
    case 'ST':
      return 'ST';
    case 'OBC':
    case 'SC':
      return 'OTFD'; // Map both OBC and SC to OTFD for backend
    case 'General':
    default:
      return 'OTFD';
  }
}

// Map FRAType to UI claim type
export function mapFRATypeToUI(fraType: FRAType): ClaimRow['claimType'] {
  switch (fraType) {
    case FRAType.IFR:
      return 'Individual'; // Individual Forest Rights
    case FRAType.CR:
    case FRAType.CFR:
      return 'Community'; // Community Rights / Community Forest Rights
    default:
      return 'Individual';
  }
}

// Map UI claim type back to FRAType
export function mapUITypeToFRA(uiType: ClaimRow['claimType']): FRAType {
  switch (uiType) {
    case 'Individual':
      return FRAType.IFR;
    case 'Community':
      return FRAType.CFR; // Default community type
    default:
      return FRAType.IFR;
  }
}

// Helper function to format claim data for backend API
export function formatClaimForAPI(claimData: any): CreateClaimRequest {
  return {
    // Required fields - using proper type casting
    type: claimData.type as 'IFR' | 'CR' | 'CFR' || 'IFR',
    claimantName: claimData.claimantName,
    villageId: claimData.villageId,
    claimantCategory: claimData.claimantCategory || 'ST',
    evidence: claimData.evidence || [],

    // Optional personal information
    spouseName: claimData.spouseName || undefined,
    fatherOrMotherName: claimData.fatherOrMotherName || undefined,
    fullResidentialAddress: claimData.fullResidentialAddress || undefined,
    villageName: claimData.villageName || undefined,
    gramPanchayat: claimData.gramPanchayat || undefined,
    tehsil: claimData.tehsil || undefined,
    district: claimData.district || undefined,
    casteOrTribeCertificateS3Key: claimData.casteOrTribeCertificateS3Key || undefined,

    // Claimed rights JSON
    claimedRights: claimData.claimedRights || undefined,

    // Additional information
    otherRelevantInfo: claimData.otherRelevantInfo || undefined,
    applicantSignatureOrThumbS3Key: claimData.applicantSignatureOrThumbS3Key || undefined,

    // Family members
    familyMembers: claimData.familyMembers || undefined,
  };
}
