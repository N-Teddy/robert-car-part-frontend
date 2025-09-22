import { apiClient } from '../provider/AxiosClient';
import type {
    NotificationsData,
    UnreadCountData,
    SingleNotificationData,
    MarkAsReadRequest,
    NotificationFilterQuery,
} from '../types/request/notification';
import type {
    GetNotificationsResponse,
    GetUnreadCountResponse,
    GetNotificationResponse,
} from '../types/response/notification';

// Notification API functions
export const notificationApi = {
    // Mark notifications as read
    markAsRead: async (data: MarkAsReadRequest): Promise<void> => {
        await apiClient.put('/notifications/mark-as-read', data);
    },

    // Get notifications with filters
    getNotifications: async (filters: NotificationFilterQuery): Promise<NotificationsData> => {
        const response = await apiClient.get<GetNotificationsResponse>('/notifications', {
            params: filters,
        });
        return response.data.data;
    },

    // Get unread notifications count
    getUnreadCount: async (): Promise<UnreadCountData> => {
        const response = await apiClient.get<GetUnreadCountResponse>('/notifications/unread-count');
        return response.data.data;
    },

    // Get notification by ID
    getNotificationById: async (id: string): Promise<SingleNotificationData> => {
        const response = await apiClient.get<GetNotificationResponse>(`/notifications/${id}`);
        return response.data.data;
    },
};
