// src/hooks/userHook.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import type {
    UpdateProfileRequest,
    AssignRoleRequest,
    UpdateUserRequest,
    UserFilter,
    CreateUserRequest,
} from '../types/request/user';
import type { User } from '../types/request/user';
import { userApi } from '../api/userApi';

/**
 * Custom hook for managing user-related API calls using React Query.
 */
export const useUser = () => {
    // Query for fetching current user profile
    const useGetProfile = () => {
        return useQuery<User, Error>({
            queryKey: ['user', 'profile'],
            queryFn: userApi.getProfile,
        });
    };

    // Mutation for updating current user profile
    const useUpdateProfile = () => {
        return useMutation<User, Error, UpdateProfileRequest>({
            mutationFn: userApi.updateProfile,
        });
    };

    // Mutation for assigning role to user
    const useAssignRole = () => {
        return useMutation<User, Error, AssignRoleRequest>({
            mutationFn: userApi.assignRole,
        });
    };

    // Query for fetching all users with filters
    const useGetAllUsers = (filters: UserFilter) => {
        return useQuery<{ items: User[]; meta: any }, Error>({
            queryKey: ['users', 'list', filters],
            queryFn: () => userApi.getAllUsers(filters),
        });
    };

    // Query for fetching users without role
    const useGetUsersWithoutRole = () => {
        return useQuery<User[], Error>({
            queryKey: ['users', 'without-role'],
            queryFn: userApi.getUsersWithoutRole,
        });
    };

    // Query for fetching user by ID
    const useGetUserById = (id: string) => {
        return useQuery<User, Error>({
            queryKey: ['user', 'detail', id],
            queryFn: () => userApi.getUserById(id),
            enabled: !!id,
        });
    };

    // Mutation for updating user by ID - Updated to handle FormData
    const useUpdateUser = () => {
        return useMutation<User, Error, { id: string; data: UpdateUserRequest | FormData }>({
            mutationFn: ({ id, data }) => userApi.updateUser(id, data),
        });
    };

    // Mutation for creating user - New mutation
    const useCreateUser = () => {
        return useMutation<User, Error, CreateUserRequest | FormData>({
            mutationFn: userApi.createUser,
        });
    };

    // Mutation for deleting user by ID
    const useDeleteUser = () => {
        return useMutation<void, Error, string>({
            mutationFn: userApi.deleteUser,
        });
    };

    return {
        useGetProfile,
        useUpdateProfile,
        useAssignRole,
        useGetAllUsers,
        useGetUsersWithoutRole,
        useGetUserById,
        useUpdateUser,
        useCreateUser, // Added this
        useDeleteUser,
    };
};
