// src/components/parts/PartFilters.tsx
import React, { useState } from 'react';
import { Search, Grid3x3, List, Filter, X, Package, Car, FolderOpen, Layers } from 'lucide-react';
import { Button } from '../ui/Button';
import type { PartFilterDto } from '../../types/request/part';
import type { Vehicle } from '../../types/request/vehicle';
import type { Category } from '../../types/request/category';

interface PartFiltersProps {
    onFilterChange: (filters: Partial<PartFilterDto>) => void;
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
    groupBy: 'none' | 'vehicle' | 'category';
    onGroupByChange: (groupBy: 'none' | 'vehicle' | 'category') => void;
    vehicles: Vehicle[];
    categories: Category[];
}

export const PartFilters: React.FC<PartFiltersProps> = ({
    onFilterChange,
    viewMode,
    onViewModeChange,
    groupBy,
    onGroupByChange,
    vehicles,
    categories,
}) => {
    const [search, setSearch] = useState('');
    const [vehicleId, setVehicleId] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [condition, setCondition] = useState('');
    const [stockStatus, setStockStatus] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minQuantity, setMinQuantity] = useState('');
    const [maxQuantity, setMaxQuantity] = useState('');

    const handleSearch = (value: string) => {
        setSearch(value);
        onFilterChange({ search: value });
    };

    const handleApplyFilters = () => {
        const filters: Partial<PartFilterDto> = {
            vehicleId: vehicleId || undefined,
            categoryId: categoryId || undefined,
            condition: condition || undefined,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            minQuantity: minQuantity ? Number(minQuantity) : undefined,
            maxQuantity: maxQuantity ? Number(maxQuantity) : undefined,
            lowStock: stockStatus === 'low' ? true : undefined,
            outOfStock: stockStatus === 'out' ? true : undefined,
        };
        onFilterChange(filters);
    };

    const handleClearFilters = () => {
        setSearch('');
        setVehicleId('');
        setCategoryId('');
        setCondition('');
        setStockStatus('');
        setMinPrice('');
        setMaxPrice('');
        setMinQuantity('');
        setMaxQuantity('');
        onFilterChange({
            search: undefined,
            vehicleId: undefined,
            categoryId: undefined,
            condition: undefined,
            minPrice: undefined,
            maxPrice: undefined,
            minQuantity: undefined,
            maxQuantity: undefined,
            lowStock: undefined,
            outOfStock: undefined,
        });
    };

    const hasActiveFilters =
        search ||
        vehicleId ||
        categoryId ||
        condition ||
        stockStatus ||
        minPrice ||
        maxPrice ||
        minQuantity ||
        maxQuantity;

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
                                placeholder="Search by name, part number..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                                <span className="ml-1 px-1.5 py-0.5 text-xs bg-green-600 text-white rounded-full">
                                    {
                                        [
                                            vehicleId,
                                            categoryId,
                                            condition,
                                            stockStatus,
                                            minPrice,
                                            maxPrice,
                                            minQuantity,
                                            maxQuantity,
                                        ].filter(Boolean).length
                                    }
                                </span>
                            )}
                        </Button>

                        {/* Group By Selector */}
                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => onGroupByChange('none')}
                                className={`p-2 rounded text-xs font-medium transition-colors ${
                                    groupBy === 'none'
                                        ? 'bg-white text-green-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                                title="No Grouping"
                            >
                                <Layers size={16} />
                            </button>
                            <button
                                onClick={() => onGroupByChange('vehicle')}
                                className={`p-2 rounded text-xs font-medium transition-colors ${
                                    groupBy === 'vehicle'
                                        ? 'bg-white text-green-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                                title="Group by Vehicle"
                            >
                                <Car size={16} />
                            </button>
                            <button
                                onClick={() => onGroupByChange('category')}
                                className={`p-2 rounded text-xs font-medium transition-colors ${
                                    groupBy === 'category'
                                        ? 'bg-white text-green-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                                title="Group by Category"
                            >
                                <FolderOpen size={16} />
                            </button>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => onViewModeChange('grid')}
                                className={`p-2 rounded transition-colors ${
                                    viewMode === 'grid'
                                        ? 'bg-white text-green-600 shadow-sm'
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
                                        ? 'bg-white text-green-600 shadow-sm'
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Vehicle
                                </label>
                                <select
                                    value={vehicleId}
                                    onChange={(e) => setVehicleId(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="">All Vehicles</option>
                                    {vehicles.map((v) => (
                                        <option key={v.id} value={v.id}>
                                            {v.make} {v.model} ({v.year})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Condition
                                </label>
                                <select
                                    value={condition}
                                    onChange={(e) => setCondition(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="">All Conditions</option>
                                    <option value="New">New</option>
                                    <option value="Used">Used</option>
                                    <option value="Refurbished">Refurbished</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Stock Status
                                </label>
                                <select
                                    value={stockStatus}
                                    onChange={(e) => setStockStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="">All Status</option>
                                    <option value="in">In Stock</option>
                                    <option value="low">Low Stock</option>
                                    <option value="out">Out of Stock</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Min Price (FCFA)
                                </label>
                                <input
                                    type="number"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    placeholder="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Max Price (FCFA)
                                </label>
                                <input
                                    type="number"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    placeholder="999999"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Min Quantity
                                </label>
                                <input
                                    type="number"
                                    value={minQuantity}
                                    onChange={(e) => setMinQuantity(e.target.value)}
                                    placeholder="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Max Quantity
                                </label>
                                <input
                                    type="number"
                                    value={maxQuantity}
                                    onChange={(e) => setMaxQuantity(e.target.value)}
                                    placeholder="999"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
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
                                className="bg-green-600 hover:bg-green-700"
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
