// src/components/orders/OrderFilters.tsx
import React, { useState } from 'react';
import { Search, Filter, Calendar, Package, Truck, X } from 'lucide-react';
import { Button } from '../ui/Button';
import type { OrderQueryDto } from '../../types/request/order';
import type { OrderStatusEnum, DeliveryMethodEnum } from '../../types/enum';

interface OrderFiltersProps {
    onFilterChange: (filters: Partial<OrderQueryDto>) => void;
}

export const OrderFilters: React.FC<OrderFiltersProps> = ({ onFilterChange }) => {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<OrderStatusEnum | ''>('');
    const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethodEnum | ''>('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleSearch = (value: string) => {
        setSearch(value);
        // Debounced search
        const timer = setTimeout(() => {
            onFilterChange({
                customerName: value,
                customerPhone: value,
                customerEmail: value,
            });
        }, 500);
        return () => clearTimeout(timer);
    };

    const handleApplyFilters = () => {
        const filters: Partial<OrderQueryDto> = {
            status: status || undefined,
            deliveryMethod: deliveryMethod || undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
        };
        onFilterChange(filters);
    };

    const handleClearFilters = () => {
        setSearch('');
        setStatus('');
        setDeliveryMethod('');
        setStartDate('');
        setEndDate('');
        onFilterChange({
            status: undefined,
            deliveryMethod: undefined,
            startDate: undefined,
            endDate: undefined,
            customerName: undefined,
            customerPhone: undefined,
            customerEmail: undefined,
        });
    };

    const hasActiveFilters = search || status || deliveryMethod || startDate || endDate;

    const statusOptions: { value: OrderStatusEnum; label: string; color: string }[] = [
        { value: 'PENDING', label: 'Pending', color: 'text-yellow-600' },
        { value: 'PROCESSING', label: 'Processing', color: 'text-blue-600' },
        { value: 'COMPLETED', label: 'Completed', color: 'text-green-600' },
        { value: 'CANCELLED', label: 'Cancelled', color: 'text-red-600' },
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col space-y-4">
                {/* Main Filter Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by customer name, phone, or email..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        {/* Quick Status Filter */}
                        <select
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value as OrderStatusEnum | '');
                                onFilterChange({
                                    status: (e.target.value as OrderStatusEnum) || undefined,
                                });
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                            <option value="">All Status</option>
                            {statusOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>

                        <Button
                            variant="outline"
                            size="sm"
                            icon={<Filter size={16} />}
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className={showAdvanced ? 'bg-gray-100' : ''}
                        >
                            Filters
                            {hasActiveFilters && (
                                <span className="ml-1 px-1.5 py-0.5 text-xs bg-purple-600 text-white rounded-full">
                                    {
                                        [status, deliveryMethod, startDate, endDate].filter(Boolean)
                                            .length
                                    }
                                </span>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Advanced Filters */}
                {showAdvanced && (
                    <div className="pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    <Package className="inline w-3 h-3 mr-1" />
                                    Order Status
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) =>
                                        setStatus(e.target.value as OrderStatusEnum | '')
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                >
                                    <option value="">All Status</option>
                                    {statusOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    <Truck className="inline w-3 h-3 mr-1" />
                                    Delivery Method
                                </label>
                                <select
                                    value={deliveryMethod}
                                    onChange={(e) =>
                                        setDeliveryMethod(e.target.value as DeliveryMethodEnum | '')
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                >
                                    <option value="">All Methods</option>
                                    <option value="PICKUP">Pickup</option>
                                    <option value="SHIPPING">Shipping</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    <Calendar className="inline w-3 h-3 mr-1" />
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    <Calendar className="inline w-3 h-3 mr-1" />
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 mt-4">
                            <Button variant="outline" size="sm" onClick={handleClearFilters}>
                                Clear
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleApplyFilters}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                Apply Filters
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
