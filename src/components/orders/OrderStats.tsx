// src/components/orders/OrderStats.tsx
import React from 'react';
import { TrendingUp, Package, DollarSign, BarChart3, PieChart } from 'lucide-react';
import type { OrderStatsResponse } from '../../types/response/order';
import { formatCurrency } from '../../utils/formatCurrency';

interface OrderStatsProps {
    stats?: OrderStatsResponse;
}

export const OrderStats: React.FC<OrderStatsProps> = ({ stats }) => {
    if (!stats) return null;

    const statusColors = {
        PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-700', bar: 'bg-yellow-500' },
        PROCESSING: { bg: 'bg-blue-100', text: 'text-blue-700', bar: 'bg-blue-500' },
        COMPLETED: { bg: 'bg-green-100', text: 'text-green-700', bar: 'bg-green-500' },
        CANCELLED: { bg: 'bg-red-100', text: 'text-red-700', bar: 'bg-red-500' },
    };

    const deliveryColors = {
        PICKUP: { bg: 'bg-purple-100', text: 'text-purple-700', bar: 'bg-purple-500' },
        SHIPPING: { bg: 'bg-indigo-100', text: 'text-indigo-700', bar: 'bg-indigo-500' },
    };

    const maxStatusCount = Math.max(...(stats.ordersByStatus?.map(s => s.count) || [1]));
    const maxDeliveryCount = Math.max(...(stats.ordersByDeliveryMethod?.map(d => d.count) || [1]));

    return (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Orders by Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Orders by Status</h3>
                    <PieChart className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                    {stats.ordersByStatus?.map((item) => {
                        const percentage = (item.count / stats.totalOrders) * 100;
                        const colors = statusColors[item.status as keyof typeof statusColors];

                        return (
                            <div key={item.status}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`text-sm font-medium ${colors.text} ${colors.bg} px-2 py-1 rounded`}>
                                        {item.status}
                                    </span>
                                    <div className="text-right">
                                        <span className="text-sm font-semibold text-gray-900">
                                            {item.count} orders
                                        </span>
                                        <span className="text-xs text-gray-500 ml-2">
                                            ({percentage.toFixed(1)}%)
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`${colors.bar} h-2 rounded-full transition-all duration-500`}
                                        style={{ width: `${(item.count / maxStatusCount) * 100}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Delivery Methods */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Delivery Methods</h3>
                    <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                    {stats.ordersByDeliveryMethod?.map((item) => {
                        const percentage = (item.count / stats.totalOrders) * 100;
                        const colors = deliveryColors[item.method as keyof typeof deliveryColors];

                        return (
                            <div key={item.method}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`text-sm font-medium ${colors.text} ${colors.bg} px-2 py-1 rounded`}>
                                        {item.method === 'PICKUP' ? '🏪 Pickup' : '🚚 Shipping'}
                                    </span>
                                    <div className="text-right">
                                        <span className="text-sm font-semibold text-gray-900">
                                            {item.count} orders
                                        </span>
                                        <span className="text-xs text-gray-500 ml-2">
                                            ({percentage.toFixed(1)}%)
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`${colors.bar} h-2 rounded-full transition-all duration-500`}
                                        style={{ width: `${(item.count / maxDeliveryCount) * 100}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Average Order Value */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-purple-600 font-medium">Average Order Value</p>
                                <p className="text-2xl font-bold text-purple-900 mt-1">
                                    {formatCurrency(stats.averageOrderValue || 0)}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-200/50 rounded-lg">
                                <DollarSign className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};