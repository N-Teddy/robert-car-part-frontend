// src/components/notifications/NotificationDropdown.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
    Bell,
    CheckCheck,
    Clock,
    Package,
    ShoppingCart,
    AlertTriangle,
    User,
    FileText,
    Settings,
    ChevronRight
} from 'lucide-react';
import type { Notification } from '../../types/request/notification';
import { formatDistanceToNow } from 'date-fns';
import { useNotificationContext } from '../../context/NotificationContext';
import { useNotification } from '../../hooks/notificationHook';

interface NotificationDropdownProps {
    onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
    const { markAsRead, markAllAsRead } = useNotificationContext();
    const { useGetNotifications } = useNotification();

    const { data, isLoading } = useGetNotifications({
        limit: 5,
        page: 1,
    });

    const notifications = data?.items || [];

    const getNotificationIcon = (type: string) => {
        const iconClass = "w-5 h-5";
        const iconMap: Record<string, React.ReactNode> = {
            'PART_LOW_STOCK': <AlertTriangle className={`${iconClass} text-yellow-500`} />,
            'PART_CREATED': <Package className={`${iconClass} text-blue-500`} />,
            'PART_UPDATED': <Package className={`${iconClass} text-blue-500`} />,
            'PART_SOLD': <Package className={`${iconClass} text-green-500`} />,
            'ORDER_CREATED': <ShoppingCart className={`${iconClass} text-indigo-500`} />,
            'ORDER_COMPLETED': <ShoppingCart className={`${iconClass} text-green-500`} />,
            'ORDER_CANCELLED': <ShoppingCart className={`${iconClass} text-red-500`} />,
            'USER_UPDATED': <User className={`${iconClass} text-purple-500`} />,
            'REPORT_READY': <FileText className={`${iconClass} text-indigo-500`} />,
            'SYSTEM_UPDATE': <Settings className={`${iconClass} text-gray-500`} />,
        };
        return iconMap[type] || <Bell className={`${iconClass} text-gray-500`} />;
    };

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.isRead) {
            await markAsRead([notification.id]);
        }
        onClose();
    };

    const getNotificationLink = (notification: Notification): string => {
        if (notification.metadata?.orderId) return `/orders/${notification.metadata.orderId}`;
        if (notification.metadata?.partId) return `/inventory/${notification.metadata.partId}`;
        if (notification.metadata?.userId) return `/users/${notification.metadata.userId}`;
        if (notification.metadata?.reportId) return `/reports/${notification.metadata.reportId}`;
        return '/notifications';
    };

    return (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-200">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                        {notifications.some(n => !n.isRead) && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center space-x-1"
                            >
                                <CheckCheck size={14} />
                                <span>Mark all read</span>
                            </button>
                        )}
                        <Link
                            to="/notifications"
                            onClick={onClose}
                            className="text-xs text-gray-600 hover:text-gray-900 font-medium"
                        >
                            See All
                        </Link>
                    </div>
                </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                    <div className="p-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse mb-3">
                                <div className="flex space-x-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-8 text-center">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">No notifications yet</p>
                        <p className="text-xs text-gray-400 mt-1">We'll notify you when something arrives</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => (
                            <Link
                                key={notification.id}
                                to={getNotificationLink(notification)}
                                onClick={() => handleNotificationClick(notification)}
                                className={`block px-4 py-3 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-blue-50/50' : ''
                                    }`}
                            >
                                <div className="flex space-x-3">
                                    {/* Icon */}
                                    <div className="flex-shrink-0">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${!notification.isRead ? 'bg-blue-100' : 'bg-gray-100'
                                            }`}>
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
                                                    }`}>
                                                    {notification.title}
                                                </p>
                                                <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center mt-1 space-x-2">
                                                    <Clock className="w-3 h-3 text-gray-400" />
                                                    <span className="text-xs text-gray-500">
                                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                    </span>
                                                </div>
                                            </div>
                                            {!notification.isRead && (
                                                <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-1.5 ml-2"></span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
                <Link
                    to="/notifications"
                    onClick={onClose}
                    className="block px-4 py-3 text-center text-sm font-medium text-red-600 hover:text-red-700 border-t border-gray-200 hover:bg-gray-50 transition-colors"
                >
                    <span className="flex items-center justify-center space-x-1">
                        <span>View All Notifications</span>
                        <ChevronRight size={16} />
                    </span>
                </Link>
            )}
        </div>
    );
};
