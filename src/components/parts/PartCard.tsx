// src/components/parts/PartCard.tsx
import React, { useState } from 'react';
import {
    Eye,
    Edit2,
    Trash2,
    Package,
    DollarSign,
    Hash,
    Car,
    FolderOpen,
    QrCode,
    AlertTriangle,
} from 'lucide-react';
import type { Part } from '../../types/request/part';
import type { Vehicle } from '../../types/request/vehicle';
import type { Category } from '../../types/request/category';
import { formatCurrency } from '../../utils/formatCurrency';
import { QRCodeDisplay } from './QRCodeDisplay';

interface PartCardProps {
    part: Part;
    vehicle?: Vehicle;
    category?: Category;
    onView: (part: Part) => void;
    onEdit: (part: Part) => void;
    onDelete: (part: Part) => void;
}

export const PartCard: React.FC<PartCardProps> = ({
    part,
    vehicle,
    category,
    onView,
    onEdit,
    onDelete,
}) => {
    const [showQR, setShowQR] = useState(false);

    const getStockStatus = () => {
        if (part.quantity === 0) {
            return { color: 'red', text: 'Out of Stock', icon: '🔴' };
        } else if (part.quantity < 5) {
            return { color: 'yellow', text: 'Low Stock', icon: '🟡' };
        }
        return { color: 'green', text: 'In Stock', icon: '🟢' };
    };

    const stockStatus = getStockStatus();

    const getConditionBadge = () => {
        switch (part.condition) {
            case 'New':
                return 'bg-blue-100 text-blue-700';
            case 'Used':
                return 'bg-gray-100 text-gray-700';
            case 'Refurbished':
                return 'bg-purple-100 text-purple-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Image Section with QR Code */}
            <div className="relative h-48 bg-gray-100">
                {part.images && part.images.length > 0 ? (
                    <>
                        <img
                            src={part.images[0].url}
                            alt={part.name}
                            className="w-full h-full object-cover"
                        />
                        {part.images.length > 1 && (
                            <div className="absolute bottom-2 left-2 flex space-x-1">
                                {part.images.slice(0, 5).map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-2 h-2 rounded-full ${
                                            idx === 0 ? 'bg-white' : 'bg-white/60'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">No image</p>
                        </div>
                    </div>
                )}

                {/* QR Code Button */}
                <button
                    onClick={() => setShowQR(!showQR)}
                    className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-colors"
                    title="Show QR Code"
                >
                    <QrCode className="w-4 h-4 text-gray-700" />
                </button>

                {/* Stock Status Badge */}
                <div className="absolute top-2 left-2">
                    <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center ${
                            stockStatus.color === 'red'
                                ? 'bg-red-100 text-red-700'
                                : stockStatus.color === 'yellow'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-green-100 text-green-700'
                        }`}
                    >
                        <span className="mr-1">{stockStatus.icon}</span>
                        {part.quantity} units
                    </span>
                </div>

                {/* QR Code Overlay */}
                {showQR && (
                    <div
                        className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setShowQR(false)}
                    >
                        <QRCodeDisplay
                            partId={part.id}
                            name={part.name}
                            price={part.price}
                            createdAt={part.createdAt}
                        />
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-4">
                <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{part.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                        <Hash className="w-3 h-3 mr-1" />
                        {part.partNumber}
                    </p>
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium">{formatCurrency(part.price)}</span>
                    </div>

                    {vehicle && (
                        <div className="flex items-center text-sm text-gray-600">
                            <Car className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="truncate">
                                {vehicle.make} {vehicle.model} ({vehicle.year})
                            </span>
                        </div>
                    )}

                    {category && (
                        <div className="flex items-center text-sm text-gray-600">
                            <FolderOpen className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="truncate">{category.name}</span>
                        </div>
                    )}
                </div>

                {/* Condition Badge */}
                {part.condition && (
                    <div className="mb-3">
                        <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getConditionBadge()}`}
                        >
                            {part.condition}
                        </span>
                    </div>
                )}

                {/* Low Stock Warning */}
                {stockStatus.color === 'yellow' && (
                    <div className="mb-3 flex items-center text-xs text-yellow-700 bg-yellow-50 rounded p-2">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Low stock - reorder soon
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex space-x-1">
                        <button
                            onClick={() => onView(part)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                        >
                            <Eye size={18} />
                        </button>
                        <button
                            onClick={() => onEdit(part)}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit"
                        >
                            <Edit2 size={18} />
                        </button>
                        <button
                            onClick={() => onDelete(part)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                    <span
                        className={`text-xs font-semibold ${
                            stockStatus.color === 'red'
                                ? 'text-red-600'
                                : stockStatus.color === 'yellow'
                                  ? 'text-yellow-600'
                                  : 'text-green-600'
                        }`}
                    >
                        {stockStatus.text}
                    </span>
                </div>
            </div>
        </div>
    );
};
