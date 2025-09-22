// src/api/partApi.ts
import { apiClient } from '../provider/AxiosClient';
import type { CreatePartRequest, PartFilterDto, UpdatePartRequest } from '../types/request/part';

import type { CategoryStatsResponse, LowStockPartsResponse, PartListResponse, PartStatsSummaryResponse, SinglePartResponse } from '../types/response/part';

export const partApi = {
    // Create a new part
    createPart: async (data: CreatePartRequest): Promise<SinglePartResponse> => {
        const formData = new FormData();

        // Append all fields to form data
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', data.price.toString());
        formData.append('quantity', data.quantity.toString());
        formData.append('partNumber', data.partNumber);
        formData.append('vehicleId', data.vehicleId);
        formData.append('categoryId', data.categoryId);

        if (data.condition) {
            formData.append('condition', data.condition);
        }

        // Append images if they exist
        if (data.images && data.images.length > 0) {
            data.images.forEach((image) => {
                if (image instanceof File || image instanceof Blob) {
                    formData.append('images', image);
                }
            });
        }

        const response = await apiClient.post<SinglePartResponse>('/parts', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Get all parts with filters
    getParts: async (filters?: PartFilterDto): Promise<PartListResponse> => {
        const params = new URLSearchParams();

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.append(key, value.toString());
                }
            });
        }

        const response = await apiClient.get<PartListResponse>(`/parts?${params}`);
        return response.data;
    },

    // Get a single part by ID
    getPart: async (id: string): Promise<SinglePartResponse> => {
        const response = await apiClient.get<SinglePartResponse>(`/parts/${id}`);
        return response.data;
    },

    // Update a part
    updatePart: async (id: string, data: UpdatePartRequest): Promise<SinglePartResponse> => {
        const formData = new FormData();

        // Append all fields to form data
        if (data.name) formData.append('name', data.name);
        if (data.description) formData.append('description', data.description);
        if (data.price) formData.append('price', data.price.toString());
        if (data.quantity) formData.append('quantity', data.quantity.toString());
        if (data.partNumber) formData.append('partNumber', data.partNumber);
        if (data.vehicleId) formData.append('vehicleId', data.vehicleId);
        if (data.categoryId) formData.append('categoryId', data.categoryId);
        if (data.condition !== undefined) formData.append('condition', data.condition || '');

        // Append images if they exist
        if (data.images && data.images.length > 0) {
            data.images.forEach((image) => {
                if (image instanceof File || image instanceof Blob) {
                    formData.append('images', image);
                }
            });
        }

        const response = await apiClient.put<SinglePartResponse>(`/parts/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Delete a part
    deletePart: async (id: string): Promise<void> => {
        await apiClient.delete(`/parts/${id}`);
    },

    // Get part statistics summary
    getPartStats: async (): Promise<PartStatsSummaryResponse> => {
        const response = await apiClient.get<PartStatsSummaryResponse>('/parts/stats/summary');
        return response.data;
    },

    // Get category statistics
    getCategoryStats: async (): Promise<CategoryStatsResponse> => {
        const response = await apiClient.get<CategoryStatsResponse>('/parts/stats/category');
        return response.data;
    },

    // Get low stock parts
    getLowStockParts: async (): Promise<LowStockPartsResponse> => {
        const response = await apiClient.get<LowStockPartsResponse>('/parts/inventory/low-stock');
        return response.data;
    },
};