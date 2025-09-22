// src/components/vehicles/VehicleDeleteModal.tsx
import React from 'react';
import { AlertTriangle, X, Trash2, Car } from 'lucide-react';
import type { Vehicle } from '../../types/request/vehicle';
import { maskVIN } from '../../utils/maskVin';

interface VehicleDeleteModalProps {
    isOpen: boolean;
    vehicle: Vehicle | null;
    onClose: () => void;
    onConfirm: () => void;
}

export const VehicleDeleteModal: React.FC<VehicleDeleteModalProps> = ({
    isOpen,
    vehicle,
    onClose,
    onConfirm,
}) => {
    if (!isOpen || !vehicle) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
                {/* Header */}
                <div className="bg-red-50 px-6 py-6">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                        <div className="ml-4 flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Confirm Delete Vehicle
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">
                                This action cannot be undone. Please confirm your decision.
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="ml-4 text-gray-400 hover:text-gray-500"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                {vehicle.images && vehicle.images.length > 0 ? (
                                    <img
                                        src={vehicle.images[0].url}
                                        alt={`${vehicle.make} ${vehicle.model}`}
                                        className="w-16 h-16 rounded-lg object-cover"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                                        <Car className="w-8 h-8 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900">
                                    {vehicle.make} {vehicle.model} ({vehicle.year})
                                </p>
                                <p className="text-sm text-gray-600">
                                    VIN: {maskVIN(vehicle.vin)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Status: {vehicle.isPartedOut ? 'Parted Out' : 'Active'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <AlertTriangle className="w-5 h-5 text-amber-600" />
                            </div>
                            <div className="ml-3">
                                <h4 className="text-sm font-medium text-amber-800">
                                    Warning
                                </h4>
                                <div className="mt-1 text-sm text-amber-700">
                                    <p>Deleting this vehicle will:</p>
                                    <ul className="list-disc list-inside mt-1">
                                        <li>Remove all vehicle information</li>
                                        <li>Delete all associated images</li>
                                        <li>Remove any linked parts or inventory</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                    >
                        <Trash2 className="inline w-4 h-4 mr-1" />
                        Delete Vehicle
                    </button>
                </div>
            </div>
        </div>
    );
};