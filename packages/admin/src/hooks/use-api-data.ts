import { useCallback, useEffect, useState } from 'react';

export interface UseApiDataResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Generic hook for fetching data with loading/error state management.
 *
 * @param fetcher - Async function that returns the data
 * @param deps - Optional dependency array for refetching
 * @returns Object with data, isLoading, error, and refetch function
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useApiData(
 *   () => apiClient.get('/pages'),
 *   []
 * );
 * ```
 */
export function useApiData<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = []
): UseApiDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: fetcher is intentionally excluded to avoid recreation on every render
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetcher()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [...deps, fetchTrigger]);

  const refetch = useCallback(() => {
    setFetchTrigger((prev) => prev + 1);
  }, []);

  return { data, isLoading, error, refetch };
}
