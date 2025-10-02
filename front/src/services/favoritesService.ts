import { http, API_BASE } from './http';
import type { Product } from '../types/product';

const FAVORITES_BASE = `${API_BASE}/api/favorites`;

export const favoritesService = {
  async getFavorites(): Promise<{ favorites: Product[] }> {
    return http<{ favorites: Product[] }>(`${FAVORITES_BASE}`);
  },

  async addToFavorites(productId: string): Promise<{ favorites: string[] }> {
    return http<{ favorites: string[] }>(`${FAVORITES_BASE}`, {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  },

  async removeFromFavorites(productId: string): Promise<{ favorites: string[] }> {
    return http<{ favorites: string[] }>(`${FAVORITES_BASE}/${productId}`, {
      method: 'DELETE',
    });
  },

  async isFavorite(productId: string): Promise<{ isFavorite: boolean }> {
    return http<{ isFavorite: boolean }>(`${FAVORITES_BASE}/${productId}/check`);
  },
};
