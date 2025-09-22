import { useMutation, useQuery } from '@tanstack/react-query';
import type {
    CreateOrderRequest,
    UpdateOrderRequest,
    OrderQueryDto,
} from '../types/request/order';
import type {
    OrderResponse,
    OrderStatsResponse,
    PaginatedOrdersResponse,
} from '../types/response/order';
import { orderApi } from '../api/orderApi';

/**
 * Custom hook for managing order-related API calls using React Query.
 */
export const useOrder = () => {
    // Mutation for creating an order
    const useCreateOrder = () => {
        return useMutation<OrderResponse, Error, CreateOrderRequest>({
            mutationFn: orderApi.create,
        });
    };

    // Query for fetching all orders with filters
    const useGetAllOrders = (filters?: OrderQueryDto) => {
        return useQuery<PaginatedOrdersResponse, Error>({
            queryKey: ['orders', 'list', filters],
            queryFn: () => orderApi.getAll(filters),
        });
    };

    // Query for fetching a specific order
    const useGetOrderById = (id: string) => {
        return useQuery<OrderResponse, Error>({
            queryKey: ['order', 'detail', id],
            queryFn: () => orderApi.getById(id),
            enabled: !!id,
        });
    };

    // Mutation for updating an order
    const useUpdateOrder = () => {
        return useMutation<OrderResponse, Error, { id: string; data: UpdateOrderRequest }>({
            mutationFn: ({ id, data }) => orderApi.update(id, data),
        });
    };

    // Mutation for deleting an order
    const useDeleteOrder = () => {
        return useMutation<void, Error, string>({
            mutationFn: orderApi.delete,
        });
    };

    // Query for order statistics
    const useGetOrderStats = () => {
        return useQuery<OrderStatsResponse, Error>({
            queryKey: ['orders', 'stats'],
            queryFn: orderApi.getStats,
        });
    };

    // Mutation for generating order receipt
    const useGenerateReceipt = () => {
        return useMutation<Blob, Error, string>({
            mutationFn: orderApi.generateReceipt,
        });
    };

    return {
        useCreateOrder,
        useGetAllOrders,
        useGetOrderById,
        useUpdateOrder,
        useDeleteOrder,
        useGetOrderStats,
        useGenerateReceipt,
    };
};