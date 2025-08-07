import { useState, useEffect, useCallback } from 'react';
import { apiRequest, ApiError } from '@/lib/utils';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}

export function useApi<T = any>(
  endpoint: string,
  options: RequestInit = {},
  apiOptions: UseApiOptions = {}
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: apiOptions.immediate !== false,
    error: null,
  });

  const execute = useCallback(
    async (overrideOptions?: RequestInit) => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const data = await apiRequest<T>(endpoint, { ...options, ...overrideOptions });
        setState({ data, loading: false, error: null });
        apiOptions.onSuccess?.(data);
        return data;
      } catch (error) {
        const errorMessage = error instanceof ApiError ? error.message : 'Unknown error';
        setState(prev => ({ ...prev, loading: false, error: errorMessage }));
        if (error instanceof ApiError) {
          apiOptions.onError?.(error);
        }
        throw error;
      }
    },
    [endpoint, options, apiOptions]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  useEffect(() => {
    if (apiOptions.immediate !== false) {
      execute();
    }
  }, [execute, apiOptions.immediate]);

  return {
    ...state,
    execute,
    reset,
    isSuccess: state.data !== null && !state.loading && !state.error,
    isError: state.error !== null,
  };
}

// Hook for mutations (POST, PUT, DELETE)
export function useMutation<T = any, V = any>(
  endpoint: string,
  options: RequestInit = {},
  mutationOptions: UseApiOptions = {}
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(
    async (variables?: V, overrideOptions?: RequestInit) => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const body = variables ? JSON.stringify(variables) : options.body;
        const data = await apiRequest<T>(endpoint, {
          method: 'POST',
          ...options,
          ...overrideOptions,
          body,
        });

        setState({ data, loading: false, error: null });
        mutationOptions.onSuccess?.(data);
        return data;
      } catch (error) {
        const errorMessage = error instanceof ApiError ? error.message : 'Unknown error';
        setState(prev => ({ ...prev, loading: false, error: errorMessage }));
        if (error instanceof ApiError) {
          mutationOptions.onError?.(error);
        }
        throw error;
      }
    },
    [endpoint, options, mutationOptions]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    mutate,
    reset,
    isSuccess: state.data !== null && !state.loading && !state.error,
    isError: state.error !== null,
  };
}