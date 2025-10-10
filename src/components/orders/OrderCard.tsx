// src/components/orders/OrderCard.tsx
import React, { useState } from 'react';
import {
    ShoppingCart,
    User,
    Phone,
    Calendar,
    Package,
    DollarSign,
    Eye,
    Edit2,
    XCircle,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    CheckCircle,
} from 'lucide-react';
import type { OrderResponse } from '../../types/response/order';
import { formatCurrency } from '../../utils/formatCurrency';
import { format, formatDistanceToNow } from 'date-fns';
import { StatusBadge } from './StatusBadge';

interface OrderCardProps {
    order: OrderResponse;
    onView: (order: OrderResponse) => void;
    onEdit: (order: OrderResponse) => void;
    onDelete: (order: OrderResponse) => void;
    onComplete: (order: OrderResponse) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
    order,
    onView,
    onEdit,
    onDelete,
    onComplete,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const canEdit = order.status !== 'COMPLETED' && order.status !== 'CANCELLED';
    const canCancel = order.status === 'PENDING';
    const canComplete = order.status !== 'COMPLETED' && order.status !== 'CANCELLED';

    const getStatusGradient = () => {
        switch (order.status) {
            case 'PENDING':
                return 'from-yellow-400 to-orange-400';
            case 'PROCESSING':
                return 'from-blue-400 to-indigo-400';
            case 'COMPLETED':
                return 'from-green-400 to-emerald-400';
            case 'CANCELLED':
                return 'from-red-400 to-pink-400';
            default:
                return 'from-gray-400 to-gray-500';
        }
    };

    const getDeliveryIcon = () => {
        return order.deliveryMethod === 'PICKUP' ? '🏪' : '🚚';
    };

    const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-lg">
            {/* Card Header with Gradient */}
            <div className={`h-2 bg-gradient-to-r ${getStatusGradient()}`} />

            {/* Main Content */}
            <div className="p-5">
                {/* Header Section */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <ShoppingCart className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-gray-900">
                                    Order #{order.id.slice(0, 8).toUpperCase()}
                                </h3>
                                <StatusBadge status={order.status} size="sm" />
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                                {formatDistanceToNow(new Date(order.createdAt), {
                                    addSuffix: true,
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={() => onView(order)}
                            className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                        >
                            <Eye size={18} />
                        </button>
                        {canComplete && (
                            <button
                                onClick={() => onComplete(order)}
                                className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Complete Order"
                            >
                                <CheckCircle size={18} />
                            </button>
                        )}
                        {canEdit && (
                            <button
                                onClick={() => onEdit(order)}
                                className="p-1.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                title="Edit Order"
                            >
                                <Edit2 size={18} />
                            </button>
                        )}
                        {canCancel && (
                            <button
                                onClick={() => onDelete(order)}
                                className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Cancel Order"
                            >
                                <XCircle size={18} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Customer Info */}
                <div className="p-3 mb-4 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <User className="w-4 h-4 text-gray-500" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    {order.customerName}
                                </p>
                                <p className="text-xs text-gray-500 flex items-center mt-0.5">
                                    <Phone className="w-3 h-3 mr-1" />
                                    {order.customerPhone}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Delivery</p>
                            <p className="text-sm font-medium text-gray-900">
                                {getDeliveryIcon()}{' '}
                                {order.deliveryMethod === 'PICKUP' ? 'Pickup' : 'Shipping'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                            <Package className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{order.items.length}</p>
                        <p className="text-xs text-gray-500">Items</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                            <ShoppingCart className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
                        <p className="text-xs text-gray-500">Quantity</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-lg font-bold text-purple-600">
                            {formatCurrency(order.totalAmount)}
                        </p>
                        <p className="text-xs text-gray-500">Total</p>
                    </div>
                </div>

                {/* Expandable Items Section */}
                <div className="pt-3 border-t border-gray-200">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center justify-between w-full text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
                    >
                        <span>Order Items</span>
                        {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                        ) : (
                            <ChevronDown className="w-4 h-4" />
                        )}
                    </button>

                    {isExpanded && (
                        <div className="mt-3 space-y-2 animate-fadeIn">
                            {order.items.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
                                >
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs font-medium text-gray-500">
                                            {index + 1}.
                                        </span>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {item.part.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {item.quantity} × {formatCurrency(item.unitPrice)}
                                                {Number(item.discount) > 0 && (
                                                    <span className="text-red-600">
                                                        {' '}
                                                        - {formatCurrency(item.discount)}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {formatCurrency(item.total)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer with Date */}
                <div className="flex items-center justify-between pt-3 mt-4 border-t border-gray-100">
                    <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}
                    </div>
                    {order.notes && (
                        <div className="flex items-center text-xs text-gray-500">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Has notes
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
