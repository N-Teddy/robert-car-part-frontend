// src/services/authApi.ts
import { apiClient } from '../provider/AxiosClient';
import type {
    ChangePasswordRequest,
    ForgotPasswordRequest,
    LoginRequest,
    RefreshTokenRequest,
    RegisterRequest,
    ResetPasswordRequest,
} from '../types/request/auth';
import type { User } from '../types/request/user';
import type {
    ChangePasswordResponse,
    ForgotPasswordResponse,
    LoginResponse,
    RefreshTokenResponse,
    RegisterResponse,
    ResetPasswordResponse,
} from '../types/response/auth';

// Auth API functions
export const authApi = {
    register: async (credentials: RegisterRequest): Promise<RegisterResponse> => {
        const response = await apiClient.post<RegisterResponse>('/auth/register', credentials);
        return response.data;
    },

    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
        return response.data;
    },

    refreshToken: async (request: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
        const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', request);
        return response.data;
    },

    forgotPassword: async (request: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
        const response = await apiClient.post<ForgotPasswordResponse>(
            '/auth/forgot-password',
            request
        );
        return response.data;
    },

    resetPassword: async (request: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
        const response = await apiClient.post<ResetPasswordResponse>(
            '/auth/reset-password',
            request
        );
        return response.data;
    },

    changePassword: async (request: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
        const response = await apiClient.post<ChangePasswordResponse>(
            '/auth/change-password',
            request
        );
        return response.data;
    },

    getProfile: async (): Promise<User> => {
        const response = await apiClient.get<{ data: User }>('/auth/me');
        return response.data.data;
    },
};
