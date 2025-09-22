import type { UserRoleEnum } from '../enum';

// Common response structure
export interface ApiResponse<T> {
    message: string;
    data: T;
}

export interface User {
    id: string;
    email: string;
    fullName: string;
    role: UserRoleEnum;
    isActive: boolean;
    phoneNumber: string;
}

// Auth token response data
export interface AuthTokenData {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
    user: User;
}

// Success message responses
export interface SuccessMessageData {
    message: string;
    success: boolean;
}

// Specific response types
export type RegisterResponse = ApiResponse<AuthTokenData>;
export type LoginResponse = ApiResponse<AuthTokenData>;
export type RefreshTokenResponse = ApiResponse<AuthTokenData>;
export type ForgotPasswordResponse = ApiResponse<SuccessMessageData>;
export type ResetPasswordResponse = ApiResponse<SuccessMessageData>;
export type ChangePasswordResponse = ApiResponse<SuccessMessageData>;
