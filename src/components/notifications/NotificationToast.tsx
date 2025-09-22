// src/components/notifications/NotificationToast.tsx
import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, Package, ShoppingCart, FileText } from 'lucide-react';
import type { Notification } from '../../types/request/notification';
import { useNavigate } from 'react-router-dom';

interface NotificationToastProps {
    notification: Notification;
    onClose: () => void;
    onAction?: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
    notification,
    onClose,
    onAction,
}) => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const getIcon = () => {
        const iconClass = "w-5 h-5";
        switch (notification.type) {
            case 'PART_LOW_STOCK':
                return <AlertTriangle className={`${iconClass} text-yellow-500`} />;
            case 'ORDER_COMPLETED':
                return <CheckCircle className={`${iconClass} text-green-500`} />;
            case 'ORDER_CREATED':
            case 'ORDER_UPDATED':
                return <ShoppingCart className={`${iconClass} text-blue-500`} />;
            case 'PART_CREATED':
            case 'PART_UPDATED':
                return <Package className={`${iconClass} text-orange-500`} />;
            case 'REPORT_READY':
                return <FileText className={`${iconClass} text-indigo-500`} />;
            default:
                return <Info className={`${iconClass} text-gray-500`} />;
        }
    };

    const handleAction = () => {
        onAction?.();

        // Navigate based on notification type
        if (notification.metadata?.orderId) {
            navigate(`/orders/${notification.metadata.orderId}`);
        } else if (notification.metadata?.partId) {
            navigate(`/inventory/${notification.metadata.partId}`);
        } else if (notification.metadata?.reportId) {
            navigate(`/reports/${notification.metadata.reportId}`);
        } else if (notification.metadata?.userId) {
            navigate(`/users/${notification.metadata.userId}`);
        }

        onClose();
    };

    return (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
            <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 max-w-sm w-96">
                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                        {getIcon()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                            {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                        </p>
                        <div className="mt-3 flex items-center space-x-2">
                            <button
                                onClick={handleAction}
                                className="text-xs font-medium text-red-600 hover:text-red-700"
                            >
                                View Details
                            </button>
                            <span className="text-gray-300">•</span>
                            <button
                                onClick={onClose}
                                className="text-xs font-medium text-gray-500 hover:text-gray-700"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 text-gray-400 hover:text-gray-500"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationToast;
