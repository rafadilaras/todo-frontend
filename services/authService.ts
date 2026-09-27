import { apiClient } from './api';
import { setAuthToken, removeAuthToken } from '@/lib/auth';
import type { BackendResponse, LoginResponseData } from '@/types/api';

export interface LoginInput {
  username: string;
  password: string;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export const authService = {
  /**
   * Melakukan login ke backend, lalu menyimpan JWT ke cookie
   */
  async login(payload: LoginInput): Promise<BackendResponse<LoginResponseData>> {
    const response = await apiClient<LoginResponseData>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (response.data?.token) {
      setAuthToken(response.data.token);
    }

    return response;
  },

  /**
   * Melakukan pendaftaran user baru ke backend
   */
  async register(payload: RegisterInput): Promise<BackendResponse<unknown>> {
    return apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Logout user: hapus token cookie dan redirect
   */
  logout(): void {
    removeAuthToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },
};
