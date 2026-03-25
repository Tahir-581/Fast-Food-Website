import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  isOmniSearchOpen: boolean;
  setOmniSearchOpen: (open: boolean) => void;
  
  activeNotification: {
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
  } | null;
  showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
  hideNotification: () => void;
  
  theme: 'dark' | 'light' | 'system';
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  
  // High-fidelity interaction state
  isReducedMotion: boolean;
  setReducedMotion: (reduced: boolean) => void;

  isAuthOpen: boolean;
  setAuthOpen: (open: boolean) => void;
}


export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isOmniSearchOpen: false,
      setOmniSearchOpen: (open) => set({ isOmniSearchOpen: open }),
      
      activeNotification: null,
      showNotification: (type, message) => 
        set({ activeNotification: { id: Math.random().toString(), type, message } }),
      hideNotification: () => set({ activeNotification: null }),
      
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      
      isReducedMotion: false,
      setReducedMotion: (reduced) => set({ isReducedMotion: reduced }),

      isAuthOpen: false,
      setAuthOpen: (open) => set({ isAuthOpen: open }),
    }),

    {
      name: 'midnight-ember-ui',
      partialize: (state) => ({ theme: state.theme, isReducedMotion: state.isReducedMotion }),
    }
  )
);
