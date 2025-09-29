// src/components/orders/OrderViewModal.tsx
import React, { useState } from 'react';
import {
    X,
    ShoppingCart,
    User,
    Phone,
    Mail,
    Calendar,
    Truck,
    Package,
    DollarSign,
    FileText,
    Printer,
    Edit2,
    Copy,
    XCircle,
    Clock,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';
import type { OrderResponse } from '../../types/response/order';
import { formatCurrency } from '../../utils/formatCurrency';
import { format, formatDistanceToNow } from 'date-fns';
import { StatusBadge } from './StatusBadge';
import { OrderReceipt } from './OrderReceipt';

interface OrderViewModalProps {
    isOpen: boolean;
    order: OrderResponse | null;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onDuplicate: () => void;
}

export const OrderViewModal: React.FC<OrderViewModalProps> = ({
    isOpen,
    order,
    onClose,
    onEdit,
    onDelete,
    onDuplicate,
}) => {
    const [showReceipt, setShowReceipt] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(order?.status || 'PENDING');

    if (!isOpen || !order) return null;

    const canEdit = order.status !== 'COMPLETED' && order.status !== 'CANCELLED';

    const handlePrint = () => {
        setShowReceipt(true);
        setTimeout(() => {
            window.print();
        }, 100);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Clock className="w-5 h-5 text-yellow-600" />;
            case 'PROCESSING':
                return <AlertCircle className="w-5 h-5 text-blue-600" />;
            case 'COMPLETED':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'CANCELLED':
                return <XCircle className="w-5 h-5 text-red-600" />;
            default:
                return null;
        }
    };

    const calculateSubtotal = () => {
        return order.items.reduce((total, item) => {
            const itemTotal = item.quantity * Number(item.unitPrice);
            return total + itemTotal;
        }, 0);
    };

    const calculateDiscounts = () => {
        return order.items.reduce((total, item) => {
            return total + Number(item.discount || 0);
        }, 0);
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden">
                    {/* Header */}
                    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                        <div className="absolute inset-0 opacity-10">
                            <div
                                className="absolute inset-0"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                }}
                            />
                        </div>

                        <div className="relative px-6 py-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                                        <ShoppingCart className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">
                                            Order #{order.id.slice(0, 8).toUpperCase()}
                                        </h2>
                                        <div className="flex items-center space-x-3 mt-1">
                                            <StatusBadge status={order.status} />
                                            <span className="text-sm text-gray-300">
                                                {formatDistanceToNow(new Date(order.createdAt), {
                                                    addSuffix: true,
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-y-auto max-h-[calc(95vh-180px)]">
                        {/* Quick Actions */}
                        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={handlePrint}
                                        className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                                    >
                                        <Printer className="w-4 h-4 mr-1.5" />
                                        Print Receipt
                                    </button>
                                    <button
                                        onClick={onDuplicate}
                                        className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                                    >
                                        <Copy className="w-4 h-4 mr-1.5" />
                                        Duplicate
                                    </button>
                                </div>
                                {canEdit && (
                                    <button
                                        onClick={onEdit}
                                        className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center"
                                    >
                                        <Edit2 className="w-4 h-4 mr-1.5" />
                                        Edit Order
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status Timeline */}
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Order Status
                                </h3>
                                <div className="flex items-center justify-between">
                                    {['PENDING', 'PROCESSING', 'COMPLETED'].map((status, index) => (
                                        <div key={status} className="flex items-center">
                                            <div
                                                className={`flex flex-col items-center ${
                                                    order.status === status ||
                                                    (order.status === 'CANCELLED' &&
                                                        status === 'PENDING') ||
                                                    (order.status === 'PROCESSING' &&
                                                        status === 'PENDING') ||
                                                    (order.status === 'COMPLETED' &&
                                                        (status === 'PENDING' ||
                                                            status === 'PROCESSING'))
                                                        ? 'text-purple-600'
                                                        : 'text-gray-400'
                                                }`}
                                            >
                                                <div
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                        order.status === status ||
                                                        (order.status === 'CANCELLED' &&
                                                            status === 'PENDING') ||
                                                        (order.status === 'PROCESSING' &&
                                                            status === 'PENDING') ||
                                                        (order.status === 'COMPLETED' &&
                                                            (status === 'PENDING' ||
                                                                status === 'PROCESSING'))
                                                            ? 'bg-purple-600 text-white'
                                                            : 'bg-gray-200'
                                                    }`}
                                                >
                                                    {status === 'PENDING' && <Clock size={20} />}
                                                    {status === 'PROCESSING' && (
                                                        <Package size={20} />
                                                    )}
                                                    {status === 'COMPLETED' && (
                                                        <CheckCircle size={20} />
                                                    )}
                                                </div>
                                                <span className="text-xs font-medium mt-2">
                                                    {status}
                                                </span>
                                            </div>
                                            {index < 2 && (
                                                <div
                                                    className={`w-full h-1 mx-2 ${
                                                        (order.status === 'PROCESSING' &&
                                                            index === 0) ||
                                                        (order.status === 'COMPLETED' && index <= 1)
                                                            ? 'bg-purple-600'
                                                            : 'bg-gray-200'
                                                    }`}
                                                    style={{ width: '100px' }}
                                                />
                                            )}
                                        </div>
                                    ))}
                                    {order.status === 'CANCELLED' && (
                                        <div className="ml-8 flex flex-col items-center text-red-600">
                                            <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center">
                                                <XCircle size={20} />
                                            </div>
                                            <span className="text-xs font-medium mt-2">
                                                CANCELLED
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Customer Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-xl border border-gray-200 p-5">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <User className="w-5 h-5 mr-2 text-gray-600" />
                                        Customer Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-500">Name</p>
                                            <p className="text-base font-medium text-gray-900">
                                                {order.customerName}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="text-base font-medium text-gray-900 flex items-center">
                                                <Phone className="w-4 h-4 mr-1.5 text-gray-400" />
                                                {order.customerPhone}
                                            </p>
                                        </div>
                                        {order.customerEmail && (
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p className="text-base font-medium text-gray-900 flex items-center">
                                                    <Mail className="w-4 h-4 mr-1.5 text-gray-400" />
                                                    {order.customerEmail}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl border border-gray-200 p-5">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <Truck className="w-5 h-5 mr-2 text-gray-600" />
                                        Order Details
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-500">Delivery Method</p>
                                            <p className="text-base font-medium text-gray-900">
                                                {order.deliveryMethod === 'PICKUP'
                                                    ? '🏪 Store Pickup'
                                                    : '🚚 Shipping'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Order Date</p>
                                            <p className="text-base font-medium text-gray-900">
                                                {format(
                                                    new Date(order.createdAt),
                                                    'MMM dd, yyyy HH:mm'
                                                )}
                                            </p>
                                        </div>
                                        {order.updatedAt !== order.createdAt && (
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Last Updated
                                                </p>
                                                <p className="text-base font-medium text-gray-900">
                                                    {format(
                                                        new Date(order.updatedAt),
                                                        'MMM dd, yyyy HH:mm'
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                        <Package className="w-5 h-5 mr-2 text-gray-600" />
                                        Order Items ({order.items.length})
                                    </h3>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    {order.items.map((item, index) => (
                                        <div key={item.id} className="px-5 py-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-start">
                                                        <span className="text-sm font-medium text-gray-500 mr-3">
                                                            {index + 1}.
                                                        </span>
                                                        <div className="flex-1">
                                                            <p className="text-base font-medium text-gray-900">
                                                                {item.part.name}
                                                            </p>
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                Part #: {item.part.partNumber}
                                                            </p>
                                                            {item.part.vehicle && (
                                                                <p className="text-xs text-gray-400 mt-1">
                                                                    {item.part.vehicle.make}{' '}
                                                                    {item.part.vehicle.model} (
                                                                    {item.part.vehicle.year})
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right ml-4">
                                                    <p className="text-sm text-gray-600">
                                                        {item.quantity} ×{' '}
                                                        {formatCurrency(item.unitPrice)}
                                                    </p>
                                                    {Number(item.discount) > 0 && (
                                                        <p className="text-xs text-red-600">
                                                            - {formatCurrency(item.discount)}{' '}
                                                            discount
                                                        </p>
                                                    )}
                                                    <p className="text-base font-semibold text-gray-900 mt-1">
                                                        {formatCurrency(item.total)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Summary */}
                                <div className="bg-gray-50 px-5 py-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span className="font-medium text-gray-900">
                                            {formatCurrency(calculateSubtotal())}
                                        </span>
                                    </div>
                                    {calculateDiscounts() > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Total Discounts:</span>
                                            <span className="font-medium text-red-600">
                                                - {formatCurrency(calculateDiscounts())}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between pt-2 border-t border-gray-200">
                                        <span className="text-base font-semibold text-gray-900">
                                            Total Amount:
                                        </span>
                                        <span className="text-xl font-bold text-purple-600">
                                            {formatCurrency(order.totalAmount)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            {order.notes && (
                                <div className="bg-white rounded-xl border border-gray-200 p-5">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                        <FileText className="w-5 h-5 mr-2 text-gray-600" />
                                        Notes
                                    </h3>
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {order.notes}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                            >
                                Close
                            </button>
                            {order.status === 'PENDING' && (
                                <button
                                    onClick={onDelete}
                                    className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 font-medium transition-all flex items-center space-x-2"
                                >
                                    <XCircle className="w-4 h-4" />
                                    <span>Cancel Order</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Receipt Modal for Printing */}
            {showReceipt && <OrderReceipt order={order} onClose={() => setShowReceipt(false)} />}
        </>
    );
};
