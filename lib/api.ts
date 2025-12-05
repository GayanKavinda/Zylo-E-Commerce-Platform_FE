//lib/api.ts

import axios from "axios";
import useAuthStore from './authStore';

const api = axios.create({
    baseURL: "http://localhost:8000/api",
    timeout: 10000, // 10 second timeout
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
        console.error('❌ API Error:', error.config?.url, error.response?.status, error.response?.data || error.message);
        
        // Handle 401 Unauthorized - token expired or invalid
        if (error.response?.status === 401) {
            console.warn('🔒 Unauthorized - clearing auth and redirecting to login');
            useAuthStore.getState().logout();
        }
        
        return Promise.reject(error);
    }
);

export default api;