import axios, { isAxiosError } from 'axios';

type Tokens = {
    accessToken: string;
    refreshToken?: string;
};

const rawBaseUrl: unknown = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = typeof rawBaseUrl === 'string' ? rawBaseUrl : undefined;
const isDev: boolean = import.meta.env.DEV;
const AUTH_STORAGE_KEY = 'autocar_auth';

const log = (...args: unknown[]) => {
    if (isDev) console.log(...args);
};

export const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

const isTokens = (value: unknown): value is Tokens => {
    return (
        !!value &&
        typeof value === 'object' &&
        typeof (value as Record<string, unknown>).accessToken === 'string' &&
        (typeof (value as Record<string, unknown>).refreshToken === 'string' ||
            (value as Record<string, unknown>).refreshToken === undefined)
    );
};

const parseTokens = (stored: string): Tokens | null => {
    try {
        const parsed = JSON.parse(stored) as unknown;
        if (isTokens(parsed)) {
            return {
                accessToken: parsed.accessToken,
                refreshToken: parsed.refreshToken,
            };
        }
    } catch (err) {
        if (isDev) console.error('Failed to parse auth token', err);
    }
    return null;
};

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        const tokens = stored ? parseTokens(stored) : null;

        if (tokens?.accessToken) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${tokens.accessToken}`;
            log('🔑 Auth token added to request');
        }

        log('📤 Outgoing Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
        });

        return config;
    },
    (error: unknown) => {
        if (isDev) console.error('❌ Request interceptor error:', error);
        return Promise.reject(error instanceof Error ? error : new Error(String(error)));
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        log('✅ Response Success:', {
            url: response.config.url,
            status: response.status,
        });
        return response;
    },
    (error: unknown) => {
        if (isDev) {
            if (isAxiosError(error)) {
                const responseData = error.response?.data as unknown;
                console.error('❌ Response Error:', {
                    url: error.config?.url,
                    status: error.response?.status,
                    data: responseData,
                    message: error.message,
                });
            } else {
                console.error('❌ Response Error (non-axios):', error);
            }
        }

        if (isAxiosError(error) && error.response?.status === 401) {
            log('🔐 Unauthorized - clearing auth data');
            localStorage.removeItem(AUTH_STORAGE_KEY);
            window.dispatchEvent(new Event('unauthorized'));
        }

        if (isAxiosError(error)) {
            return Promise.reject(error);
        }

        return Promise.reject(error instanceof Error ? error : new Error(String(error)));
    }
);
