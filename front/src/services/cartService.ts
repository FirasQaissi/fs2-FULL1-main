import type { Product } from '../types/product';

export interface CartItem extends Product {
  quantity: number;
}

const CART_KEY = 'shopping_cart';

export const cartService = {
  getCart(): CartItem[] {
    try {
      const cart = localStorage.getItem(CART_KEY);
      return cart ? JSON.parse(cart) : [];
    } catch {
      return [];
    }
  },

  addToCart(product: Product, quantity: number = 1): CartItem[] {
    const cart = this.getCart();
    const productId = product.id || product._id;
    const existingItem = cart.find(item => (item.id || item._id) === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    
    this.saveCart(cart);
    return cart;
  },

  removeFromCart(productId: string): CartItem[] {
    const cart = this.getCart();
    const updatedCart = cart.filter(item => (item.id || item._id) !== productId);
    this.saveCart(updatedCart);
    return updatedCart;
  },

  updateQuantity(productId: string, quantity: number): CartItem[] {
    const cart = this.getCart();
    const item = cart.find(item => (item.id || item._id) === productId);
    
    if (item) {
      if (quantity <= 0) {
        return this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
      }
    }
    
    this.saveCart(cart);
    return cart;
  },

  clearCart(): void {
    localStorage.removeItem(CART_KEY);
  },

  getCartCount(): number {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  },

  getCartTotal(): number {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  saveCart(cart: CartItem[]): void {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      // Emit custom event to notify components about cart updates
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
  },
};
