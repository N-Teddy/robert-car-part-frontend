// src/hooks/useWebSocket.ts
import { useEffect, useRef, useCallback, useState } from 'react';
import { apiClient } from '../provider/AxiosClient';

interface UseWebSocketOptions {
    onNotification?: (notification: any) => void;
    onConnect?: () => void;
    onDisconnect?: () => void;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
    const [isConnected, setIsConnected] = useState(false);
    const pollingRef = useRef<NodeJS.Timeout | null>(null);
    const optionsRef = useRef(options);
    optionsRef.current = options;

    const getAuthToken = useCallback(() => {
        const stored = localStorage.getItem('authToken');
        if (stored) {
            try {
                const tokens = JSON.parse(stored);
                return tokens?.accessToken;
            } catch (err) {
                console.error('Failed to parse auth token', err);
                return null;
            }
        }
        return null;
    }, []);

    const connect = useCallback(() => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
        }

        const authToken = getAuthToken();
        if (!authToken) {
            console.warn('No access token found, cannot start notification polling');
            return;
        }

        console.log('Starting notification polling...');
        setIsConnected(true);
        optionsRef.current.onConnect?.();

        // Poll for new notifications
        const pollForNotifications = async () => {
            try {
                const response = await apiClient.get('/notifications');
                if (response.data) {
                    const newNotifications = Array.isArray(response.data)
                        ? response.data
                        : [response.data];

                    newNotifications.forEach((notification: any) => {
                        optionsRef.current.onNotification?.(notification);
                    });
                }
            } catch (error) {
                console.error('Polling error:', error);
            }
        };

        // Poll immediately on connect
        pollForNotifications();

        // Then poll every 30 seconds for new notifications
        pollingRef.current = setInterval(pollForNotifications, 30000);
    }, [getAuthToken]);

    const disconnect = useCallback(() => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
        }
        setIsConnected(false);
        optionsRef.current.onDisconnect?.();
    }, []);

    const markAsRead = useCallback(async (notificationId: string) => {
        try {
            await apiClient.post(`/notifications/${notificationId}/read`);
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    }, []);

    // Main connection effect
    useEffect(() => {
        connect();

        return () => {
            disconnect();
        };
    }, [connect, disconnect]);

    // Effect to handle auth token changes
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'authToken') {
                disconnect();
                setTimeout(() => connect(), 100);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [connect, disconnect]);

    return {
        isConnected,
        markAsRead,
        disconnect,
        connect,
        isUsingPolling: true,
    };
};
