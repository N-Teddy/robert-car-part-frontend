// src/components/orders/OrdersList.tsx
import React from 'react';
import { Eye, Edit2, Trash2, ShoppingCart, CheckCircle } from 'lucide-react';
import type { OrderResponse } from '../../types/response/order';
import { formatCurrency } from '../../utils/formatCurrency';
import { format } from 'date-fns';
import { StatusBadge } from './StatusBadge';

interface OrdersListProps {
    orders: OrderResponse[];
    loading: boolean;
    onView: (order: OrderResponse) => void;
    onEdit: (order: OrderResponse) => void;
    onDelete: (order: OrderResponse) => void;
    onComplete: (order: OrderResponse) => void;
}

export const OrdersList: React.FC<OrdersListProps> = ({
    orders,
    loading,
    onView,
    onEdit,
    onDelete,
    onComplete,
}) => {
    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="animate-pulse space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex space-x-4">
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
                <p className="text-sm text-gray-500">Create your first order to get started</p>
            </div>
        );
    }

    const canEdit = (status: string) => {
        return status !== 'COMPLETED' && status !== 'CANCELLED';
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Order ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Items
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Delivery
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-mono text-gray-900">
                                        #{order.id.slice(0, 8).toUpperCase()}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {order.customerName}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {order.customerPhone}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <span className="text-sm text-gray-900">
                                            {order.items.length}
                                        </span>
                                        <span className="ml-1 text-xs text-gray-500">
                                            {order.items.length === 1 ? 'item' : 'items'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm font-semibold text-gray-900">
                                        {formatCurrency(order.totalAmount)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={order.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            order.deliveryMethod === 'PICKUP'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-purple-100 text-purple-800'
                                        }`}
                                    >
                                        {order.deliveryMethod === 'PICKUP'
                                            ? '🏪 Pickup'
                                            : '🚚 Shipping'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {format(new Date(order.createdAt), 'HH:mm')}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="flex items-center justify-center space-x-1">
                                        <button
                                            onClick={() => onView(order)}
                                            className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                            title="View"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        {canEdit(order.status) && (
                                            <button
                                                onClick={() => onEdit(order)}
                                                className="p-1.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                        )}
                                        {onComplete && (
                                            <button
                                                onClick={() => onComplete(order)}
                                                className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                        )}
                                        {order.status === 'PENDING' && (
                                            <button
                                                onClick={() => onDelete(order)}
                                                className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                title="Cancel"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
