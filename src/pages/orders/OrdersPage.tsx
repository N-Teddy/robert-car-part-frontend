// src/pages/orders/OrdersPage.tsx
import React, { useState, useMemo } from 'react';
import {
    ShoppingCart,
    Plus,
    Search,
    Download,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    DollarSign,
    Filter,
    Calendar,
    Package,
    Copy,
} from 'lucide-react';
import { OrderFormModal } from '../../components/orders/OrderFormModal';
import { OrderViewModal } from '../../components/orders/OrderViewModal';
import { OrderDeleteModal } from '../../components/orders/OrderDeleteModal';
import { OrderFilters } from '../../components/orders/OrderFilters';
import { OrderStats } from '../../components/orders/OrderStats';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import type { OrderQueryDto } from '../../types/request/order';
import type { OrderResponse } from '../../types/response/order';
import { formatCurrency } from '../../utils/formatCurrency';
import { useOrder } from '../../hooks/orderHook';
import { usePart } from '../../hooks/partHook';
import { OrdersList } from '../../components/orders/OrderList';

export const OrdersPage: React.FC = () => {
    const [filters, setFilters] = useState<OrderQueryDto>({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
    });

    const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Modal states
    const [modals, setModals] = useState({
        create: false,
        edit: false,
        view: false,
        delete: false,
    });

    // Customer data for autocomplete
    const [savedCustomers, setSavedCustomers] = useState<
        Array<{
            name: string;
            phone: string;
            email: string;
        }>
    >([]);

    // Hooks
    const {
        useGetAllOrders,
        useGetOrderById,
        useCreateOrder,
        useUpdateOrder,
        useDeleteOrder,
        useGetOrderStats,
        useGenerateReceipt,
    } = useOrder();

    const { useGetAllParts } = usePart();

    // Queries
    const { data: ordersData, isLoading, refetch } = useGetAllOrders(filters);
    const { data: stats } = useGetOrderStats();
    const { data: partsData } = useGetAllParts({ limit: 100 });

    // Mutations
    const createMutation = useCreateOrder();
    const updateMutation = useUpdateOrder();
    const deleteMutation = useDeleteOrder();
    const receiptMutation = useGenerateReceipt();

    // Extract unique customers from orders for autocomplete
    useMemo(() => {
        if (ordersData?.items) {
            const customers = new Map();
            ordersData.items.forEach((order) => {
                if (!customers.has(order.customerPhone)) {
                    customers.set(order.customerPhone, {
                        name: order.customerName,
                        phone: order.customerPhone,
                        email: order.customerEmail,
                    });
                }
            });
            setSavedCustomers(Array.from(customers.values()));
        }
    }, [ordersData]);

    // Handlers
    const handleFilterChange = (newFilters: Partial<OrderQueryDto>) => {
        setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
    };

    const handlePageChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }));
    };

    const openModal = (modal: keyof typeof modals, order?: OrderResponse) => {
        if (order) setSelectedOrder(order);
        setModals((prev) => ({ ...prev, [modal]: true }));
    };

    const closeModal = (modal: keyof typeof modals) => {
        setModals((prev) => ({ ...prev, [modal]: false }));
        if (modal !== 'view') setSelectedOrder(null);
    };

    const handleCreate = async (data: any) => {
        try {
            await createMutation.mutateAsync(data);
            setToast({ message: 'Order created successfully', type: 'success' });
            closeModal('create');
            refetch();
        } catch (error: any) {
            setToast({ message: error.message || 'Failed to create order', type: 'error' });
        }
    };

    const handleUpdate = async (data: any) => {
        if (!selectedOrder) return;
        try {
            await updateMutation.mutateAsync({ id: selectedOrder.id, data });
            setToast({ message: 'Order updated successfully', type: 'success' });
            closeModal('edit');
            refetch();
        } catch (error: any) {
            setToast({ message: error.message || 'Failed to update order', type: 'error' });
        }
    };

    const handleDelete = async () => {
        if (!selectedOrder) return;
        try {
            await deleteMutation.mutateAsync(selectedOrder.id);
            setToast({ message: 'Order cancelled successfully', type: 'success' });
            closeModal('delete');
            refetch();
        } catch (error: any) {
            setToast({ message: error.message || 'Failed to cancel order', type: 'error' });
        }
    };

    const handleDuplicate = (order: OrderResponse) => {
        // Pre-fill create form with order data
        const duplicateData = {
            customerName: order.customerName,
            customerPhone: order.customerPhone,
            customerEmail: order.customerEmail,
            deliveryMethod: order.deliveryMethod,
            notes: order.notes,
            items: order.items.map((item) => ({
                partId: item.part.id,
                quantity: item.quantity,
                unitPrice: Number(item.unitPrice),
                discount: Number(item.discount),
            })),
        };
        // Open create modal with pre-filled data
        openModal('create');
        // You'll need to pass this data to the form modal
    };

    const handleExport = () => {
        if (!ordersData?.items?.length) return;

        const csvContent = [
            ['Order ID', 'Date', 'Customer', 'Phone', 'Items', 'Total', 'Status', 'Delivery'],
            ...ordersData.items.map((order) => [
                order.id.slice(0, 8),
                new Date(order.createdAt).toLocaleDateString(),
                order.customerName,
                order.customerPhone,
                order.items.length,
                order.totalAmount,
                order.status,
                order.deliveryMethod,
            ]),
        ]
            .map((row) => row.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        setToast({ message: 'Orders exported successfully', type: 'success' });
    };

    // Calculate quick stats
    const todayOrders =
        ordersData?.items.filter((order) => {
            const orderDate = new Date(order.createdAt).toDateString();
            const today = new Date().toDateString();
            return orderDate === today;
        }).length || 0;

    const todayRevenue =
        ordersData?.items
            .filter((order) => {
                const orderDate = new Date(order.createdAt).toDateString();
                const today = new Date().toDateString();
                return orderDate === today && order.status === 'COMPLETED';
            })
            .reduce((sum, order) => sum + Number(order.totalAmount), 0) || 0;

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
                            <ShoppingCart className="w-8 h-8 mr-2 text-purple-600" />
                            Order Management
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Track sales and manage customer orders
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
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            New Order
                        </Button>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {stats?.totalOrders || 0}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{todayOrders} today</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                            <p className="text-2xl font-bold text-yellow-600 mt-1">
                                {stats?.pendingOrders || 0}
                            </p>
                            {stats?.pendingOrders > 0 && (
                                <p className="text-xs text-yellow-600 mt-1">Needs attention</p>
                            )}
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Completed Today</p>
                            <p className="text-2xl font-bold text-green-600 mt-1">
                                {stats?.completedOrders || 0}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {formatCurrency(todayRevenue)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                            <p className="text-2xl font-bold text-purple-600 mt-1">
                                {formatCurrency(stats?.totalRevenue || 0)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Avg: {formatCurrency(stats?.averageOrderValue || 0)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <OrderFilters onFilterChange={handleFilterChange} />

            {/* Orders List */}
            <OrdersList
                orders={ordersData?.items || []}
                loading={isLoading}
                onView={(order) => openModal('view', order)}
                onEdit={(order) => openModal('edit', order)}
                onDelete={(order) => openModal('delete', order)}
                onDuplicate={handleDuplicate}
            />

            {/* Pagination */}
            {ordersData?.meta && ordersData.meta.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!ordersData.meta.hasPrev}
                        onClick={() => handlePageChange(filters.page! - 1)}
                    >
                        Previous
                    </Button>
                    <span className="px-4 py-2 text-sm text-gray-700">
                        Page {filters.page} of {ordersData.meta.totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!ordersData.meta.hasNext}
                        onClick={() => handlePageChange(filters.page! + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}

            {/* Statistics Section */}
            <OrderStats stats={stats} />

            {/* Modals */}
            <OrderFormModal
                isOpen={modals.create}
                mode="create"
                parts={partsData?.items || []}
                savedCustomers={savedCustomers}
                onClose={() => closeModal('create')}
                onSubmit={handleCreate}
            />

            <OrderFormModal
                isOpen={modals.edit}
                mode="edit"
                order={selectedOrder}
                parts={partsData?.items || []}
                savedCustomers={savedCustomers}
                onClose={() => closeModal('edit')}
                onSubmit={handleUpdate}
            />

            <OrderViewModal
                isOpen={modals.view}
                order={selectedOrder}
                onClose={() => closeModal('view')}
                onEdit={() => {
                    closeModal('view');
                    openModal('edit', selectedOrder!);
                }}
                onDelete={() => {
                    closeModal('view');
                    openModal('delete', selectedOrder!);
                }}
                onDuplicate={() => {
                    closeModal('view');
                    handleDuplicate(selectedOrder!);
                }}
            />

            <OrderDeleteModal
                isOpen={modals.delete}
                order={selectedOrder}
                onClose={() => closeModal('delete')}
                onConfirm={handleDelete}
            />
        </div>
    );
};
