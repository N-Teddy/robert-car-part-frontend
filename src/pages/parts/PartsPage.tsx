// src/pages/parts/PartsPage.tsx
import React, { useState, useMemo } from 'react';
import {
    Package,
    Plus,
    Search,
    Grid3x3,
    List,
    Download,
    AlertTriangle,
    DollarSign,
    Archive,
    TrendingDown,
    Filter,
    QrCode,
    Camera,
} from 'lucide-react';
import { PartsGrid } from '../../components/parts/PartsGrid';
import { PartsList } from '../../components/parts/PartsList';
import { PartFormModal } from '../../components/parts/PartFormModal';
import { PartViewModal } from '../../components/parts/PartViewModal';
import { PartDeleteModal } from '../../components/parts/PartDeleteModal';
import { PartStats } from '../../components/parts/PartStats';
import { LowStockAlert } from '../../components/parts/LowStockAlert';
import { QRScannerModal } from '../../components/parts/QRScannerModal';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import type { Part, PartFilterDto } from '../../types/request/part';
import { formatCurrency } from '../../utils/formatCurrency';
import { useVehicle } from '../../hooks/vehicleHook';
import { useCategory } from '../../hooks/categoryHook';
import { usePart } from '../../hooks/partHook';
import { PartFilters } from '../../components/parts/PartsFilter';

type ViewMode = 'grid' | 'list';
type GroupBy = 'none' | 'vehicle' | 'category';

