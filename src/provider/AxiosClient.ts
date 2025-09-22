// src/provider/axiosClient.ts
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        const stored = localStorage.getItem("authToken");
        if (stored) {
            try {
                const tokens = JSON.parse(stored);
                if (tokens?.accessToken) {
                    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
                }
            } catch (err) {
                console.error("Failed to parse auth token", err);
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        console.log("Response from:", response.config.url, response.data);
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access (could trigger logout or refresh flow)
        }
        return Promise.reject(error);
    }
);
