import type { DeliveryMethodEnum, OrderStatusEnum } from "../enum";


export interface OrderItemRequest {
    partId: string;
    quantity: number;
    unitPrice?: number;
    discount?: number;
}

export interface CreateOrderRequest {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    notes?: string;
    deliveryMethod: DeliveryMethodEnum;
    items: OrderItemRequest[];
}

export interface UpdateOrderRequest {
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    notes?: string;
    deliveryMethod?: DeliveryMethodEnum;
    status?: OrderStatusEnum;
    items?: OrderItemRequest[];
}

export interface OrderQueryDto {
    status?: OrderStatusEnum;
    deliveryMethod?: DeliveryMethodEnum;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}