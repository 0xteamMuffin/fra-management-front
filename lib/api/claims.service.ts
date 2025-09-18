import { api, endpoints } from '@/lib/api-client';
import { FRAClaim, ClaimStatus } from '@/lib/types/api';

export interface CreateClaimRequest {
  // Section 1: Basic Information (exactly matching Prisma schema)
  type: 'IFR' | 'CR' | 'CFR';
  claimantName: string;
  spouseName?: string;
  fatherOrMotherName?: string;
  fullResidentialAddress?: string;
  villageName?: string;
  gramPanchayat?: string;
  tehsil?: string;
  district?: string;
  claimantCategory: string; // "ST" or "OTFD" - matches backend string type
  casteOrTribeCertificateS3Key?: string;

  // Section 2: Details of the Forest Right Claimed
  claimedRights?: any; // JSON object for flexibility

  // Section 4: Additional Information
  otherRelevantInfo?: string;
  applicantSignatureOrThumbS3Key?: string;

  // Core information
  villageId: string;

  // Related data (sent as nested objects, backend creates relationships)
  familyMembers?: Array<{
    name: string;
    age: number;
    relationship: string;
  }>;

  evidence: Array<{
    s3Key: string;
    category: string;
  }>;
}

export const claimsService = {
  // Get all claims
  async getAllClaims(): Promise<FRAClaim[]> {
    const response = await api.get<FRAClaim[]>(endpoints.claims);
    return response.data;
  },

  // Get claim by ID
  async getClaimById(id: string): Promise<FRAClaim> {
    const response = await api.get<FRAClaim>(`${endpoints.claims}/${id}`);
    return response.data;
  },

  // Create new claim
  async createClaim(claimData: CreateClaimRequest): Promise<FRAClaim> {
    const response = await api.post<FRAClaim>(endpoints.claims, claimData);
    return response.data;
  },

  // Update claim
  async updateClaim(id: string, claimData: Partial<CreateClaimRequest>): Promise<FRAClaim> {
    const response = await api.put<FRAClaim>(`${endpoints.claims}/${id}`, claimData);
    return response.data;
  },

  // Delete claim
  async deleteClaim(id: string): Promise<void> {
    await api.delete(`${endpoints.claims}/${id}`);
  },

  // Verify claim (for GramSabha and higher)
  async verifyClaim(id: string): Promise<FRAClaim> {
    const response = await api.post<FRAClaim>(endpoints.fra.verify(id));
    return response.data;
  },

  // Forward claim to the next stage
  async forwardClaim(id: string, remarks: string): Promise<FRAClaim> {
    const response = await api.post<FRAClaim>(endpoints.fra.forward(id), { remarks });
    return response.data;
  },

  // Get dashboard stats
  async getDashboardStats(): Promise<any> {
    const response = await api.get(endpoints.fra.stats);
    return response.data;
  },

  // Approve claim (for DistrictCommittee)
  async approveClaim(id: string): Promise<FRAClaim> {
    const response = await api.post<FRAClaim>(endpoints.fra.approve(id));
    return response.data;
  },

  // Reject claim (for DistrictCommittee)
  async rejectClaim(id: string, reason: string): Promise<FRAClaim> {
    const response = await api.post<FRAClaim>(endpoints.fra.reject(id), { reason });
    return response.data;
  },

  // Get claims by status
  async getClaimsByStatus(status: ClaimStatus): Promise<FRAClaim[]> {
    const response = await api.get<FRAClaim[]>(`${endpoints.claims}?status=${status}`);
    return response.data;
  },

  // Get claims by village
  async getClaimsByVillage(villageId: string): Promise<FRAClaim[]> {
    const response = await api.get<FRAClaim[]>(`${endpoints.claims}?villageId=${villageId}`);
    return response.data;
  },
};
