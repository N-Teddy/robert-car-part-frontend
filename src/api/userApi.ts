import { apiClient } from '../provider/AxiosClient';
import type {
    User,
    UpdateProfileRequest,
    AssignRoleRequest,
    UpdateUserRequest,
    UserFilter,
} from '../types/request/user';
import type {
    UserProfileResponse,
    UpdateUserResponse,
    AssignRoleResponse,
    GetUsersResponse,
    GetUsersWithoutRoleResponse,
} from '../types/response/user';

// User API functions
export const userApi = {
    // Get current user profile
    getProfile: async (): Promise<User> => {
        const response = await apiClient.get<UserProfileResponse>('/users/profile');
        return response.data.data;
    },

    // Update current user profile
    updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
        const response = await apiClient.put<UserProfileResponse>('/users/profile', data);
        return response.data.data;
    },

    // Assign role to user
    assignRole: async (data: AssignRoleRequest): Promise<User> => {
        const response = await apiClient.post<AssignRoleResponse>('/users/assign-role', data);
        return response.data.data;
    },

    // Get all users with filters
    getAllUsers: async (filters: UserFilter): Promise<{ items: User[]; meta: any }> => {
        const response = await apiClient.get<GetUsersResponse>('/users', { params: filters });
        return response.data.data;
    },

    // Get users without assigned role
    getUsersWithoutRole: async (): Promise<User[]> => {
        const response = await apiClient.get<GetUsersWithoutRoleResponse>('/users/without-role');
        return response.data.data;
    },

    // Get user by ID
    getUserById: async (id: string): Promise<User> => {
        const response = await apiClient.get<UpdateUserResponse>(`/users/${id}`);
        return response.data.data;
    },

    // Update user by ID
    updateUser: async (id: string, data: UpdateUserRequest): Promise<User> => {
        const response = await apiClient.put<UpdateUserResponse>(`/users/${id}`, data);
        return response.data.data;
    },

    // Delete user by ID
    deleteUser: async (id: string): Promise<void> => {
        await apiClient.delete(`/users/${id}`);
    },
};
