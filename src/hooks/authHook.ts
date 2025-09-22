// src/hooks/useAuth.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import type {
    ChangePasswordRequest,
    ForgotPasswordRequest,
    LoginRequest,
    RefreshTokenRequest,
    RegisterRequest,
    ResetPasswordRequest,
} from '../types/request/auth';
import type {
    LoginResponse,
    RegisterResponse,
    RefreshTokenResponse,
    ForgotPasswordResponse,
    ResetPasswordResponse,
    ChangePasswordResponse,
} from '../types/response/auth';
import type { User } from '../types/request/user'; // Note: This type is likely from response, not request
import { authApi } from '../api/authApi';

/**
 * Custom hook for managing authentication-related API calls using React Query.
 */
    // Mutation for user registration
    export const useRegister = () => {
        return useMutation<RegisterResponse, Error, RegisterRequest>({
            mutationFn: authApi.register,
        });
    };

    // Mutation for user login
    export const useLogin = () => {
        return useMutation<LoginResponse, Error, LoginRequest>({
            mutationFn: authApi.login,
        });
    };

    // Mutation for refreshing access tokens
    export const useRefreshToken = () => {
        return useMutation<RefreshTokenResponse, Error, RefreshTokenRequest>({
            mutationFn: authApi.refreshToken,
        });
    };

    // Mutation for initiating a password reset
    export const useForgotPassword = () => {
        return useMutation<ForgotPasswordResponse, Error, ForgotPasswordRequest>({
            mutationFn: authApi.forgotPassword,
        });
    };

    // Mutation for resetting the password with a token
    export const useResetPassword = () => {
        return useMutation<ResetPasswordResponse, Error, ResetPasswordRequest>({
            mutationFn: authApi.resetPassword,
        });
    };

    // Mutation for changing the user's password
    export const useChangePassword = () => {
        return useMutation<ChangePasswordResponse, Error, ChangePasswordRequest>({
            mutationFn: authApi.changePassword,
        });
    };

    // Query for fetching the current user's profile
    // Note: The query key 'profile' is used for caching and identifying this query.
    // If a request fails, you can handle it in the onError callback
    export const useGetProfile = () => {
        return useQuery<User, Error>({
            queryKey: ['profile'],
            queryFn: authApi.getProfile,
        });
    };


