import { useState, useCallback } from "react";

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>,
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const result = await apiFunction(...args);

        setState({
          data: result,
          isLoading: false,
          error: null,
        });

        return result;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || error.message || "An error occurred";

        setState({
          data: null,
          isLoading: false,
          error: errorMessage,
        });

        return null;
      }
    },
    [apiFunction],
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Specialized hook for paginated data
export function usePaginatedApi<T>(
  apiFunction: (
    page: number,
    limit: number,
    ...args: any[]
  ) => Promise<{ data: T[]; total: number; page: number; limit: number }>,
) {
  const [state, setState] = useState({
    data: [] as T[],
    total: 0,
    page: 1,
    limit: 10,
    isLoading: false,
    error: null as string | null,
  });

  const fetchData = useCallback(
    async (page: number = 1, limit: number = 10, ...args: any[]) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const result = await apiFunction(page, limit, ...args);

        setState({
          data: result.data,
          total: result.total,
          page: result.page,
          limit: result.limit,
          isLoading: false,
          error: null,
        });

        return result;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || error.message || "An error occurred";

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));

        return null;
      }
    },
    [apiFunction],
  );

  const reset = useCallback(() => {
    setState({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    fetchData,
    reset,
  };
}
