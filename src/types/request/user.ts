import type { SortOrder, UserRoleEnum } from '../enum';

export interface ProfileImage {
    id: string;
    url: string;
    format: string;
    size: number;
    entityType: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserRequest {
    fullName: string;
    email: string;
    phoneNumber: string;
    role: UserRoleEnum;
    password: string;
    image?: File | Blob;
}

export interface User {
    id: string;
    email: string;
    fullName: string;
    role: UserRoleEnum;
    phoneNumber: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    profileImage: ProfileImage | null;
}

export interface UpdateProfileRequest {
    fullName?: string;
    phoneNumber?: string;
    email?: string;
}

export interface AssignRoleRequest {
    userId: string;
    role: UserRoleEnum;
}

export interface UpdateUserRequest {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    role?: UserRoleEnum;
    isActive?: boolean;
}

export interface UserFilter {
    role?: UserRoleEnum;
    isActive?: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: SortOrder;
    page?: number;
    limit?: number;
}
