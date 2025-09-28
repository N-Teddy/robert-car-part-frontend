// src/components/orders/StatusBadge.tsx
import React from 'react';
import { Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import type { OrderStatusEnum } from '../../types/enum';

interface StatusBadgeProps {
    status: OrderStatusEnum;
    size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
    const getStatusConfig = () => {
        switch (status) {
            case 'PENDING':
                return {
                    icon: Clock,
                    label: 'Pending',
                    className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
                };
            case 'PROCESSING':
                return {
                    icon: AlertCircle,
                    label: 'Processing',
                    className: 'bg-blue-100 text-blue-700 border-blue-200',
                };
            case 'COMPLETED':
                return {
                    icon: CheckCircle,
                    label: 'Completed',
                    className: 'bg-green-100 text-green-700 border-green-200',
                };
            case 'CANCELLED':
                return {
                    icon: XCircle,
                    label: 'Cancelled',
                    className: 'bg-red-100 text-red-700 border-red-200',
                };
            default:
                return {
                    icon: Clock,
                    label: status,
                    className: 'bg-gray-100 text-gray-700 border-gray-200',
                };
        }
    };

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
    };

    const iconSizes = {
        sm: 12,
        md: 14,
        lg: 16,
    };

    const config = getStatusConfig();
    const Icon = config.icon;

    return (
        <span
            className={`inline-flex items-center font-medium rounded-full border ${config.className} ${sizeClasses[size]}`}
        >
            <Icon size={iconSizes[size]} className="mr-1" />
            {config.label}
        </span>
    );
};
