// src/contexts/NotificationContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useQueryClient } from '@tanstack/react-query';
import type { Notification } from '../types/request/notification';
import { useNotification } from '../hooks/notificationHook';
import NotificationToast from '../components/notifications/NotificationToast';

// Notification sound file
const notificationSound = new Audio('/sounds/notification.mp3');
const criticalSound = new Audio('/sounds/critical-alert.mp3');

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    isConnected: boolean;
    markAsRead: (notificationIds: string[]) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (notificationId: string) => void;
    playSound: (type: 'normal' | 'critical') => void;
    soundEnabled: boolean;
    setSoundEnabled: (enabled: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationContext = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotificationContext must be used within NotificationProvider');
    }
    return context;
};

interface NotificationProviderProps {
    children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const queryClient = useQueryClient();
    const { useGetUnreadCount, useMarkAsRead } = useNotification();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [soundEnabled, setSoundEnabled] = useState(() => {
        return localStorage.getItem('notificationSound') !== 'false';
    });
    const toastQueueRef = useRef<Notification[]>([]);
    const [showToast, setShowToast] = useState<Notification | null>(null);

    const { data: unreadData, refetch: refetchUnread } = useGetUnreadCount();
    const markAsReadMutation = useMarkAsRead();

    const playSound = useCallback(
        (type: 'normal' | 'critical' = 'normal') => {
            if (!soundEnabled) return;

            const sound = type === 'critical' ? criticalSound : notificationSound;
            sound.play().catch((err) => console.error('Failed to play sound:', err));
        },
        [soundEnabled]
    );

    const handleNewNotification = useCallback(
        (notification: Notification) => {
            // Add to notifications list
            setNotifications((prev) => [notification, ...prev]);

            // Update unread count
            refetchUnread();

            // Invalidate queries
            queryClient.invalidateQueries({ queryKey: ['notifications'] });

            // Show toast
            toastQueueRef.current.push(notification);
            if (!showToast) {
                setShowToast(toastQueueRef.current.shift() || null);
            }

            // Play sound based on notification type
            const criticalTypes = ['PART_LOW_STOCK', 'ORDER_CANCELLED', 'SYSTEM_MAINTENANCE'];
            if (criticalTypes.includes(notification.type)) {
                playSound('critical');
            } else {
                playSound('normal');
            }
        },
        [queryClient, refetchUnread, playSound, showToast]
    );

    const { isConnected, isUsingPolling } = useWebSocket({
        onNotification: handleNewNotification,
        onConnect: () => {
            console.log('Notification service connected');
            refetchUnread();
        },
        onDisconnect: () => {
            console.log('Notification service disconnected');
        },
    });

    useEffect(() => {
        if (isUsingPolling && !isConnected) {
            // If we're using polling and not "connected" (WebSocket), still refetch periodically
            const interval = setInterval(() => {
                refetchUnread();
            }, 60000); // Refetch unread count every minute

            return () => clearInterval(interval);
        }
    }, [isUsingPolling, isConnected, refetchUnread]);

    const markAsRead = useCallback(
        async (notificationIds: string[]) => {
            try {
                await markAsReadMutation.mutateAsync({ notificationIds });

                // Update local state
                setNotifications((prev) =>
                    prev.map((n) => (notificationIds.includes(n.id) ? { ...n, isRead: true } : n))
                );

                // Refetch unread count
                refetchUnread();

                // Invalidate queries
                queryClient.invalidateQueries({ queryKey: ['notifications'] });
            } catch (error) {
                console.error('Failed to mark as read:', error);
            }
        },
        [markAsReadMutation, queryClient, refetchUnread]
    );

    const markAllAsRead = useCallback(async () => {
        const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
        if (unreadIds.length > 0) {
            await markAsRead(unreadIds);
        }
    }, [notifications, markAsRead]);

    const deleteNotification = useCallback((notificationId: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    }, []);

    // Handle toast queue
    useEffect(() => {
        if (!showToast && toastQueueRef.current.length > 0) {
            setTimeout(() => {
                setShowToast(toastQueueRef.current.shift() || null);
            }, 300);
        }
    }, [showToast]);

    // Save sound preference
    useEffect(() => {
        localStorage.setItem('notificationSound', soundEnabled.toString());
    }, [soundEnabled]);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount: unreadData?.count || 0,
                isConnected: isConnected || isUsingPolling, // Consider polling as "connected"
                markAsRead,
                markAllAsRead,
                deleteNotification,
                playSound,
                soundEnabled,
                setSoundEnabled,
            }}
        >
            {children}
            {showToast && (
                <NotificationToast
                    notification={showToast}
                    onClose={() => {
                        setShowToast(null);
                        // Check for next toast in queue
                        if (toastQueueRef.current.length > 0) {
                            setTimeout(() => {
                                setShowToast(toastQueueRef.current.shift() || null);
                            }, 300);
                        }
                    }}
                    onAction={() => {
                        markAsRead([showToast.id]);
                        setShowToast(null);
                    }}
                />
            )}
        </NotificationContext.Provider>
    );
};
