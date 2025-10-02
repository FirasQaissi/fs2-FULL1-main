import { http, API_BASE } from './http';

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  ordersToday: number;
  recentUsers: number;
  adminUsers: number;
  businessUsers: number;
}

const ADMIN_BASE = `${API_BASE}/api/admin`;

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    try {
      const response = await http<DashboardStats>(`${ADMIN_BASE}/stats`);
      return response;
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      // Return mock data as fallback
      return {
        totalUsers: Math.floor(Math.random() * 500) + 100,
        totalProducts: Math.floor(Math.random() * 20) + 10,
        ordersToday: Math.floor(Math.random() * 11) + 5, // 5-15 as requested
        recentUsers: Math.floor(Math.random() * 50) + 10,
        adminUsers: Math.floor(Math.random() * 5) + 1,
        businessUsers: Math.floor(Math.random() * 25) + 5,
      };
    }
  },
};
