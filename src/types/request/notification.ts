import type { NotificationTypeEnum } from '../enum';

export type NotificationMetadata = Record<string, any> | null;

export interface Notification {
    id: string;
    type: NotificationTypeEnum;
    title: string;
    message: string;
    isRead: boolean;
    metadata: NotificationMetadata;
    userId: string;
    emailSent: boolean;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface NotificationsData {
    items: Notification[];
    meta: PaginationMeta;
}

export interface UnreadCountData {
    count: number;
}

export interface SingleNotificationData {
    id: string;
    type: NotificationTypeEnum;
    title: string;
    message: string;
    isRead: boolean;
    metadata: NotificationMetadata;
    userId: string;
    emailSent: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface MarkAsReadRequest {
    notificationIds: string[];
}

export interface NotificationFilterQuery {
    type?: NotificationTypeEnum;
    isRead?: boolean;
    userId?: string;
    search?: string;
    page?: number;
    limit?: number;
}
