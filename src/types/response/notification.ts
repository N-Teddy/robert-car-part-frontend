import type {
    NotificationsData,
    SingleNotificationData,
    UnreadCountData,
} from '../request/notification';

// Common response structure
export interface ApiResponse<T> {
    message: string;
    data: T;
}

// Mark as read response data
export interface MarkAsReadData {
    message: string;
    success: boolean;
}

// Specific notification response types
export type MarkAsReadResponse = ApiResponse<MarkAsReadData>;
export type GetNotificationsResponse = ApiResponse<NotificationsData>;
export type GetUnreadCountResponse = ApiResponse<UnreadCountData>;
export type GetNotificationResponse = ApiResponse<SingleNotificationData>;
