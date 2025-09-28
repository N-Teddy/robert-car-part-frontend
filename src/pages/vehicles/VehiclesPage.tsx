// src/pages/vehicles/VehiclesPage.tsx
import React, { useState, useMemo } from 'react';
import { Plus, Download, Car, DollarSign } from 'lucide-react';
import { VehicleGrid } from '../../components/vehicles/VehicleGrid';
import { VehicleTable } from '../../components/vehicles/VehicleTable';
import { VehicleFormModal } from '../../components/vehicles/VehicleFormModal';
import { VehicleViewModal } from '../../components/vehicles/VehicleViewModal';
import { VehicleDeleteModal } from '../../components/vehicles/VehicleDeleteModal';
import { VehicleStats } from '../../components/vehicles/VehicleStats';
import { VehicleFilters } from '../../components/vehicles/VehicleFilters';
import { Button } from '../../components/ui/Button';
import type { Vehicle, VehicleFilterDto } from '../../types/request/vehicle';
import { formatCurrency } from '../../utils/formatCurrency';
import { useVehicle } from '../../hooks/vehicleHook';
import NotificationToast from '../../components/notifications/NotificationToast';

type ViewMode = 'grid' | 'list';

export const VehiclesPage: React.FC = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [filters, setFilters] = useState<VehicleFilterDto>({
        page: 1,
        limit: 12,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
    });

    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [toast, setToast] = useState<{ message: string; title: string } | null>(null);

    // Modal states
    const [modals, setModals] = useState({
        create: false,
        edit: false,
        view: false,
        delete: false,
    });

    // Hooks
    const {
        useGetAllVehicles,
        useCreateVehicle,
        useUpdateVehicle,
        useDeleteVehicle,
        useMarkAsPartedOut,
        useGetVehicleStatistics,
        useGetMakeModelStatistics,
    } = useVehicle();

    // Queries
    const { data: vehiclesData, isLoading, refetch } = useGetAllVehicles(filters);
    const { data: stats } = useGetVehicleStatistics();
    const { data: makeModelStats } = useGetMakeModelStatistics();

    // Mutations
    const createMutation = useCreateVehicle();
    const updateMutation = useUpdateVehicle();
    const deleteMutation = useDeleteVehicle();
    const markAsPartedOutMutation = useMarkAsPartedOut();

    // Calculate average price
    const averagePrice = useMemo(() => {
        if (!vehiclesData?.items?.length) return 0;
        const total = vehiclesData.items.reduce((sum, v) => sum + Number(v.purchasePrice), 0);
        return Math.round(total / vehiclesData.items.length);
    }, [vehiclesData]);

    // Handlers
    const handleFilterChange = (newFilters: Partial<VehicleFilterDto>) => {
        setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
    };

    const handlePageChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }));
    };

    const openModal = (modal: keyof typeof modals, vehicle?: Vehicle) => {
        if (vehicle) setSelectedVehicle(vehicle);
        setModals((prev) => ({ ...prev, [modal]: true }));
    };

    const closeModal = (modal: keyof typeof modals) => {
        setModals((prev) => ({ ...prev, [modal]: false }));
        if (modal !== 'view') setSelectedVehicle(null);
    };

    const handleCreate = async (data: any) => {
        try {
            await createMutation.mutateAsync(data);
            // setToast({ message: 'Vehicle created successfully', title: 'vehicle created' });
            closeModal('create');
            refetch();
        } catch (error: any) {
            setToast({
                message: error.message || 'Failed to create vehicle',
                title: 'Error Creating',
            });
        }
    };

    const handleUpdate = async (data: any) => {
        if (!selectedVehicle) return;
        try {
            await updateMutation.mutateAsync({ id: selectedVehicle.id, data });
            // setToast({ message: 'Vehicle updated successfully', title: 'Vehicle Updated' });
            closeModal('edit');
            refetch();
        } catch (error: any) {
            setToast({
                message: error.message || 'Failed to update vehicle',
                title: 'Error Updating',
            });
        }
    };

    const handleDelete = async () => {
        if (!selectedVehicle) return;
        try {
            await deleteMutation.mutateAsync(selectedVehicle.id);
            // setToast({ message: 'Vehicle deleted successfully', title: 'success' });
            closeModal('delete');
            refetch();
        } catch (error: any) {
            setToast({
                message: error.message || 'Failed to delete vehicle',
                title: 'Error Deleting',
            });
        }
    };

    const handleMarkAsPartedOut = async (vehicle: Vehicle) => {
        try {
            await markAsPartedOutMutation.mutateAsync(vehicle.id);
            setToast({
                message: `Vehicle marked as ${vehicle.isPartedOut ? 'active' : 'parted out'}`,
                title: 'Vehicle Updated',
            });
            refetch();
        } catch (error: any) {
            setToast({
                message: error.message || 'Failed to update vehicle status',
                title: 'Error Updating',
            });
        }
    };

    const handleExport = () => {
        if (!vehiclesData?.items?.length) return;

        const csvContent = [
            ['Make', 'Model', 'Year', 'VIN', 'Price (FCFA)', 'Purchase Date', 'Auction', 'Status'],
            ...vehiclesData.items.map((v) => [
                v.make,
                v.model,
                v.year,
                v.vin,
                v.purchasePrice,
                v.purchaseDate,
                v.auctionName || '',
                v.isPartedOut ? 'Parted Out' : 'Active',
            ]),
        ]
            .map((row) => row.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vehicles_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        setToast({ message: 'Vehicles exported successfully', title: 'Vehicles exported' });
    };

    return (
        <div className="px-4 py-8 sm:px-6 lg:px-8">
            {toast && <NotificationToast notification={toast} onClose={() => setToast(null)} />}

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="flex items-center text-2xl font-bold text-gray-900">
                            <Car className="w-8 h-8 mr-2 text-red-600" />
                            Vehicle Inventory
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage your vehicle fleet and track status
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
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
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Add Vehicle
                        </Button>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
                            <p className="mt-1 text-2xl font-bold text-gray-900">
                                {stats?.total || 0}
                            </p>
                        </div>
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                            <Car className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Active</p>
                            <p className="mt-1 text-2xl font-bold text-green-600">
                                {stats?.active || 0}
                            </p>
                        </div>
                        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Parted Out</p>
                            <p className="mt-1 text-2xl font-bold text-orange-600">
                                {stats?.partedOut || 0}
                            </p>
                        </div>
                        <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg">
                            <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Avg Price</p>
                            <p className="mt-1 text-2xl font-bold text-purple-600">
                                {formatCurrency(averagePrice)}
                            </p>
                        </div>
                        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                            <DollarSign className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and View Toggle */}
            <VehicleFilters
                onFilterChange={handleFilterChange}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
            />

            {/* Vehicle List/Grid */}
            {viewMode === 'grid' ? (
                <VehicleGrid
                    vehicles={vehiclesData?.items || []}
                    loading={isLoading}
                    onView={(vehicle) => openModal('view', vehicle)}
                    onEdit={(vehicle) => openModal('edit', vehicle)}
                    onDelete={(vehicle) => openModal('delete', vehicle)}
                    onMarkAsPartedOut={handleMarkAsPartedOut}
                />
            ) : (
                <VehicleTable
                    vehicles={vehiclesData?.items || []}
                    loading={isLoading}
                    onView={(vehicle) => openModal('view', vehicle)}
                    onEdit={(vehicle) => openModal('edit', vehicle)}
                    onDelete={(vehicle) => openModal('delete', vehicle)}
                    onMarkAsPartedOut={handleMarkAsPartedOut}
                />
            )}

            {/* Pagination */}
            {vehiclesData?.meta && vehiclesData.meta.totalPages > 1 && (
                <div className="flex items-center justify-center mt-6 space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!vehiclesData.meta.hasPrev}
                        onClick={() => handlePageChange(filters.page! - 1)}
                    >
                        Previous
                    </Button>
                    <span className="px-4 py-2 text-sm text-gray-700">
                        Page {filters.page} of {vehiclesData.meta.totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!vehiclesData.meta.hasNext}
                        onClick={() => handlePageChange(filters.page! + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}

            {/* Statistics Section */}
            <VehicleStats makeModelStats={makeModelStats} />

            {/* Modals */}
            <VehicleFormModal
                isOpen={modals.create}
                mode="create"
                onClose={() => closeModal('create')}
                onSubmit={handleCreate}
            />

            <VehicleFormModal
                isOpen={modals.edit}
                mode="edit"
                vehicle={selectedVehicle}
                onClose={() => closeModal('edit')}
                onSubmit={handleUpdate}
            />

            <VehicleViewModal
                isOpen={modals.view}
                vehicle={selectedVehicle}
                onClose={() => closeModal('view')}
                onEdit={() => {
                    closeModal('view');
                    openModal('edit', selectedVehicle!);
                }}
                onDelete={() => {
                    closeModal('view');
                    openModal('delete', selectedVehicle!);
                }}
                onMarkAsPartedOut={() => handleMarkAsPartedOut(selectedVehicle!)}
            />

            <VehicleDeleteModal
                isOpen={modals.delete}
                vehicle={selectedVehicle}
                onClose={() => closeModal('delete')}
                onConfirm={handleDelete}
            />
        </div>
    );
};