export const PartsPage: React.FC = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [groupBy, setGroupBy] = useState<GroupBy>('none');
    const [filters, setFilters] = useState<PartFilterDto>({
        page: 1,
        limit: 12,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
    });

    const [selectedPart, setSelectedPart] = useState<Part | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Modal states
    const [modals, setModals] = useState({
        create: false,
        edit: false,
        view: false,
        delete: false,
        lowStock: false,
        scanner: false,
    });

    // Hooks
    const {
        useGetAllParts,
        useGetPartById,
        useCreatePart,
        useUpdatePart,
        useDeletePart,
        useGetPartStatistics,
        useGetCategoryStatistics,
        useGetLowStockParts,
    } = usePart();

    const { useGetAllVehicles } = useVehicle();
    const { useGetAllCategories } = useCategory();

    // Queries
    const { data: partsData, isLoading, refetch } = useGetAllParts(filters);
    const { data: stats } = useGetPartStatistics();
    const { data: categoryStats } = useGetCategoryStatistics();
    const { data: lowStockParts } = useGetLowStockParts();
    const { data: vehiclesData } = useGetAllVehicles({ limit: 100, page: 1 });
    const { data: categoriesData } = useGetAllCategories({ limit: 100 });

    // Mutations
    const createMutation = useCreatePart();
    const updateMutation = useUpdatePart();
    const deleteMutation = useDeletePart();

    // Group parts by vehicle or category
    const groupedParts = useMemo(() => {
        if (!partsData?.items || groupBy === 'none') {
            return null;
        }

        const groups: Record<string, Part[]> = {};

        partsData.items.forEach((part) => {
            const key = groupBy === 'vehicle' ? part.vehicleId : part.categoryId;
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(part);
        });

        return groups;
    }, [partsData?.items, groupBy]);

    // Handlers
    const handleFilterChange = (newFilters: Partial<PartFilterDto>) => {
        setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
    };

    const handlePageChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }));
    };

    const openModal = (modal: keyof typeof modals, part?: Part) => {
        if (part) setSelectedPart(part);
        setModals((prev) => ({ ...prev, [modal]: true }));
    };

    const closeModal = (modal: keyof typeof modals) => {
        setModals((prev) => ({ ...prev, [modal]: false }));
        if (modal !== 'view') setSelectedPart(null);
    };

    const handleCreate = async (data: any) => {
        try {
            await createMutation.mutateAsync(data);
            setToast({ message: 'Part created successfully', type: 'success' });
            closeModal('create');
            refetch();
        } catch (error: any) {
            setToast({ message: error.message || 'Failed to create part', type: 'error' });
        }
    };

    const handleUpdate = async (data: any) => {
        if (!selectedPart) return;
        try {
            await updateMutation.mutateAsync({ id: selectedPart.id, data });
            setToast({ message: 'Part updated successfully', type: 'success' });
            closeModal('edit');
            refetch();
        } catch (error: any) {
            setToast({ message: error.message || 'Failed to update part', type: 'error' });
        }
    };

    const handleDelete = async () => {
        if (!selectedPart) return;
        try {
            await deleteMutation.mutateAsync(selectedPart.id);
            setToast({ message: 'Part deleted successfully', type: 'success' });
            closeModal('delete');
            refetch();
        } catch (error: any) {
            setToast({ message: error.message || 'Failed to delete part', type: 'error' });
        }
    };

    const handleQRScanned = (partId: string) => {
        const part = partsData?.items.find((p) => p.id === partId);
        if (part) {
            setSelectedPart(part);
            closeModal('scanner');
            openModal('view');
        } else {
            setToast({ message: 'Part not found', type: 'error' });
        }
    };

    const handleExport = () => {
        if (!partsData?.items?.length) return;

        const csvContent = [
            [
                'Name',
                'Part Number',
                'Vehicle',
                'Category',
                'Price (FCFA)',
                'Quantity',
                'Condition',
                'Status',
            ],
            ...partsData.items.map((p) => [
                p.name,
                p.partNumber,
                vehiclesData?.items.find((v) => v.id === p.vehicleId)?.make +
                    ' ' +
                    vehiclesData?.items.find((v) => v.id === p.vehicleId)?.model || '',
                categoriesData?.items.find((c) => c.id === p.categoryId)?.name || '',
                p.price,
                p.quantity,
                p.condition || 'N/A',
                p.quantity === 0 ? 'Out of Stock' : p.quantity < 5 ? 'Low Stock' : 'In Stock',
            ]),
        ]
            .map((row) => row.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `parts_inventory_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        setToast({ message: 'Parts exported successfully', type: 'success' });
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8">
            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                            <Package className="w-8 h-8 mr-2 text-green-600" />
                            Parts Inventory
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage your vehicle parts and track stock levels
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button
                            variant="outline"
                            size="sm"
                            icon={<QrCode size={16} />}
                            onClick={() => openModal('scanner')}
                        >
                            Scan QR
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            icon={<Download size={16} />}
                            onClick={handleExport}
                        >
                            Export
                        </Button>
                        <Button
                            variant="primary"
                            icon={<Plus size={20} />}
                            onClick={() => openModal('create')}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Add Part
                        </Button>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Parts</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {stats?.totalParts || 0}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Low Stock</p>
                            <p className="text-2xl font-bold text-yellow-600 mt-1">
                                {stats?.lowStockParts || 0}
                            </p>
                            {stats?.lowStockParts > 0 && (
                                <button
                                    onClick={() => openModal('lowStock')}
                                    className="text-xs text-yellow-600 hover:text-yellow-700 mt-1"
                                >
                                    View items →
                                </button>
                            )}
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                            <p className="text-2xl font-bold text-red-600 mt-1">
                                {stats?.outOfStockParts || 0}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <TrendingDown className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Value</p>
                            <p className="text-2xl font-bold text-purple-600 mt-1">
                                {formatCurrency(stats?.totalValue || 0)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            {lowStockParts && lowStockParts.length > 0 && (
                <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                            <span className="text-sm font-medium text-yellow-800">
                                {lowStockParts.length} parts need restocking
                            </span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openModal('lowStock')}
                            className="border-yellow-600 text-yellow-600 hover:bg-yellow-100"
                        >
                            View Low Stock Alert
                        </Button>
                    </div>
                </div>
            )}

            {/* Filters and View Controls */}
            <PartFilters
                onFilterChange={handleFilterChange}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                groupBy={groupBy}
                onGroupByChange={setGroupBy}
                vehicles={vehiclesData?.items || []}
                categories={categoriesData?.items || []}
            />

            {/* Parts Display */}
            {viewMode === 'grid' ? (
                <PartsGrid
                    parts={partsData?.items || []}
                    loading={isLoading}
                    groupedParts={groupedParts}
                    groupBy={groupBy}
                    vehicles={vehiclesData?.items || []}
                    categories={categoriesData?.items || []}
                    onView={(part) => openModal('view', part)}
                    onEdit={(part) => openModal('edit', part)}
                    onDelete={(part) => openModal('delete', part)}
                />
            ) : (
                <PartsList
                    parts={partsData?.items || []}
                    loading={isLoading}
                    vehicles={vehiclesData?.items || []}
                    categories={categoriesData?.items || []}
                    onView={(part) => openModal('view', part)}
                    onEdit={(part) => openModal('edit', part)}
                    onDelete={(part) => openModal('delete', part)}
                />
            )}

            {/* Pagination */}
            {partsData?.meta && partsData.meta.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!partsData.meta.hasPrev}
                        onClick={() => handlePageChange(filters.page! - 1)}
                    >
                        Previous
                    </Button>
                    <span className="px-4 py-2 text-sm text-gray-700">
                        Page {filters.page} of {partsData.meta.totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!partsData.meta.hasNext}
                        onClick={() => handlePageChange(filters.page! + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}

            {/* Statistics Section */}
            <PartStats categoryStats={categoryStats} />

            {/* Modals */}
            <PartFormModal
                isOpen={modals.create}
                mode="create"
                vehicles={vehiclesData?.items || []}
                categories={categoriesData?.items || []}
                onClose={() => closeModal('create')}
                onSubmit={handleCreate}
            />

            <PartFormModal
                isOpen={modals.edit}
                mode="edit"
                part={selectedPart}
                vehicles={vehiclesData?.items || []}
                categories={categoriesData?.items || []}
                onClose={() => closeModal('edit')}
                onSubmit={handleUpdate}
            />

            <PartViewModal
                isOpen={modals.view}
                part={selectedPart}
                vehicle={vehiclesData?.items.find((v) => v.id === selectedPart?.vehicleId)}
                category={categoriesData?.items.find((c) => c.id === selectedPart?.categoryId)}
                onClose={() => closeModal('view')}
                onEdit={() => {
                    closeModal('view');
                    openModal('edit', selectedPart!);
                }}
                onDelete={() => {
                    closeModal('view');
                    openModal('delete', selectedPart!);
                }}
            />

            <PartDeleteModal
                isOpen={modals.delete}
                part={selectedPart}
                onClose={() => closeModal('delete')}
                onConfirm={handleDelete}
            />

            <LowStockAlert
                isOpen={modals.lowStock}
                parts={lowStockParts || []}
                vehicles={vehiclesData?.items || []}
                categories={categoriesData?.items || []}
                onClose={() => closeModal('lowStock')}
            />

            <QRScannerModal
                isOpen={modals.scanner}
                onClose={() => closeModal('scanner')}
                onScan={handleQRScanned}
            />
        </div>
    );
};
