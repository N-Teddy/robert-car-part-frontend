import { useMutation, useQuery } from '@tanstack/react-query';
import type { CreateCategoryRequest, UpdateCategoryRequest } from '../types/request/category';
import type { Category, CategoryWithParent, CategoryWithChildren } from '../types/request/category';
import { categoryApi } from '../api/categoryApi';
import type { CategoryFilterDto } from '../types/response/category';

/**
 * Custom hook for managing category-related API calls using React Query.
 */
export const useCategory = () => {
    // Mutation for creating a category
    const useCreateCategory = () => {
        return useMutation<CategoryWithParent, Error, FormData>({
            mutationFn: categoryApi.create,
        });
    };

    // Query for fetching categories tree
    const useGetCategoryTree = (filters?: CategoryFilterDto) => {
        return useQuery<{ items: CategoryWithChildren[]; meta: any }, Error>({
            queryKey: ['categories', 'tree', filters],
            queryFn: () => categoryApi.getTree(filters),
        });
    };

    // Query for fetching children of a category
    const useGetCategoryChildren = (id: string) => {
        return useQuery<CategoryWithChildren[], Error>({
            queryKey: ['categories', 'children', id],
            queryFn: () => categoryApi.getChildren(id),
            enabled: !!id,
        });
    };

    // Query for fetching all categories
    const useGetAllCategories = (filters?: CategoryFilterDto) => {
        return useQuery<{ items: Category[]; meta: any }, Error>({
            queryKey: ['categories', 'list', filters],
            queryFn: () => categoryApi.getAll(filters),
        });
    };

    // Query for fetching a specific category
    const useGetCategoryById = (id: string) => {
        return useQuery<CategoryWithParent, Error>({
            queryKey: ['category', 'detail', id],
            queryFn: () => categoryApi.getById(id),
            enabled: !!id,
        });
    };

    // Mutation for updating a category
    const useUpdateCategory = () => {
        return useMutation<CategoryWithParent, Error, { id: string; data: FormData }>({
            mutationFn: ({ id, data }) => categoryApi.update(id, data),
        });
    };

    // Mutation for deleting a category
    const useDeleteCategory = () => {
        return useMutation<{ success: true }, Error, string>({
            mutationFn: categoryApi.delete,
        });
    };

    return {
        useCreateCategory,
        useGetCategoryTree,
        useGetCategoryChildren,
        useGetAllCategories,
        useGetCategoryById,
        useUpdateCategory,
        useDeleteCategory,
    };
};
