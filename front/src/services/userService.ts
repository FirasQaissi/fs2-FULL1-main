import { http, API_BASE } from './http';
import type { User } from '../types/auth';

const USER_BASE = `${API_BASE}/api/user`;

export const userService = {
  async getProfile(): Promise<{ user: User }> {
    return http<{ user: User }>(`${USER_BASE}/profile`);
  },

  async updateProfile(data: { name?: string; email?: string; phone?: string }): Promise<{ user: User }> {
    return http<{ user: User }>(`${USER_BASE}/profile`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
    return http<{ message: string }>(`${USER_BASE}/change-password`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};
