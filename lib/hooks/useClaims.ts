import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';
import { claimsService, FRAClaim, ClaimStatus, UserRole } from '@/lib/api';
import { convertFRAClaimToClaimRow } from '@/lib/utils/claim-helpers';
import type { ClaimRow } from '@/components/ui/verification/shared/types';
import { useAuth } from '@/contexts/auth-context';

interface UseClaimsOptions {
  autoFetch?: boolean;
  status?: ClaimStatus;
  villageId?: string;
}

export function useClaims(options: UseClaimsOptions = {}) {
  const { autoFetch = true, status, villageId } = options;
  const { user } = useAuth();
  
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
    execute: forwardClaim, 
    isLoading: isForwarding 
  } = useApi(claimsService.forwardClaim);

  const { 
    execute: approveClaim, 
    isLoading: isApproving 
  } = useApi(claimsService.approveClaim);

  const { 
    execute: rejectClaim, 
    isLoading: isRejecting 
  } = useApi(claimsService.rejectClaim);

  const { 
    execute: createClaim, 
    isLoading: isCreating 
  } = useApi(claimsService.createClaim);

  // Convert raw claims to UI format
  useEffect(() => {
    if (rawClaims) {
      let filteredClaims = rawClaims;
      
      // Filter by village if specified
      if (villageId) {
        filteredClaims = rawClaims.filter(claim => claim.villageId === villageId);
      }
      
      const converted = filteredClaims.map(claim => convertFRAClaimToClaimRow(claim, user?.role));
      setUiClaims(converted);
    }
  }, [rawClaims, status, villageId, user]);

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

  // Forward a claim
  const handleForwardClaim = useCallback(async (claimId: string, remarks: string) => {
    const result = await forwardClaim(claimId, remarks);
    if (result) {
      await refreshClaims();
    }
    return result;
  }, [forwardClaim, refreshClaims]);

  // Approve a claim
  const handleApproveClaim = useCallback(async (claimId: string) => {
    const result = await approveClaim(claimId);
    if (result) {
      await refreshClaims(); // Refresh to get updated data
    }
    return result;
  }, [approveClaim, refreshClaims]);

  // Reject a claim
  const handleRejectClaim = useCallback(async (claimId: string, reason: string) => {
    const result = await rejectClaim(claimId, reason);
    if (result) {
      await refreshClaims();
    }
    return result;
  }, [rejectClaim, refreshClaims]);

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
    isForwarding,
    isApproving,
    isCreating,
    isRejecting,
    
    // Error
    error,
    
    // Actions
    refreshClaims,
    verifyClaim: handleVerifyClaim,
    forwardClaim: handleForwardClaim,
    approveClaim: handleApproveClaim,
    rejectClaim: handleRejectClaim,
    createClaim: handleCreateClaim,
    
    // Utilities
    getClaimById: (id: string) => uiClaims.find(claim => claim.id === id),
    getClaimsByStatus: (status: ClaimRow['status']) => 
      uiClaims.filter(claim => claim.status === status),
  };
}
