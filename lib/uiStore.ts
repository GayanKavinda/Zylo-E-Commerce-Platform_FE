// lib/uiStore.ts
// ✅ CLIENT/UI STATE ONLY - Modals, themes, filters, etc.

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Modals
  isProductModalOpen: boolean;
  setProductModalOpen: (open: boolean) => void;
  
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;

  // Filters
  productFilter: string;
  setProductFilter: (filter: string) => void;

  // Sidebar
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Theme
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),

      // Modals
      isProductModalOpen: false,
      setProductModalOpen: (open) => set({ isProductModalOpen: open }),
      
      isCartOpen: false,
      setCartOpen: (open) => set({ isCartOpen: open }),

      // Filters (not persisted, session only)
      productFilter: '',
      setProductFilter: (filter) => set({ productFilter: filter }),

      // Sidebar
      isSidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ 
        isSidebarCollapsed: !state.isSidebarCollapsed 
      })),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ 
        theme: state.theme,
        isSidebarCollapsed: state.isSidebarCollapsed 
      }), // Only persist theme and sidebar state
    }
  )
);

export default useUIStore;
