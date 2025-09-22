import { apiClient } from '../provider/AxiosClient';
import type {
    Category,
    CategoryWithParent,
    CategoryWithChildren,
    CreateCategoryRequest,
    UpdateCategoryRequest,
} from '../types/request/category';
import type {
    SingleCategoryResponse,
    CategoryListResponse,
    CategoryTreeResponse,
    CategoryChildrenResponse,
    CategoryFilterDto,
} from '../types/response/category';

// Category API functions
export const categoryApi = {
    // Create a new category
    create: async (formData: FormData): Promise<CategoryWithParent> => {
        const response = await apiClient.post<SingleCategoryResponse>('/categories', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.data;
    },

    // Get all categories as a tree structure
    getTree: async (
        filters?: CategoryFilterDto
    ): Promise<{ items: CategoryWithChildren[]; meta: any }> => {
        const response = await apiClient.get<CategoryTreeResponse>('/categories/tree', {
            params: filters,
        });
        return response.data.data;
    },

    // Get children of a specific category
    getChildren: async (id: string): Promise<CategoryWithChildren[]> => {
        const response = await apiClient.get<CategoryChildrenResponse>(
            `/categories/${id}/children`
        );
        return response.data.data;
    },

    // Get paginated list of categories
    getAll: async (filters?: CategoryFilterDto): Promise<{ items: Category[]; meta: any }> => {
        const response = await apiClient.get<CategoryListResponse>('/categories', {
            params: filters,
        });
        return response.data.data;
    },

    // Get a specific category
    getById: async (id: string): Promise<CategoryWithParent> => {
        const response = await apiClient.get<SingleCategoryResponse>(`/categories/${id}`);
        return response.data.data;
    },

    // Update a category
    update: async (id: string, formData: FormData): Promise<CategoryWithParent> => {
        const response = await apiClient.put<SingleCategoryResponse>(
            `/categories/${id}`,
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
            }
        );
        return response.data.data;
    },

    // Delete a category
    delete: async (id: string): Promise<{ success: true }> => {
        const response = await apiClient.delete(`/categories/${id}`);
        return response.data;
    },
};
