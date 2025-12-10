//lib/api.ts

import axios from "axios";
import useAuthStore from './authStore';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
    timeout: 30000, // 30 second timeout (increased for development)
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

api.interceptors.request.use((config) => {
        const token = useAuthStore.getState().token;
        if(token)
            config.headers['Authorization'] = `Bearer ${token}`;
        return config;
});

// Response interceptor with better error handling
api.interceptors.response.use(
    (response) => {
        console.log('✅ API Response:', response.config.url, response.status);
        return response;
    },
    (error) => {
        // Better error logging
        if (error.code === 'ECONNABORTED') {
            console.error('❌ API Timeout:', error.config?.url, 'Request took too long');
        } else if (error.code === 'ERR_NETWORK') {
            console.error('❌ Network Error:', error.config?.url, 'Cannot connect to backend. Is Laravel server running?');
            console.error('💡 Run: cd backend && php artisan serve');
        } else {
            console.error('❌ API Error:', error.config?.url, error.response?.status, error.response?.data || error.message);
        }
        
        // Handle 401 Unauthorized - token expired or invalid
        // DON'T auto-logout here - let the component handle it
        // Auto-logout can cause issues on page refresh
        if (error.response?.status === 401) {
            console.warn('🔒 Unauthorized - 401 error received from:', error.config?.url);
            // Only logout if it's a critical endpoint (like /user)
            // For other endpoints, just let the error propagate
            const url = error.config?.url;
            if (url && (url.includes('/logout') || url.includes('/user/me') || url === '/user')) {
                // These endpoints failing means token is truly invalid
                console.warn('🔒 Critical endpoint failed - token invalid, logging out');
                console.warn('🔍 Logout triggered by api.ts interceptor for URL:', url);
                useAuthStore.getState().logout();
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;