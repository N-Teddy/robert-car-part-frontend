// src/components/vehicles/VehicleCard.tsx
import React from 'react';
import { Eye, Edit2, Trash2, Calendar, DollarSign, Tag } from 'lucide-react';
import type { Vehicle } from '../../types/request/vehicle';
import { formatCurrency } from '../../utils/formatCurrency';
import { format } from 'date-fns';
import { maskVIN } from '../../utils/maskVin';

interface VehicleCardProps {
    vehicle: Vehicle;
    onView: (vehicle: Vehicle) => void;
    onEdit: (vehicle: Vehicle) => void;
    onDelete: (vehicle: Vehicle) => void;
    onMarkAsPartedOut: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
    vehicle,
    onView,
    onEdit,
    onDelete,
    onMarkAsPartedOut,
}) => {
    const [showMenu, setShowMenu] = React.useState(false);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Image Section */}
            <div className="relative h-48 bg-gray-100">
                {vehicle.images && vehicle.images.length > 0 ? (
                    <>
                        <img
                            src={vehicle.images[0].url}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            className="w-full h-full object-cover"
                        />
                        {vehicle.images.length > 1 && (
                            <div className="absolute bottom-2 left-2 flex space-x-1">
                                {vehicle.images.slice(0, 5).map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-white' : 'bg-white/60'
                                            }`}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="text-2xl">🚗</span>
                            </div>
                            <p className="text-xs text-gray-500">No image</p>
                        </div>
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${vehicle.isPartedOut
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                        {vehicle.isPartedOut ? '🔧 Parted Out' : '✅ Active'}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4">
                <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-sm text-gray-600">
                        {vehicle.year} | {maskVIN(vehicle.vin)}
                    </p>
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium">{formatCurrency(vehicle.purchasePrice)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span>Purchased: {format(new Date(vehicle.purchaseDate), 'MMM dd, yyyy')}</span>
                    </div>
                    {vehicle.auctionName && (
                        <div className="flex items-center text-sm text-gray-600">
                            <Tag className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="truncate">{vehicle.auctionName}</span>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex space-x-1">
                        <button
                            onClick={() => onView(vehicle)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                        >
                            <Eye size={18} />
                        </button>
                        <button
                            onClick={() => onEdit(vehicle)}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit"
                        >
                            <Edit2 size={18} />
                        </button>
                        <button
                            onClick={() => onDelete(vehicle)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                    <button
                        onClick={() => onMarkAsPartedOut(vehicle)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${vehicle.isPartedOut
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                            }`}
                    >
                        {vehicle.isPartedOut ? 'Mark Active' : 'Mark Parted'}
                    </button>
                </div>
            </div>
        </div>
    );
};
