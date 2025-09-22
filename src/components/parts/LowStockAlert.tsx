// src/components/parts/LowStockAlert.tsx
import React from 'react';
import { X, AlertTriangle, Package, Download, ShoppingCart } from 'lucide-react';
import type { Part } from '../../types/request/part';
import type { Vehicle } from '../../types/request/vehicle';
import type { Category } from '../../types/request/category';
import { formatCurrency } from '../../utils/formatCurrency';

interface LowStockAlertProps {
    isOpen: boolean;
    parts: Part[];
    vehicles: Vehicle[];
    categories: Category[];
    onClose: () => void;
}

export const LowStockAlert: React.FC<LowStockAlertProps> = ({
    isOpen,
    parts,
    vehicles,
    categories,
    onClose,
}) => {
    if (!isOpen) return null;

    const outOfStock = parts.filter(p => p.quantity === 0);
    const lowStock = parts.filter(p => p.quantity > 0 && p.quantity < 5);

    const handleExport = () => {
        const csvContent = [
            ['Part Name', 'Part Number', 'Vehicle', 'Category', 'Current Stock', 'Status', 'Price'],
            ...parts.map(p => [
                p.name,
                p.partNumber,
                vehicles.find(v => v.id === p.vehicleId)?.make + ' ' +
                vehicles.find(v => v.id === p.vehicleId)?.model || '',
                categories.find(c => c.id === p.categoryId)?.name || '',
                p.quantity,
                p.quantity === 0 ? 'Out of Stock' : 'Low Stock',
                p.price
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `low_stock_alert_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                                <AlertTriangle className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    Low Stock Alert
                                </h2>
                                <p className="text-sm text-white/80 mt-0.5">
                                    {parts.length} parts need attention
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(80vh-140px)]">
                    {/* Out of Stock Section */}
                    {outOfStock.length > 0 && (
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center mb-4">
                                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Critical - Out of Stock ({outOfStock.length})
                                </h3>
                            </div>
                            <div className="space-y-3">
                                {outOfStock.map(part => {
                                    const vehicle = vehicles.find(v => v.id === part.vehicleId);
                                    const category = categories.find(c => c.id === part.categoryId);

                                    return (
                                        <div key={part.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    {part.images && part.images.length > 0 ? (
                                                        <img
                                                            src={part.images[0].url}
                                                            alt={part.name}
                                                            className="w-12 h-12 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                                                            <Package className="w-6 h-6 text-red-400" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-semibold text-gray-900">
                                                            {part.name}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            #{part.partNumber} • {vehicle?.make} {vehicle?.model} • {category?.name}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        0 units
                                                    </span>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {formatCurrency(part.price)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Low Stock Section */}
                    {lowStock.length > 0 && (
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Low Stock - Less than 5 units ({lowStock.length})
                                </h3>
                            </div>
                            <div className="space-y-3">
                                {lowStock.map(part => {
                                    const vehicle = vehicles.find(v => v.id === part.vehicleId);
                                    const category = categories.find(c => c.id === part.categoryId);

                                    return (
                                        <div key={part.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    {part.images && part.images.length > 0 ? (
                                                        <img
                                                            src={part.images[0].url}
                                                            alt={part.name}
                                                            className="w-12 h-12 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                                                            <Package className="w-6 h-6 text-yellow-400" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-semibold text-gray-900">
                                                            {part.name}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            #{part.partNumber} • {vehicle?.make} {vehicle?.model} • {category?.name}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                        {part.quantity} units
                                                    </span>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {formatCurrency(part.price)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {parts.length === 0 && (
                        <div className="p-12 text-center">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No low stock items found</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                        >
                            Close
                        </button>
                        <div className="flex space-x-2">
                            <button
                                onClick={handleExport}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium transition-colors flex items-center"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export List
                            </button>
                            <button
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors flex items-center"
                            >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Create Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};