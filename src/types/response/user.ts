import type { User } from '../request/user';

// Response Meta
export interface ResponseMeta {
    total: number;
    page: string;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

// Paginated Response
export interface PaginatedResponse<T> {
    message: string;
    data: {
        items: T[];
        meta: ResponseMeta;
    };
}

// Single Item Response
export interface SingleItemResponse<T> {
    message: string;
    data: T;
}

// Array Response (without pagination)
export interface ArrayResponse<T> {
    message: string;
    data: T[];
}

// Type aliases for specific responses
export type UserProfileResponse = SingleItemResponse<User>;
export type UpdateUserResponse = SingleItemResponse<User>;
export type AssignRoleResponse = SingleItemResponse<User>;
export type GetUsersResponse = PaginatedResponse<User>;
export type GetUsersWithoutRoleResponse = ArrayResponse<User>;

// API Response type that can handle different response formats
export type ApiResponse<T> = SingleItemResponse<T> | PaginatedResponse<T> | ArrayResponse<T>;
