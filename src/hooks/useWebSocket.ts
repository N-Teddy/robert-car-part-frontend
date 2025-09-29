// src/hooks/useWebSocket.ts
import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseWebSocketOptions {
    onNotification?: (notification: any) => void;
    onConnect?: () => void;
    onDisconnect?: () => void;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [reconnectAttempt, setReconnectAttempt] = useState(0);
    const pollingRef = useRef<NodeJS.Timeout | null>(null);

    const optionsRef = useRef(options);
    optionsRef.current = options;

    // Check if we're in production (Vercel) where WebSockets won't work
    const isProduction = import.meta.env.PROD || window.location.hostname !== 'localhost';

    const connect = useCallback(() => {
        if (isProduction) {
            // In production, use polling instead of WebSocket
            startPolling();
            return;
        }

        // Only use WebSocket in development
        if (socketRef.current?.connected) {
            return;
        }

        const stored = localStorage.getItem('authToken');
        const tokens = stored ? JSON.parse(stored) : null;

        if (!tokens?.accessToken) {
            console.warn('No access token found, cannot connect to WebSocket');
            return;
        }

        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }

        // Use localhost for development, but note WebSocket won't work in production
        const wsUrl = isProduction
            ? 'wss://robert-car-part-backend.vercel.app' // This won't work on Vercel
            : 'http://localhost:3000';

        const socket = io(`${wsUrl}/notifications`, {
            auth: {
                token: tokens.accessToken,
            },
            transports: ['polling'], // Force polling in production
            reconnection: !isProduction, // Disable reconnection in production since WebSocket won't work
            reconnectionAttempts: isProduction ? 0 : 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 10000,
            autoConnect: !isProduction,
        });

        socket.on('connect', () => {
            console.log('WebSocket connected');
            setIsConnected(true);
            setReconnectAttempt(0);
            optionsRef.current.onConnect?.();
        });

        socket.on('disconnect', (reason) => {
            console.log('WebSocket disconnected:', reason);
            setIsConnected(false);
            optionsRef.current.onDisconnect?.();
        });

        socket.on('notification', (notification) => {
            optionsRef.current.onNotification?.(notification);
        });

        socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
            setIsConnected(false);
            // Fallback to polling if WebSocket fails
            if (!isProduction) {
                startPolling();
            }
        });

        socketRef.current = socket;
    }, [isProduction]);

    // Polling implementation for production
    const startPolling = useCallback(() => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
        }

        console.log('Starting notification polling...');
        setIsConnected(true);
        optionsRef.current.onConnect?.();

        // Poll every 30 seconds for new notifications
        pollingRef.current = setInterval(async () => {
            try {
                // You'll need to implement an API endpoint to check for new notifications
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/notifications`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });

                if (response.ok) {
                    const newNotifications = await response.json();
                    newNotifications.forEach((notification: any) => {
                        optionsRef.current.onNotification?.(notification);
                    });
                }
            } catch (error) {
                console.error('Polling error:', error);
            }
        }, 30000); // Poll every 30 seconds
    }, []);

    const stopPolling = useCallback(() => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
        }
        setIsConnected(false);
    }, []);

    const disconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
        stopPolling();
        setIsConnected(false);
    }, [stopPolling]);

    const markAsRead = useCallback(
        (notificationId: string) => {
            if (isProduction) {
                // In production, make API call instead of WebSocket emit
                fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/notifications/${notificationId}/read`,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                        },
                    }
                ).catch(console.error);
            } else if (socketRef.current?.connected) {
                socketRef.current.emit('markAsRead', notificationId);
            }
        },
        [isProduction]
    );

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
        socket: socketRef.current,
        isConnected,
        reconnectAttempt,
        markAsRead,
        disconnect,
        connect,
        isUsingPolling: isProduction,
    };
};
