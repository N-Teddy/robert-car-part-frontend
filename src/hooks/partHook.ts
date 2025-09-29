// src/hooks/useParts.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import type {
    CreatePartRequest,
    UpdatePartRequest,
    Part,
    PartFilterDto,
} from '../types/request/part';
import { partApi } from '../api/partApi';
import type { CategoryStats, PartStatsSummary, ResponseMeta } from '../types/response/part';

/**
 * Custom hook for managing part-related API calls using React Query.
 */
export const usePart = () => {
    // Mutation for creating a part
    const useCreatePart = () => {
        return useMutation<Part, Error, CreatePartRequest>({
            mutationFn: async (data) => {
                const response = await partApi.createPart(data);
                return response.data;
            },
        });
    };

    // Query for fetching all parts
    const useGetAllParts = (filters?: PartFilterDto) => {
        return useQuery<{ items: Part[]; meta: ResponseMeta }, Error>({
            queryKey: ['parts', 'list', filters],
            queryFn: async () => {
                const response = await partApi.getParts(filters);
                return response.data;
            },
        });
    };

    // Query for fetching a specific part
    const useGetPartById = (id: string) => {
        return useQuery<Part, Error>({
            queryKey: ['part', 'detail', id],
            queryFn: async () => {
                const response = await partApi.getPart(id);
                return response.data;
            },
            enabled: !!id,
        });
    };

    // Mutation for updating a part
    const useUpdatePart = () => {
        return useMutation<Part, Error, { id: string; data: UpdatePartRequest }>({
            mutationFn: async ({ id, data }) => {
                const response = await partApi.updatePart(id, data);
                return response.data;
            },
        });
    };

    // Mutation for deleting a part
    const useDeletePart = () => {
        return useMutation<void, Error, string>({
            mutationFn: async (id) => {
                await partApi.deletePart(id);
            },
        });
    };

    // Query for part statistics summary
    const useGetPartStatistics = () => {
        return useQuery<PartStatsSummary, Error>({
            queryKey: ['parts', 'stats', 'summary'],
            queryFn: async () => {
                const response = await partApi.getPartStats();
                return response.data;
            },
        });
    };

    // Query for category statistics
    const useGetCategoryStatistics = () => {
        return useQuery<CategoryStats[], Error>({
            queryKey: ['parts', 'stats', 'category'],
            queryFn: async () => {
                const response = await partApi.getCategoryStats();
                return response.data;
            },
        });
    };

    // Query for low stock parts
    const useGetLowStockParts = () => {
        return useQuery<Part[], Error>({
            queryKey: ['parts', 'inventory', 'low-stock'],
            queryFn: async () => {
                const response = await partApi.getLowStockParts();
                return response.data;
            },
        });
    };

    return {
        useCreatePart,
        useGetAllParts,
        useGetPartById,
        useUpdatePart,
        useDeletePart,
        useGetPartStatistics,
        useGetCategoryStatistics,
        useGetLowStockParts,
    };
};
