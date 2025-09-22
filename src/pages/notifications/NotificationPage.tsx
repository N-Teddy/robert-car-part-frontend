// src/pages/notifications/NotificationsPage.tsx
import React, { useState, useMemo } from 'react';
import {
    Bell,
    CheckCheck,
    Trash2,
    Clock,
    Package,
    ShoppingCart,
    AlertTriangle,
    User,
    FileText,
    Settings,
    Search,
    ChevronRight,
    Volume2,
    VolumeX
} from 'lucide-react';
import { formatDistanceToNow, isToday, isYesterday, isThisWeek } from 'date-fns';
import { useNotificationContext } from '../../context/NotificationContext';
import { useNotification } from '../../hooks/notificationHook';
import type { NotificationTypeEnum } from '../../types/enum';
import { Button } from '../../components/ui/Button';
import type { Notification } from '../../types/request/notification';
import type { DecodedToken } from '../../types/authContext';
import { jwtDecode } from 'jwt-decode';

export const NotificationsPage: React.FC = () => {
    const { markAsRead, markAllAsRead, deleteNotification, soundEnabled, setSoundEnabled } = useNotificationContext();
    const { useGetNotifications } = useNotification();

    const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | NotificationTypeEnum>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

    const token = JSON.parse(localStorage.getItem("authToken") || "null");
    const decoded = jwtDecode<DecodedToken>(token.accessToken);


    const filters = {
        page,
        limit: 20,
        isRead: selectedFilter === 'unread' ? false : undefined,
        type: !['all', 'unread'].includes(selectedFilter) ? selectedFilter as NotificationTypeEnum : undefined,
        search: searchTerm || undefined,
        userId: decoded.sub
    };

    const { data, isLoading, refetch } = useGetNotifications(filters);
    const notifications = data?.items || [];

    // Group notifications by date
    const groupedNotifications = useMemo(() => {
        const groups: Record<string, Notification[]> = {
            today: [],
            yesterday: [],
            thisWeek: [],
            older: [],
        };

        notifications.forEach(notification => {
            const date = new Date(notification.createdAt);
            if (isToday(date)) {
                groups.today.push(notification);
            } else if (isYesterday(date)) {
                groups.yesterday.push(notification);
            } else if (isThisWeek(date)) {
                groups.thisWeek.push(notification);
            } else {
                groups.older.push(notification);
            }
        });

        return groups;
    }, [notifications]);

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

    const handleBulkAction = async (action: 'read' | 'delete') => {
        if (selectedNotifications.length === 0) return;

        if (action === 'read') {
            await markAsRead(selectedNotifications);
        } else {
            selectedNotifications.forEach(id => deleteNotification(id));
        }

        setSelectedNotifications([]);
        refetch();
    };

    const filterOptions = [
        { value: 'all', label: 'All', icon: Bell },
        { value: 'unread', label: 'Unread', icon: Clock },
        { value: 'SYSTEM_UPDATE', label: 'System', icon: Settings },
        { value: 'ORDER_CREATED', label: 'Orders', icon: ShoppingCart },
        { value: 'PART_LOW_STOCK', label: 'Inventory', icon: Package },
    ];

    const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
        const isSelected = selectedNotifications.includes(notification.id);

        return (
            <div
                className={`group flex items-start space-x-3 p-4 hover:bg-gray-50 transition-colors border-l-4 ${!notification.isRead
                        ? 'bg-blue-50/30 border-blue-500'
                        : 'bg-white border-transparent'
                    }`}
            >
                {/* Checkbox */}
                <div className="flex-shrink-0 pt-1">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setSelectedNotifications([...selectedNotifications, notification.id]);
                            } else {
                                setSelectedNotifications(selectedNotifications.filter(id => id !== notification.id));
                            }
                        }}
                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                </div>

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
                            <p className="text-sm text-gray-600 mt-0.5">
                                {notification.message}
                            </p>
                            <div className="flex items-center mt-2 space-x-4">
                                <span className="flex items-center text-xs text-gray-500">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                </span>
                                {notification.metadata?.orderId && (
                                    <span className="text-xs text-blue-600 font-medium">
                                        Order #{notification.metadata.orderId.slice(0, 8)}
                                    </span>
                                )}
                                {notification.metadata?.partId && (
                                    <span className="text-xs text-green-600 font-medium">
                                        Part #{notification.metadata.partId.slice(0, 8)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notification.isRead && (
                                <button
                                    onClick={() => markAsRead([notification.id])}
                                    className="text-gray-400 hover:text-gray-600"
                                    title="Mark as read"
                                >
                                    <CheckCheck size={16} />
                                </button>
                            )}
                            <button
                                onClick={() => deleteNotification(notification.id)}
                                className="text-gray-400 hover:text-red-600"
                                title="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                            <button
                                className="text-gray-400 hover:text-gray-600"
                                title="View details"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Stay updated with system activities and alerts
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        {/* Sound Toggle */}
                        <button
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className={`p-2 rounded-lg transition-colors ${soundEnabled
                                    ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                }`}
                            title={soundEnabled ? 'Sound enabled' : 'Sound disabled'}
                        >
                            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                        </button>

                        {/* Mark All Read */}
                        {notifications.some(n => !n.isRead) && (
                            <Button
                                variant="outline"
                                size="sm"
                                icon={<CheckCheck size={16} />}
                                onClick={markAllAsRead}
                            >
                                Mark All Read
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Filters */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Filters</h3>

                        {/* Search */}
                        <div className="mb-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search notifications..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                />
                            </div>
                        </div>

                        {/* Filter Options */}
                        <div className="space-y-1">
                            {filterOptions.map((option) => {
                                const Icon = option.icon;
                                const isActive = selectedFilter === option.value;
                                const unreadCount = option.value === 'unread'
                                    ? notifications.filter(n => !n.isRead).length
                                    : 0;

                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => setSelectedFilter(option.value as any)}
                                        className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${isActive
                                                ? 'bg-red-50 text-red-700 font-medium'
                                                : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <Icon size={16} />
                                            <span>{option.label}</span>
                                        </div>
                                        {unreadCount > 0 && (
                                            <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Statistics</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Total</span>
                                <span className="text-sm font-medium text-gray-900">{data?.meta?.total || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Unread</span>
                                <span className="text-sm font-medium text-blue-600">
                                    {notifications.filter(n => !n.isRead).length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Today</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {groupedNotifications.today.length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        {/* Bulk Actions Bar */}
                        {selectedNotifications.length > 0 && (
                            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700">
                                        {selectedNotifications.length} selected
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleBulkAction('read')}
                                        >
                                            Mark as Read
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 hover:text-red-700"
                                            onClick={() => handleBulkAction('delete')}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications */}
                        {isLoading ? (
                            <div className="p-8">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="animate-pulse mb-4">
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
                            <div className="p-12 text-center">
                                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications</h3>
                                <p className="text-sm text-gray-500">
                                    {searchTerm ? 'No notifications match your search' : 'You\'re all caught up!'}
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {/* Today */}
                                {groupedNotifications.today.length > 0 && (
                                    <>
                                        <div className="px-4 py-2 bg-gray-50">
                                            <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Today
                                            </h4>
                                        </div>
                                        {groupedNotifications.today.map(notification => (
                                            <NotificationItem key={notification.id} notification={notification} />
                                        ))}
                                    </>
                                )}

                                {/* Yesterday */}
                                {groupedNotifications.yesterday.length > 0 && (
                                    <>
                                        <div className="px-4 py-2 bg-gray-50">
                                            <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Yesterday
                                            </h4>
                                        </div>
                                        {groupedNotifications.yesterday.map(notification => (
                                            <NotificationItem key={notification.id} notification={notification} />
                                        ))}
                                    </>
                                )}

                                {/* This Week */}
                                {groupedNotifications.thisWeek.length > 0 && (
                                    <>
                                        <div className="px-4 py-2 bg-gray-50">
                                            <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                This Week
                                            </h4>
                                        </div>
                                        {groupedNotifications.thisWeek.map(notification => (
                                            <NotificationItem key={notification.id} notification={notification} />
                                        ))}
                                    </>
                                )}

                                {/* Older */}
                                {groupedNotifications.older.length > 0 && (
                                    <>
                                        <div className="px-4 py-2 bg-gray-50">
                                            <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Older
                                            </h4>
                                        </div>
                                        {groupedNotifications.older.map(notification => (
                                            <NotificationItem key={notification.id} notification={notification} />
                                        ))}
                                    </>
                                )}
                            </div>
                        )}

                        {/* Pagination */}
                        {data?.meta && data.meta.totalPages > 1 && (
                            <div className="px-4 py-3 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700">
                                        Page {page} of {data.meta.totalPages}
                                    </span>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={!data.meta.hasPrev}
                                            onClick={() => setPage(page - 1)}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={!data.meta.hasNext}
                                            onClick={() => setPage(page + 1)}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
