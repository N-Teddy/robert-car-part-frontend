// src/components/vehicles/VehicleGrid.tsx
import React from 'react';
import { VehicleCard } from './VehicleCard';
import type { Vehicle } from '../../types/request/vehicle';
import { Car } from 'lucide-react';

interface VehicleGridProps {
    vehicles: Vehicle[];
    loading: boolean;
    onView: (vehicle: Vehicle) => void;
    onEdit: (vehicle: Vehicle) => void;
    onDelete: (vehicle: Vehicle) => void;
    onMarkAsPartedOut: (vehicle: Vehicle) => void;
}

export const VehicleGrid: React.FC<VehicleGridProps> = ({
    vehicles,
    loading,
    onView,
    onEdit,
    onDelete,
    onMarkAsPartedOut,
}) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse">
                        <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (vehicles.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No vehicles found</h3>
                <p className="text-sm text-gray-500">
                    Try adjusting your filters or add a new vehicle
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {vehicles.map((vehicle) => (
                <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onMarkAsPartedOut={onMarkAsPartedOut}
                />
            ))}
        </div>
    );
};
