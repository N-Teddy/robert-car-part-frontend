// src/components/notifications/NotificationBell.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';
import { useNotificationContext } from '../../context/NotificationContext';

export const NotificationBell: React.FC = () => {
    const { unreadCount, isConnected } = useNotificationContext();
    const [isOpen, setIsOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Animate bell when new notification arrives
    useEffect(() => {
        if (unreadCount > 0) {
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 1000);
        }
    }, [unreadCount]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2 text-gray-500 hover:text-gray-700 transition-colors ${
                    isAnimating ? 'animate-bounce' : ''
                }`}
            >
                <Bell size={20} />

                {/* Unread badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 rounded-full text-xs text-white flex items-center justify-center font-bold animate-in zoom-in duration-200">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}

                {/* Connection indicator */}
                <span
                    className={`absolute bottom-1 right-1 h-2 w-2 rounded-full ${
                        isConnected ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                />
            </button>

            {/* Dropdown */}
            {isOpen && <NotificationDropdown onClose={() => setIsOpen(false)} />}
        </div>
    );
};
