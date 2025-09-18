import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';
import { geographicService, State, District, Village } from '@/lib/api';

export function useStates() {
  const { 
    data: states, 
    isLoading, 
    error, 
    execute: fetchStates 
  } = useApi(geographicService.states.getAll);

  useEffect(() => {
    fetchStates();
  }, [fetchStates]);

  return {
    states: states || [],
    isLoading,
    error,
    refreshStates: fetchStates,
  };
}

export function useDistricts(stateId?: string) {
  const { 
    data: districts, 
    isLoading, 
    error, 
    execute: fetchAllDistricts 
  } = useApi(geographicService.districts.getAll);

  const { 
    execute: fetchDistrictsByState 
  } = useApi(geographicService.districts.getByState);

  const [filteredDistricts, setFilteredDistricts] = useState<District[]>([]);

  // Fetch districts
  const fetchDistricts = useCallback(async () => {
    if (stateId) {
      const result = await fetchDistrictsByState(stateId);
      setFilteredDistricts(result || []);
    } else {
      const result = await fetchAllDistricts();
      setFilteredDistricts(result || []);
    }
  }, [stateId, fetchDistrictsByState, fetchAllDistricts]);

  useEffect(() => {
    fetchDistricts();
  }, [fetchDistricts]);

  // Filter districts by state if stateId changes
  useEffect(() => {
    if (districts && stateId) {
      const filtered = districts.filter(district => district.stateId === stateId);
      setFilteredDistricts(filtered);
    } else if (districts) {
      setFilteredDistricts(districts);
    }
  }, [districts, stateId]);

  return {
    districts: filteredDistricts,
    isLoading,
    error,
    refreshDistricts: fetchDistricts,
  };
}

export function useVillages(districtId?: string) {
  const { 
    data: villages, 
    isLoading, 
    error, 
    execute: fetchAllVillages 
  } = useApi(geographicService.villages.getAll);

  const { 
    execute: fetchVillagesByDistrict 
  } = useApi(geographicService.villages.getByDistrict);

  const [filteredVillages, setFilteredVillages] = useState<Village[]>([]);

  // Fetch villages
  const fetchVillages = useCallback(async () => {
    if (districtId) {
      const result = await fetchVillagesByDistrict(districtId);
      setFilteredVillages(result || []);
    } else {
      const result = await fetchAllVillages();
      setFilteredVillages(result || []);
    }
  }, [districtId, fetchVillagesByDistrict, fetchAllVillages]);

  useEffect(() => {
    fetchVillages();
  }, [fetchVillages]);

  // Filter villages by district if districtId changes
  useEffect(() => {
    if (villages && districtId) {
      const filtered = villages.filter(village => village.districtId === districtId);
      setFilteredVillages(filtered);
    } else if (villages) {
      setFilteredVillages(villages);
    }
  }, [villages, districtId]);

  return {
    villages: filteredVillages,
    isLoading,
    error,
    refreshVillages: fetchVillages,
  };
}

// Combined hook for geographic hierarchy
export function useGeographicHierarchy() {
  const { states, isLoading: isLoadingStates, error: statesError } = useStates();
  const [selectedStateId, setSelectedStateId] = useState<string>('');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('');
  
  const { 
    districts, 
    isLoading: isLoadingDistricts, 
    error: districtsError 
  } = useDistricts(selectedStateId);
  
  const { 
    villages, 
    isLoading: isLoadingVillages, 
    error: villagesError 
  } = useVillages(selectedDistrictId);

  // Reset dependent selections when parent changes
  useEffect(() => {
    setSelectedDistrictId('');
  }, [selectedStateId]);

  const isLoading = isLoadingStates || isLoadingDistricts || isLoadingVillages;
  const error = statesError || districtsError || villagesError;

  return {
    // Data
    states,
    districts,
    villages,
    
    // Selection state
    selectedStateId,
    selectedDistrictId,
    setSelectedStateId,
    setSelectedDistrictId,
    
    // Loading and error states
    isLoading,
    error,
    
    // Utilities
    getStateById: (id: string) => states.find(state => state.id === id),
    getDistrictById: (id: string) => districts.find(district => district.id === id),
    getVillageById: (id: string) => villages.find(village => village.id === id),
  };
}
