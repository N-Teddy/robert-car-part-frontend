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
    const optionsRef = useRef(options);

    // Update options ref when options change
    useEffect(() => {
        optionsRef.current = options;
    }, [options]);

    const connect = useCallback(() => {
        // Get fresh tokens on each connect attempt
        const stored = localStorage.getItem("authToken");
        const tokens = stored ? JSON.parse(stored) : null;

        if (!tokens?.accessToken) {
            console.warn('No access token found, cannot connect to WebSocket');
            return;
        }

        // Disconnect existing socket if any
        if (socketRef.current) {
            socketRef.current.disconnect();
        }

        const socket = io(`${import.meta.env.VITE_WS_URL}/notifications`, {
            auth: {
                token: tokens.accessToken,
            },
            transports: ['websocket', 'polling'], // Allow both transports
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
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

            // Only attempt reconnection for unexpected disconnects
            if (reason === 'io server disconnect') {
                // The server explicitly disconnected, don't try to reconnect automatically
                console.log('Server explicitly disconnected, manual reconnect required');
            }
        });

        socket.on('notification', (notification) => {
            optionsRef.current.onNotification?.(notification);
        });

        socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
            setReconnectAttempt(prev => prev + 1);
        });

        socket.on('reconnect', (attempt) => {
            console.log(`WebSocket reconnected after ${attempt} attempts`);
            setIsConnected(true);
            setReconnectAttempt(0);
        });

        socket.on('reconnect_attempt', (attempt) => {
            console.log(`WebSocket reconnect attempt ${attempt}`);
        });

        socket.on('reconnect_error', (error) => {
            console.error('WebSocket reconnection error:', error);
        });

        socket.on('reconnect_failed', () => {
            console.error('WebSocket reconnection failed after all attempts');
            setIsConnected(false);
        });

        socketRef.current = socket;

        return () => {
            socket.disconnect();
        };
    }, []);

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

    // Only connect once on mount and disconnect on unmount
    useEffect(() => {
        connect();

        return () => {
            disconnect();
        };
    }, [connect, disconnect]);

    // Reconnect when auth token changes
    useEffect(() => {
        const checkAuthToken = () => {
            const stored = localStorage.getItem("authToken");
            const tokens = stored ? JSON.parse(stored) : null;

            if (tokens?.accessToken && !isConnected) {
                // If we have a token but are not connected, try to connect
                connect();
            } else if (!tokens?.accessToken && isConnected) {
                // If we lose the token while connected, disconnect
                disconnect();
            }
        };

        // Check auth token initially
        checkAuthToken();

        // Listen for storage changes (like token updates in other tabs)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "authToken") {
                checkAuthToken();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [isConnected, connect, disconnect]);

    return {
        socket: socketRef.current,
        isConnected,
        reconnectAttempt,
        markAsRead,
        disconnect,
        connect,
    };
};