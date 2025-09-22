// src/components/parts/PartStats.tsx
import React from 'react';
import { Package, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import type { CategoryStats } from '../../types/response/part';
import { formatCurrency } from '../../utils/formatCurrency';

interface PartStatsProps {
    categoryStats?: CategoryStats[];
}

export const PartStats: React.FC<PartStatsProps> = ({ categoryStats }) => {
    if (!categoryStats || categoryStats.length === 0) {
        return null;
    }

    // Sort and get top categories
    const sortedStats = [...categoryStats].sort((a, b) => Number(b.count) - Number(a.count));
    const topCategories = sortedStats.slice(0, 5);
    const maxCount = Number(topCategories[0].count);

    // Calculate total value
    const totalValue = categoryStats.reduce((sum, cat) => sum + Number(cat.totalValue), 0);

    return (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Parts by Category */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Parts by Category</h3>
                    <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                    {topCategories.map((stat, index) => {
                        const percentage = (Number(stat.count) / maxCount) * 100;
                        const value = Number(stat.totalValue);

                        return (
                            <div key={stat.categoryName}>
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium text-gray-700">
                                            {index + 1}. {stat.categoryName}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-semibold text-gray-900">
                                            {stat.count} parts
                                        </span>
                                        <span className="text-xs text-gray-500 ml-2">
                                            {formatCurrency(value)}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
                {categoryStats.length > 5 && (
                    <p className="text-xs text-gray-500 mt-4">
                        +{categoryStats.length - 5} more categories
                    </p>
                )}
            </div>

            {/* Value Distribution */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Value Distribution</h3>
                    <DollarSign className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200">
                        <p className="text-sm text-purple-600 font-medium">Total Inventory Value</p>
                        <p className="text-2xl font-bold text-purple-900 mt-1">
                            {formatCurrency(totalValue)}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {topCategories.slice(0, 4).map((stat) => {
                            const valuePercentage = (Number(stat.totalValue) / totalValue) * 100;
                            return (
                                <div key={stat.categoryName} className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-600 truncate">{stat.categoryName}</p>
                                    <p className="text-sm font-semibold text-gray-900 mt-1">
                                        {formatCurrency(stat.totalValue)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {valuePercentage.toFixed(1)}% of total
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};