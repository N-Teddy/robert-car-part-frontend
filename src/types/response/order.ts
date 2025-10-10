import type { DeliveryMethodEnum, OrderStatusEnum } from '../enum';

export interface PartResponse {
    id: string;
    name: string;
    description: string;
    price: string;
    quantity: number;
    condition: string;
    partNumber: string;
    vehicle?: {
        id: string;
        make: string;
        model: string;
        year: number;
    };
    category?: {
        id: string;
        name: string;
    };
    images?: Array<{
        id: string;
        url: string;
        publicId: string;
        format: string;
    }>;
    vehicleId?: string;
    categoryId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface OrderItemResponse {
    id: string;
    quantity: number;
    unitPrice: string;
    discount: string;
    total: number;
    part: PartResponse;
    createdAt: string;
    updatedAt: string;
}

export interface OrderResponse {
    id: string;
    status: OrderStatusEnum;
    totalAmount: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    notes: string;
    deliveryMethod: DeliveryMethodEnum;
    items: OrderItemResponse[];
    createdAt: string;
    updatedAt: string;
}

export interface OrderStatsResponse {
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    ordersByStatus: Array<{
        status: OrderStatusEnum;
        count: number;
    }>;
    ordersByDeliveryMethod: Array<{
        method: DeliveryMethodEnum;
        count: number;
    }>;
    averageOrderValue: number;
}

export interface PaginatedOrdersResponse {
    items: OrderResponse[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface SingleOrderResponse {
    message: string;
    data: OrderResponse;
}

export interface OrderListResponse {
    message: string;
    data: PaginatedOrdersResponse;
}

export interface OrderStatsApiResponse {
    message: string;
    data: OrderStatsResponse;
}
