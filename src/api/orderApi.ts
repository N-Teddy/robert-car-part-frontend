import { apiClient } from '../provider/AxiosClient';
import type { CreateOrderRequest, UpdateOrderRequest, OrderQueryDto } from '../types/request/order';
import type {
    OrderResponse,
    OrderStatsResponse,
    PaginatedOrdersResponse,
    SingleOrderResponse,
    OrderListResponse,
    OrderStatsApiResponse,
} from '../types/response/order';

// Order API functions
export const orderApi = {
    // Create a new order
    create: async (data: CreateOrderRequest): Promise<OrderResponse> => {
        const response = await apiClient.post<SingleOrderResponse>('/orders', data);
        return response.data.data;
    },

    // Get paginated list of orders with filters
    getAll: async (filters?: OrderQueryDto): Promise<PaginatedOrdersResponse> => {
        const response = await apiClient.get<OrderListResponse>('/orders', {
            params: filters,
        });
        return response.data.data;
    },

    // Get a specific order
    getById: async (id: string): Promise<OrderResponse> => {
        const response = await apiClient.get<SingleOrderResponse>(`/orders/${id}`);
        return response.data.data;
    },

    // Update an order
    update: async (id: string, data: UpdateOrderRequest): Promise<OrderResponse> => {
        const response = await apiClient.patch<SingleOrderResponse>(`/orders/${id}`, data);
        return response.data.data;
    },

    // Delete an order
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/orders/${id}`);
    },

    // Get order statistics
    getStats: async (): Promise<OrderStatsResponse> => {
        const response = await apiClient.get<OrderStatsApiResponse>('/orders/stats');
        return response.data.data;
    },

    // Generate order receipt
    generateReceipt: async (id: string): Promise<Blob> => {
        const response = await apiClient.get(`/orders/${id}/receipt`, {
            responseType: 'blob',
        });
        return response.data;
    },
};
