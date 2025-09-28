// src/components/parts/PartsGrid.tsx
import React from 'react';
import { PartCard } from './PartCard';
import type { Part } from '../../types/request/part';
import type { Vehicle } from '../../types/request/vehicle';
import type { Category } from '../../types/request/category';
import { Package, Car, FolderOpen } from 'lucide-react';

interface PartsGridProps {
    parts: Part[];
    loading: boolean;
    groupedParts: Record<string, Part[]> | null;
    groupBy: 'none' | 'vehicle' | 'category';
    vehicles: Vehicle[];
    categories: Category[];
    onView: (part: Part) => void;
    onEdit: (part: Part) => void;
    onDelete: (part: Part) => void;
}

export const PartsGrid: React.FC<PartsGridProps> = ({
    parts,
    loading,
    groupedParts,
    groupBy,
    vehicles,
    categories,
    onView,
    onEdit,
    onDelete,
}) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse"
                    >
                        <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ))}
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

    // Render grouped parts
    if (groupedParts && groupBy !== 'none') {
        return (
            <div className="space-y-6">
                {Object.entries(groupedParts).map(([groupId, groupParts]) => {
                    const groupName =
                        groupBy === 'vehicle'
                            ? vehicles.find((v) => v.id === groupId)
                                ? `${vehicles.find((v) => v.id === groupId)!.make} ${vehicles.find((v) => v.id === groupId)!.model} (${vehicles.find((v) => v.id === groupId)!.year})`
                                : 'Unknown Vehicle'
                            : categories.find((c) => c.id === groupId)?.name || 'Unknown Category';

                    return (
                        <div key={groupId}>
                            <div className="flex items-center mb-3">
                                {groupBy === 'vehicle' ? (
                                    <Car className="w-5 h-5 text-gray-600 mr-2" />
                                ) : (
                                    <FolderOpen className="w-5 h-5 text-gray-600 mr-2" />
                                )}
                                <h3 className="text-lg font-semibold text-gray-900">{groupName}</h3>
                                <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                    {groupParts.length} parts
                                </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {groupParts.map((part) => (
                                    <PartCard
                                        key={part.id}
                                        part={part}
                                        vehicle={vehicles.find((v) => v.id === part.vehicleId)}
                                        category={categories.find((c) => c.id === part.categoryId)}
                                        onView={onView}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    // Render ungrouped parts
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {parts.map((part) => (
                <PartCard
                    key={part.id}
                    part={part}
                    vehicle={vehicles.find((v) => v.id === part.vehicleId)}
                    category={categories.find((c) => c.id === part.categoryId)}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};
