import { useMutation, useQuery } from '@tanstack/react-query';
import type { MarkAsReadRequest, NotificationFilterQuery } from '../types/request/notification';
import type {
    NotificationsData,
    UnreadCountData,
    SingleNotificationData,
} from '../types/request/notification';
import { notificationApi } from '../api/notificationApi';

/**
 * Custom hook for managing notification-related API calls using React Query.
 */
export const useNotification = () => {
    // Mutation for marking notifications as read
    const useMarkAsRead = () => {
        return useMutation<void, Error, MarkAsReadRequest>({
            mutationFn: notificationApi.markAsRead,
        });
    };

    // Query for fetching notifications with filters
    const useGetNotifications = (filters: NotificationFilterQuery) => {
        return useQuery<NotificationsData, Error>({
            queryKey: ['notifications', 'list', filters],
            queryFn: () => notificationApi.getNotifications(filters),
        });
    };

    // Query for fetching unread notifications count
    const useGetUnreadCount = () => {
        return useQuery<UnreadCountData, Error>({
            queryKey: ['notifications', 'unread-count'],
            queryFn: notificationApi.getUnreadCount,
        });
    };

    // Query for fetching notification by ID
    const useGetNotificationById = (id: string) => {
        return useQuery<SingleNotificationData, Error>({
            queryKey: ['notification', 'detail', id],
            queryFn: () => notificationApi.getNotificationById(id),
            enabled: !!id,
        });
    };

    return {
        useMarkAsRead,
        useGetNotifications,
        useGetUnreadCount,
        useGetNotificationById,
    };
};
