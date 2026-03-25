import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './mockData';

interface Customization {
  id: string;
  name: string;
  price: number;
}

interface CartItem extends Omit<Product, 'basePrice'> {
  id: string;
  name: string;
  basePrice: number;
  quantity: number;
  customizationId?: string;
  customizations?: Customization[];
}

interface ShopState {
  cart: CartItem[];
  isCartOpen: boolean;
  categories: any[];
  selectedDrawerProduct: any | null;
  isLoading: boolean;
  error: string | null;
  syncLoading: boolean;
  
  addItem: (product: any, quantity?: number, customizations?: Customization[]) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  setIsCartOpen: (isOpen: boolean) => void;
  setSelectedDrawerProduct: (product: any | null) => void;
  syncWithServer: () => Promise<void>;
  fetchMenu: () => Promise<void>;
  logout: () => void;
}

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      cart: [],
      isCartOpen: false,
      categories: [],
      selectedDrawerProduct: null,
      isLoading: false,
      error: null,
      syncLoading: false,

      syncWithServer: async () => {
        const { cart } = get();
        // Skip if cart is empty for now or if we want to sync empty state
        set({ syncLoading: true });
        try {
          await fetch('/api/cart', {
            method: 'POST',
            body: JSON.stringify({ items: cart }),
          });
        } catch (err) {
          console.error("Cart sync failed");
        } finally {
          set({ syncLoading: false });
        }
      },

      addItem: (product, quantity = 1, customizations = []) => {
        const { cart, syncWithServer } = get();
        
        const customizationKey = customizations.map(c => c.id).sort().join('-');
        const itemUniqueId = `${product.id}-${customizationKey}`;

        const existingItem = cart.find((item: any) => 
          item.id === product.id && 
          item.customizationId === itemUniqueId
        );

        if (existingItem) {
          set({
            cart: cart.map((item: any) =>
              item.customizationId === itemUniqueId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ 
            cart: [
              ...cart, 
              { 
                ...product, 
                customizationId: itemUniqueId,
                quantity, 
                customizations,
                basePrice: product.basePrice || product.price || 10
              }
            ] 
          });
        }
        set({ isCartOpen: true });
        syncWithServer();
      },

      removeItem: (itemId) => {
        const { syncWithServer } = get();
        set({ cart: get().cart.filter((item: any) => (item.customizationId || item.id) !== itemId) });
        syncWithServer();
      },

      updateQuantity: (itemId, quantity) => {
        const { syncWithServer } = get();
        if (quantity < 1) {
          get().removeItem(itemId);
          return;
        }
        set({
          cart: get().cart.map((item: any) =>
            (item.customizationId || item.id) === itemId ? { ...item, quantity } : item
          ),
        });
        syncWithServer();
      },

      clearCart: () => set({ cart: [] }),

      getTotalItems: () => get().cart.reduce((total, item) => total + item.quantity, 0),

      getTotalPrice: () =>
        get().cart.reduce((total, item) => {
          const modPrice = (item.customizations || []).reduce((sum, mod) => sum + mod.price, 0);
          const base = item.basePrice || item.price || 0;
          return total + (base + modPrice) * item.quantity;
        }, 0),

      setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),

      setSelectedDrawerProduct: (product) => set({ selectedDrawerProduct: product }),

      logout: () => set({ cart: [] }),

      fetchMenu: async () => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch('/api/menu');
          const data = await res.json();
          if (!res.ok) throw new Error('Failed to fetch menu');
          set({ categories: data });
        } catch (err: any) {
          set({ error: err.message });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'midnight-ember-storage',
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);
