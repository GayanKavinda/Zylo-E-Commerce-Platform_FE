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

    // ⏰ Last activity timestamp
    lastActivity: number | null;

    // Actions
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    updateActivity: () => void;
    logout: () => void;
}

const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            lastActivity: Date.now(),

            setUser: (user) => set({ user, lastActivity: Date.now() }),

            setToken: (token) => {
                set({ token, lastActivity: Date.now() });
            },

            updateActivity: () => {
                set({ lastActivity: Date.now() });
            },

            logout: () => {
                set({ user: null, token: null, lastActivity: null });
                // Clear persisted storage explicitly
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('auth-storage');
                    // Don't redirect here - let the component handle navigation
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ 
                token: state.token,
                user: state.user, // Also persist user data
                lastActivity: state.lastActivity 
            }), // Persist token, user, and last activity
        }
    )
);

// Auto-logout on inactivity (30 minutes = 1800000ms)
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

if (typeof window !== 'undefined') {
    // Check for inactivity on app load
    const checkInactivity = () => {
        const state = useAuthStore.getState();
        if (state.token && state.lastActivity) {
            const timeSinceLastActivity = Date.now() - state.lastActivity;
            console.log('⏰ Activity Check:', {
                timeSinceLastActivity: Math.floor(timeSinceLastActivity / 1000) + 's',
                timeout: Math.floor(INACTIVITY_TIMEOUT / 1000) + 's',
                willLogout: timeSinceLastActivity > INACTIVITY_TIMEOUT
            });
            if (timeSinceLastActivity > INACTIVITY_TIMEOUT) {
                console.log('🚪 Auto-logout: Session expired due to inactivity');
                state.logout();
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login?expired=true';
                }
            }
        }
    };

    // Check on load - ADD DELAY to let everything load first
    // Only run once - prevent HMR from triggering multiple checks
    if (!(window as any).__authStoreInitialized) {
        (window as any).__authStoreInitialized = true;
        setTimeout(() => {
            console.log('🔍 Checking session on load...');
            checkInactivity();
        }, 1000);
    }

    // Activity events that should reset the timer
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
        const state = useAuthStore.getState();
        if (state.token) {
            state.updateActivity();
        }
    };

    // Add event listeners
    activityEvents.forEach(event => {
        window.addEventListener(event, handleActivity, { passive: true });
    });

    // Check every minute if user is still active
    setInterval(checkInactivity, 60 * 1000);
}

export default useAuthStore;