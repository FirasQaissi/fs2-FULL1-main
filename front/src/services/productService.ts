import type { Product, ProductCreateRequest, ProductUpdateRequest } from '../types/product';
import { http, API_BASE } from './http';

export const productService = {
  // Get all products (public endpoint - no auth required)
  getAllProducts: async (): Promise<Product[]> => {
    const response = await http<Product[]>(`${API_BASE}/api/products`);
    return response;
  },

  // Get single product by ID (public endpoint - no auth required)
  getProductById: async (id: string): Promise<Product> => {
    const response = await http<Product>(`${API_BASE}/api/products/${id}`);
    return response;
  },

  // Create new product (admin only - requires auth)
  createProduct: async (productData: ProductCreateRequest): Promise<Product> => {
    const response = await http<Product>(`${API_BASE}/api/products`, {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    return response;
  },

  // Update product (admin only - requires auth)
  updateProduct: async (id: string, productData: ProductUpdateRequest): Promise<Product> => {
    const response = await http<Product>(`${API_BASE}/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
    return response;
  },
  

  // Delete product (admin only - requires auth)
  deleteProduct: async (id: string): Promise<void> => {
    await http(`${API_BASE}/api/products/${id}`, {
      method: 'DELETE',
    });
  }
};
