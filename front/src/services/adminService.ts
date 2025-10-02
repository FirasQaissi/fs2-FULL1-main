import { http, API_BASE } from './http';
import type { User } from '../types/auth';

const ADMIN_BASE = `${API_BASE}/api/admin`;

export type AdminUser = User & { 
  createdAt?: string;
  lastLogin?: string;
  isOnline?: boolean;
};

export const adminService = {
  async listUsers(): Promise<AdminUser[]> {
    return http<AdminUser[]>(`${ADMIN_BASE}/users`);
  },
  async deleteUser(id: string): Promise<{ message: string }> {
    return http<{ message: string }>(`${ADMIN_BASE}/users/${id}`, { method: 'DELETE' });
  },
  async updateUser(id: string, payload: Partial<Pick<AdminUser, 'name' | 'email' | 'phone' | 'isAdmin' | 'isBusiness' | 'isUser'>>): Promise<AdminUser> {
    return http<AdminUser>(`${ADMIN_BASE}/users/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  },
  async createUser(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    isAdmin?: boolean;
    isBusiness?: boolean;
    isUser?: boolean;
  }): Promise<AdminUser> {
    return http<AdminUser>(`${ADMIN_BASE}/users`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async promoteToBusinessAccount(id: string): Promise<AdminUser> {
    return http<AdminUser>(`${ADMIN_BASE}/users/${id}/promote-business`, {
      method: 'PATCH',
    });
  },
  async assignTempAdminPrivileges(id: string, duration: '1day' | '1week' | '1month'): Promise<AdminUser> {
    return http<AdminUser>(`${ADMIN_BASE}/users/${id}/temp-admin`, {
      method: 'PATCH',
      body: JSON.stringify({ duration }),
    });
  },
};


