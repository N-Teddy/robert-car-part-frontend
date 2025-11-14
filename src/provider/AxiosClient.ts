import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Debug info
console.log('🚀 Electron App Starting...');
console.log('🌐 API Base URL:', BASE_URL);
console.log('🔧 Environment:', import.meta.env.MODE);
console.log('💻 User Agent:', navigator.userAgent);

export const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 1000000, // Slightly longer timeout for desktop
    headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AutoCar-Desktop/1.0.0', // Identify as desktop app
        'Origin': 'https://robert-car-part-backend.vercel.app'
    },
});

// Enhanced request interceptor with better debugging
apiClient.interceptors.request.use(
    (config) => {
        const stored = localStorage.getItem('authToken');

        if (stored) {
            try {
                const tokens = JSON.parse(stored);
                if (tokens?.accessToken) {
                    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
                    console.log('🔑 Auth token added to request');
                }
            } catch (err) {
                console.error('Failed to parse auth token', err);
            }
        }

        console.log('📤 Outgoing Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            headers: config.headers
        });

        return config;
    },
    (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Enhanced response interceptor
apiClient.interceptors.response.use(
    (response) => {
        console.log('✅ Response Success:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('❌ Response Error:', {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });

        if (error.response?.status === 401) {
            console.log('🔐 Unauthorized - clearing auth data');
            localStorage.removeItem('authToken');
            // You can dispatch an event or redirect to login
            window.dispatchEvent(new Event('unauthorized'));
        }

        return Promise.reject(error);
    }
);