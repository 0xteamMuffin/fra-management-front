import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';
import { claimsService, FRAClaim, ClaimStatus } from '@/lib/api';
import { convertFRAClaimToClaimRow } from '@/lib/utils/claim-helpers';
import type { ClaimRow } from '@/components/ui/verification/shared/types';

interface UseClaimsOptions {
  autoFetch?: boolean;
  status?: ClaimStatus;
  villageId?: string;
}

export function useClaims(options: UseClaimsOptions = {}) {
  const { autoFetch = true, status, villageId } = options;
  
  const [uiClaims, setUiClaims] = useState<ClaimRow[]>([]);
  
  // API calls
  const { 
    data: rawClaims, 
    isLoading, 
    error, 
    execute: fetchClaims 
  } = useApi(claimsService.getAllClaims);

  const { 
    execute: verifyClaim, 
    isLoading: isVerifying 
  } = useApi(claimsService.verifyClaim);

  const { 
    execute: approveClaim, 
    isLoading: isApproving 
  } = useApi(claimsService.approveClaim);

  const { 
    execute: createClaim, 
    isLoading: isCreating 
  } = useApi(claimsService.createClaim);

  // Convert raw claims to UI format
  useEffect(() => {
    if (rawClaims) {
      let filteredClaims = rawClaims;
      
      // Filter by status if specified
      if (status) {
        filteredClaims = rawClaims.filter(claim => claim.status === status);
      }
      
      // Filter by village if specified
      if (villageId) {
        filteredClaims = rawClaims.filter(claim => claim.villageId === villageId);
      }
      
      const converted = filteredClaims.map(convertFRAClaimToClaimRow);
      setUiClaims(converted);
    }
  }, [rawClaims, status, villageId]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchClaims();
    }
  }, [autoFetch, fetchClaims]);

  // Refresh claims data
  const refreshClaims = useCallback(() => {
    return fetchClaims();
  }, [fetchClaims]);

  // Verify a claim
  const handleVerifyClaim = useCallback(async (claimId: string) => {
    const result = await verifyClaim(claimId);
    if (result) {
      await refreshClaims(); // Refresh to get updated data
    }
    return result;
  }, [verifyClaim, refreshClaims]);

  // Approve a claim
  const handleApproveClaim = useCallback(async (claimId: string) => {
    const result = await approveClaim(claimId);
    if (result) {
      await refreshClaims(); // Refresh to get updated data
    }
    return result;
  }, [approveClaim, refreshClaims]);

  // Create a new claim
  const handleCreateClaim = useCallback(async (claimData: any) => {
    const result = await createClaim(claimData);
    if (result) {
      await refreshClaims(); // Refresh to get updated data
    }
    return result;
  }, [createClaim, refreshClaims]);

  return {
    // Data
    claims: uiClaims,
    rawClaims: rawClaims || [],
    
    // Loading states
    isLoading,
    isVerifying,
    isApproving,
    isCreating,
    
    // Error
    error,
    
    // Actions
    refreshClaims,
    verifyClaim: handleVerifyClaim,
    approveClaim: handleApproveClaim,
    createClaim: handleCreateClaim,
    
    // Utilities
    getClaimById: (id: string) => uiClaims.find(claim => claim.id === id),
    getClaimsByStatus: (status: ClaimRow['status']) => 
      uiClaims.filter(claim => claim.status === status),
  };
}
