import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useApiData } from '../use-api-data';

describe('useApiData', () => {
  it('should fetch data successfully', async () => {
    const mockData = { id: '1', name: 'Test' };
    const fetcher = vi.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() => useApiData(fetcher));

    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('should handle errors', async () => {
    const mockError = new Error('Fetch failed');
    const fetcher = vi.fn().mockRejectedValue(mockError);

    const { result } = renderHook(() => useApiData(fetcher));

    // Wait for error
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toEqual(mockError);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('should handle non-Error objects', async () => {
    const fetcher = vi.fn().mockRejectedValue('String error');

    const { result } = renderHook(() => useApiData(fetcher));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('String error');
  });

  it('should refetch data when refetch is called', async () => {
    const mockData = { id: '1', name: 'Test' };
    const fetcher = vi.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() => useApiData(fetcher));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(fetcher).toHaveBeenCalledTimes(1);

    // Call refetch
    act(() => {
      result.current.refetch();
    });

    // isLoading becomes true after React processes the state update
    await waitFor(() => {
      expect(fetcher).toHaveBeenCalledTimes(2);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('should refetch when dependencies change', async () => {
    const mockData = { id: '1', name: 'Test' };
    const fetcher = vi.fn().mockResolvedValue(mockData);

    const { result, rerender } = renderHook(
      ({ dep }: { dep: number }) => useApiData(fetcher, [dep]),
      { initialProps: { dep: 1 } }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(fetcher).toHaveBeenCalledTimes(1);

    // Change dependency
    rerender({ dep: 2 });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('should not refetch when dependencies stay the same', async () => {
    const mockData = { id: '1', name: 'Test' };
    const fetcher = vi.fn().mockResolvedValue(mockData);

    const { result, rerender } = renderHook(
      ({ dep }: { dep: number }) => useApiData(fetcher, [dep]),
      { initialProps: { dep: 1 } }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(fetcher).toHaveBeenCalledTimes(1);

    // Rerender with same dependency
    rerender({ dep: 1 });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should not refetch
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
