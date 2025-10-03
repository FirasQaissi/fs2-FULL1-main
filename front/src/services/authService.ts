import { http, API_BASE } from './http';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types/auth';

const AUTH_BASE = `${API_BASE}/api/auth`;

export const authService = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    return http<LoginResponse>(`${AUTH_BASE}/login`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  async register(payload: RegisterRequest): Promise<RegisterResponse> {
    return http<RegisterResponse>(`${AUTH_BASE}/register`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  async logout(): Promise<{ ok: boolean }> {
    return http<{ ok: boolean }>(`${AUTH_BASE}/logout`, {
      method: 'POST',
    });
  },
  async refresh(): Promise<{ token: string }> {
    const token = localStorage.getItem('token');
    return http<{ token: string }>(`${AUTH_BASE}/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    return http<{ success: boolean; message: string }>(`${AUTH_BASE}/forgot-password`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return http<{ success: boolean; message: string }>(`${AUTH_BASE}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  },
};


