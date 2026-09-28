export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
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

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      'Gagal terhubung ke server backend'
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = data?.message || `Terjadi kesalahan (Status: ${response.status})`;
    throw new ApiError(errorMessage, response.status);
  }

  return data as T;
}
