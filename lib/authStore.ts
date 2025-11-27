// lib/authStore.ts
// ✅ CLIENT STATE ONLY - UI state like token, theme, modals, etc.
// ⚠️ For SERVER STATE (user data from API), use TanStack Query hooks in lib/hooks/useAuth.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface AuthState {
    // 🔑 Client state: Auth token (persisted locally)
    token: string | null;
    
    // 👤 Temporary user cache (sync with TanStack Query)
    user: User | null;

    // Actions
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    logout: () => void;
}

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,

            setUser: (user) => set({ user }),

            setToken: (token) => {
                set({ token });
            },

            logout: () => {
                set({ user: null, token: null });
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ token: state.token }), // Only persist token
        }
    )
);

export default useAuthStore;