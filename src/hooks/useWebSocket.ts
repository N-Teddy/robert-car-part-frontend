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

    // Use useMemo to prevent unnecessary recreations of options
    const optionsRef = useRef(options);
    optionsRef.current = options;

    // Memoize the connect function to prevent infinite re-renders
    const connect = useCallback(() => {
        // Prevent multiple connection attempts
        if (socketRef.current?.connected) {
            return;
        }

        // Get fresh tokens
        const stored = localStorage.getItem("authToken");
        const tokens = stored ? JSON.parse(stored) : null;

        if (!tokens?.accessToken) {
            console.warn('No access token found, cannot connect to WebSocket');
            return;
        }

        // Disconnect existing socket if any
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }

        // Use VITE_API_URL or fallback to localhost
        const wsUrl = import.meta.env.VITE_API_BASE_URL?.replace('http', 'ws') || 'ws://localhost:3000';

        const socket = io(`${wsUrl}/notifications`, {
            auth: {
                token: tokens.accessToken,
            },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 10000,
            autoConnect: true,
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
        });

        socket.on('reconnect', (attempt) => {
            console.log(`WebSocket reconnected after ${attempt} attempts`);
            setIsConnected(true);
            setReconnectAttempt(0);
        });

        socket.on('reconnect_attempt', (attempt) => {
            console.log(`WebSocket reconnect attempt ${attempt}`);
            setReconnectAttempt(attempt);
        });

        socket.on('reconnect_error', (error) => {
            console.error('WebSocket reconnection error:', error);
        });

        socket.on('reconnect_failed', () => {
            console.error('WebSocket reconnection failed after all attempts');
            setIsConnected(false);
        });

        socketRef.current = socket;

        return socket;
    }, []); // Empty dependency array since we're using refs

    const disconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setIsConnected(false);
        }
    }, []);

    const markAsRead = useCallback((notificationId: string) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('markAsRead', notificationId);
        }
    }, []);

    // Main connection effect - runs once on mount
    useEffect(() => {
        connect();

        return () => {
            disconnect();
        };
    }, [connect, disconnect]); // Now these are stable

    // Effect to handle auth token changes
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "authToken") {
                // Disconnect and reconnect with new token
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
    };
};