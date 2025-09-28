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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md overflow-hidden bg-white rounded-lg shadow-xl">
                {/* Header */}
                <div className="px-6 py-6 bg-red-50">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                        <div className="flex-1 ml-4">
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
                    <div className="p-4 rounded-lg bg-gray-50">
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                {vehicle.images && vehicle.images.length > 0 ? (
                                    <img
                                        src={vehicle.images[0].url}
                                        alt={`${vehicle.make} ${vehicle.model}`}
                                        className="object-cover w-16 h-16 rounded-lg"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-lg">
                                        <Car className="w-8 h-8 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900">
                                    {vehicle.make} {vehicle.model} ({vehicle.year})
                                </p>
                                <p className="text-sm text-gray-600">VIN: {maskVIN(vehicle.vin)}</p>
                                <p className="mt-1 text-xs text-gray-500">
                                    Status: {vehicle.isPartedOut ? 'Parted Out' : 'Active'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 mt-4 border rounded-lg bg-amber-50 border-amber-200">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <AlertTriangle className="w-5 h-5 text-amber-600" />
                            </div>
                            <div className="ml-3">
                                <h4 className="text-sm font-medium text-amber-800">Warning</h4>
                                <div className="mt-1 text-sm text-amber-700">
                                    <p>Deleting this vehicle will:</p>
                                    <ul className="mt-1 list-disc list-inside">
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
                <div className="flex justify-end px-6 py-4 space-x-3 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                    >
                        <Trash2 className="inline w-4 h-4 mr-1" />
                        Delete Vehicle
                    </button>
                </div>
            </div>
        </div>
    );
};
