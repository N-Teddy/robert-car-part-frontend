// src/components/parts/PartsList.tsx
import React from 'react';
import { Eye, Edit2, Trash2, Package, QrCode } from 'lucide-react';
import type { Part } from '../../types/request/part';
import type { Vehicle } from '../../types/request/vehicle';
import type { Category } from '../../types/request/category';
import { formatCurrency } from '../../utils/formatCurrency';

interface PartsListProps {
    parts: Part[];
    loading: boolean;
    vehicles: Vehicle[];
    categories: Category[];
    onView: (part: Part) => void;
    onEdit: (part: Part) => void;
    onDelete: (part: Part) => void;
}

export const PartsList: React.FC<PartsListProps> = ({
    parts,
    loading,
    vehicles,
    categories,
    onView,
    onEdit,
    onDelete,
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

    if (parts.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No parts found</h3>
                <p className="text-sm text-gray-500">
                    Try adjusting your filters or add a new part
                </p>
            </div>
        );
    }

    const getStockStatusBadge = (quantity: number) => {
        if (quantity === 0) {
            return (
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                    Out of Stock
                </span>
            );
        } else if (quantity < 5) {
            return (
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">
                    Low Stock
                </span>
            );
        }
        return (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                In Stock
            </span>
        );
    };

    const getConditionBadge = (condition: string | null) => {
        if (!condition) return null;
        const colors = {
            New: 'bg-blue-100 text-blue-700',
            Used: 'bg-gray-100 text-gray-700',
            Refurbished: 'bg-purple-100 text-purple-700',
        };
        return (
            <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${colors[condition as keyof typeof colors] || 'bg-gray-100 text-gray-700'}`}
            >
                {condition}
            </span>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Image
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Part Details
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Vehicle
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stock
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Condition
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {parts.map((part) => {
                            const vehicle = vehicles.find((v) => v.id === part.vehicleId);
                            const category = categories.find((c) => c.id === part.categoryId);

                            return (
                                <tr key={part.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {part.images && part.images.length > 0 ? (
                                            <img
                                                src={part.images[0].url}
                                                alt={part.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <Package className="w-6 h-6 text-gray-400" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {part.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                #{part.partNumber}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {vehicle ? (
                                            <div className="text-sm text-gray-900">
                                                {vehicle.make} {vehicle.model}
                                                <div className="text-xs text-gray-500">
                                                    {vehicle.year}
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-500">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900">
                                            {category?.name || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-gray-900">
                                            {formatCurrency(part.price)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col items-start">
                                            <span className="text-sm text-gray-900 mb-1">
                                                {part.quantity} units
                                            </span>
                                            {getStockStatusBadge(part.quantity)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getConditionBadge(part.condition)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex items-center justify-center space-x-1">
                                            <button
                                                onClick={() => onView(part)}
                                                className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                title="View"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => onEdit(part)}
                                                className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(part)}
                                                className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
