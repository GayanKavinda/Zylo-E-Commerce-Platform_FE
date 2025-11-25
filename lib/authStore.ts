//lib/authStore.ts

import { create } from "zustand";
import api from "./api";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    setUser: (user:User) => void;
    setToken: (token: string) => void;
    loadUser: () => Promise<void>;
    logout: () => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,

    setUser: (user) => set({ user }),

    setToken: (token) => {
        if (typeof window !== 'undefined') localStorage.setItem('token', token);
        set({ token });
    },

    loadUser: async () => {
        const token = get().token;
        if (!token) return;

        try {
            const res = await api.get('/user');
            set({ user: res.data.user });
        } catch (err) {
            console.error('Auto-login failed', err);
            set({ user: null, token: null });
        }
        console.log('[auth] loadUser start', token)
    },

    logout: () => {
        if (typeof window !== 'undefined') localStorage.removeItem('token');
        set({ user: null, token: null });
        window.location.href = '/login';
    },
}));


export default useAuthStore;