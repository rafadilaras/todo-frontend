import { getAuthToken, removeAuthToken } from '@/lib/auth';
import type { BackendResponse } from '@/types/api';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class ApiError extends Error {
  status: number;
  statusText: string;
  requestId?: string | null;
  serverMessage?: string;

  constructor(message: string, status: number, statusText: string, requestId?: string | null, serverMessage?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.requestId = requestId;
    this.serverMessage = serverMessage;
  }
}

/**
 * HTTP Client Interceptor (Middleware FE)
 * Mengelola Request Header (JWT, Content-Type), Response Tracing (X-Request-Id), dan Error Interception (401 Redirect).
 */
export async function apiClient<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<BackendResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // 1. [Request Interceptor] Siapkan default headers & inject JWT token jika ada
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getAuthToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // 2. [Response Interceptor] Tangkap X-Request-Id untuk tracing
    const requestId = response.headers.get('x-request-id');
    if (requestId && process.env.NODE_ENV !== 'production') {
      console.log(`[FE HTTP Interceptor] ${options.method || 'GET'} ${endpoint} -> Request ID: ${requestId}`);
    }

    const jsonResult: BackendResponse<T> = await response.json().catch(() => ({
      success: response.ok,
      message: response.statusText,
      meta: { timestamp: new Date().toISOString() },
    }));

    // 3. [Error Interceptor] Tangkap 401 Unauthorized -> Hapus cookie & redirect
    if (response.status === 401) {
      removeAuthToken();
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login?session_expired=true';
      }
      throw new ApiError(
        jsonResult.message || 'Sesi telah berakhir, silakan login kembali.',
        response.status,
        response.statusText,
        requestId,
        jsonResult.message
      );
    }

    if (!response.ok || jsonResult.success === false) {
      throw new ApiError(
        jsonResult.message || `Gagal memuat data (${response.status})`,
        response.status,
        response.statusText,
        requestId,
        jsonResult.message
      );
    }

    return jsonResult;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(
      `Network Error: Tidak dapat terhubung ke server API (${(error as Error).message})`
    );
  }
}
