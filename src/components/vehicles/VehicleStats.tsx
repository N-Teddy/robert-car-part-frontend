// src/components/vehicles/VehicleStats.tsx
import React from 'react';
import { TrendingUp, TrendingDown, Car, Wrench } from 'lucide-react';

interface VehicleStatsProps {
    makeModelStats?: {
        ByMake: { make: string; count: string }[];
        ByModel: { model: string; count: string }[];
    };
}

export const VehicleStats: React.FC<VehicleStatsProps> = ({ makeModelStats }) => {
    if (!makeModelStats || (!makeModelStats.ByMake?.length && !makeModelStats.ByModel?.length)) {
        return null;
    }

    // Sort and get top 5
    const topMakes = makeModelStats.ByMake
        ?.sort((a, b) => Number(b.count) - Number(a.count))
        .slice(0, 5) || [];

    const topModels = makeModelStats.ByModel
        ?.sort((a, b) => Number(b.count) - Number(a.count))
        .slice(0, 5) || [];

    const maxMakeCount = topMakes.length > 0 ? Number(topMakes[0].count) : 1;
    const maxModelCount = topModels.length > 0 ? Number(topModels[0].count) : 1;

    return (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Makes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Top Makes</h3>
                    <Car className="w-5 h-5 text-gray-400" />
                </div>
                {topMakes.length > 0 ? (
                    <div className="space-y-3">
                        {topMakes.map((item, index) => {
                            const percentage = (Number(item.count) / maxMakeCount) * 100;
                            return (
                                <div key={item.make} className="flex items-center">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700">
                                                {index + 1}. {item.make}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {item.count} vehicles
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm">No data available</p>
                )}
            </div>

            {/* Top Models */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Top Models</h3>
                    <Wrench className="w-5 h-5 text-gray-400" />
                </div>
                {topModels.length > 0 ? (
                    <div className="space-y-3">
                        {topModels.map((item, index) => {
                            const percentage = (Number(item.count) / maxModelCount) * 100;
                            return (
                                <div key={item.model} className="flex items-center">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700">
                                                {index + 1}. {item.model}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {item.count} vehicles
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm">No data available</p>
                )}
            </div>
        </div>
    );
};
