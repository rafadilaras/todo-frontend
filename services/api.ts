/**
 * services/api.ts
 * 
 * Layer 1: Connection & Base HTTP Client.
 * 
 * Tujuan Pembelajaran:
 * 1. Mengisolasi konfigurasi koneksi jaringan (Base URL, Headers, Error Handling) di satu tempat.
 * 2. Menyediakan fungsi wrapper generic `apiClient<T>()` agar pemanggilan API konsisten & reusable.
 */

// Base URL ke endpoint REST API DummyJSON
export const API_BASE_URL = 'https://dummyjson.com';

export class ApiError extends Error {
  status: number;
  statusText: string;

  constructor(message: string, status: number, statusText: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
  }
}

/**
 * Reusable generic fetch client
 * @param endpoint Path endpoint, contoh: '/todos' atau '/todos/1'
 * @param options Konfigurasi standar RequestInit (method, headers, body, dsb)
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      // Next.js caching strategy (opsional: revalidate setiap 60 detik atau no-store untuk live)
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new ApiError(
        `HTTP Error: Gagal memuat data dari ${endpoint} (${response.status} ${response.statusText})`,
        response.status,
        response.statusText
      );
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network error atau parsing error
    throw new Error(
      `Network Error: Tidak dapat terhubung ke server API (${(error as Error).message})`
    );
  }
}
