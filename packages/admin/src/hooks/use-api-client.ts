'use client';

import { useAdmin } from './use-admin';

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

/**
 * API error structure
 */
export interface ApiError {
  message: string;
  code?: string;
  status: number;
}

/**
 * API client interface for making requests to the CMS API
 */
export interface ApiClient {
  get<T>(path: string): Promise<ApiResponse<T>>;
  post<T>(path: string, body: unknown): Promise<ApiResponse<T>>;
  put<T>(path: string, body: unknown): Promise<ApiResponse<T>>;
  delete<T>(path: string): Promise<ApiResponse<T>>;
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    let errorCode: string | undefined;

    try {
      const errorBody = (await response.json()) as {
        error?: { message?: string; code?: string };
      };
      if (errorBody.error?.message) {
        errorMessage = errorBody.error.message;
      }
      if (errorBody.error?.code) {
        errorCode = errorBody.error.code;
      }
    } catch {
      errorMessage = response.statusText || errorMessage;
    }

    return {
      data: null,
      error: {
        message: errorMessage,
        code: errorCode,
        status: response.status,
      },
    };
  }

  try {
    const data = (await response.json()) as T;
    return { data, error: null };
  } catch {
    return { data: null as T, error: null };
  }
}

function createApiClient(baseUrl: string): ApiClient {
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  return {
    async get<T>(path: string): Promise<ApiResponse<T>> {
      const response = await fetch(`${normalizedBaseUrl}${path}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return handleResponse<T>(response);
    },

    async post<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
      const response = await fetch(`${normalizedBaseUrl}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      return handleResponse<T>(response);
    },

    async put<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
      const response = await fetch(`${normalizedBaseUrl}${path}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      return handleResponse<T>(response);
    },

    async delete<T>(path: string): Promise<ApiResponse<T>> {
      const response = await fetch(`${normalizedBaseUrl}${path}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return handleResponse<T>(response);
    },
  };
}

/**
 * Hook to get an API client configured with the base URL from AdminProvider.
 * Must be used within an AdminProvider.
 *
 * @returns An API client with get, post, put, delete methods
 *
 * @example
 * ```tsx
 * function PageList() {
 *   const api = useApiClient();
 *
 *   async function loadPages() {
 *     const { data, error } = await api.get<Page[]>('/pages');
 *     if (error) {
 *       console.error(error.message);
 *       return;
 *     }
 *     setPages(data);
 *   }
 * }
 * ```
 */
export function useApiClient(): ApiClient {
  const { apiBaseUrl } = useAdmin();
  return createApiClient(apiBaseUrl);
}
