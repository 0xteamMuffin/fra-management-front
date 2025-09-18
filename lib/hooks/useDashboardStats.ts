"use client";

import { useApi } from "./useApi";
import { claimsService } from "@/lib/api";

export function useDashboardStats() {
  const {
    data: stats,
    isLoading: isLoadingStats,
    error: statsError,
    execute: fetchStats,
  } = useApi(claimsService.getDashboardStats);

  return {
    stats,
    isLoadingStats,
    statsError,
    fetchStats,
  };
}
