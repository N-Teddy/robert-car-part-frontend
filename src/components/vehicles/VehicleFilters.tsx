// src/components/vehicles/VehicleFilters.tsx
import React, { useState } from 'react';
import { Search, Grid3x3, List, Filter } from 'lucide-react';
import { Button } from '../ui/Button';
import type { VehicleFilterDto } from '../../types/request/vehicle';

interface VehicleFiltersProps {
    onFilterChange: (filters: Partial<VehicleFilterDto>) => void;
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
}

export const VehicleFilters: React.FC<VehicleFiltersProps> = ({
    onFilterChange,
    viewMode,
    onViewModeChange,
}) => {
    const [search, setSearch] = useState('');
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [minYear, setMinYear] = useState('');
    const [maxYear, setMaxYear] = useState('');
    const [status, setStatus] = useState<'all' | 'active' | 'parted'>('all');
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleSearch = (value: string) => {
        setSearch(value);
        onFilterChange({ search: value });
    };

    const handleApplyFilters = () => {
        const filters: Partial<VehicleFilterDto> = {
            make: make || undefined,
            model: model || undefined,
            minYear: minYear ? Number(minYear) : undefined,
            maxYear: maxYear ? Number(maxYear) : undefined,
            isPartedOut: status === 'all' ? undefined : status === 'parted',
        };
        onFilterChange(filters);
    };

    const handleClearFilters = () => {
        setSearch('');
        setMake('');
        setModel('');
        setMinYear('');
        setMaxYear('');
        setStatus('all');
        onFilterChange({
            search: undefined,
            make: undefined,
            model: undefined,
            minYear: undefined,
            maxYear: undefined,
            isPartedOut: undefined,
        });
    };

    const hasActiveFilters = search || make || model || minYear || maxYear || status !== 'all';

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col space-y-4">
                {/* Main Filter Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by VIN, Make, Model..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            icon={<Filter size={16} />}
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className={showAdvanced ? 'bg-gray-100' : ''}
                        >
                            Filters
                            {hasActiveFilters && (
                                <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-600 text-white rounded-full">
                                    {
                                        [make, model, minYear, maxYear, status !== 'all'].filter(
                                            Boolean
                                        ).length
                                    }
                                </span>
                            )}
                        </Button>

                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => onViewModeChange('grid')}
                                className={`p-2 rounded transition-colors ${
                                    viewMode === 'grid'
                                        ? 'bg-white text-red-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                                title="Grid View"
                            >
                                <Grid3x3 size={18} />
                            </button>
                            <button
                                onClick={() => onViewModeChange('list')}
                                className={`p-2 rounded transition-colors ${
                                    viewMode === 'list'
                                        ? 'bg-white text-red-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                                title="List View"
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Advanced Filters */}
                {showAdvanced && (
                    <div className="pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Make
                                </label>
                                <input
                                    type="text"
                                    value={make}
                                    onChange={(e) => setMake(e.target.value)}
                                    placeholder="e.g., Toyota"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Model
                                </label>
                                <input
                                    type="text"
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    placeholder="e.g., Camry"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Min Year
                                </label>
                                <input
                                    type="number"
                                    value={minYear}
                                    onChange={(e) => setMinYear(e.target.value)}
                                    placeholder="2000"
                                    min="1900"
                                    max={new Date().getFullYear()}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Max Year
                                </label>
                                <input
                                    type="number"
                                    value={maxYear}
                                    onChange={(e) => setMaxYear(e.target.value)}
                                    placeholder="2024"
                                    min="1900"
                                    max={new Date().getFullYear()}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as any)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                >
                                    <option value="all">All</option>
                                    <option value="active">Active</option>
                                    <option value="parted">Parted Out</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 mt-4">
                            <Button variant="outline" size="sm" onClick={handleClearFilters}>
                                Clear
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleApplyFilters}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Apply Filters
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
