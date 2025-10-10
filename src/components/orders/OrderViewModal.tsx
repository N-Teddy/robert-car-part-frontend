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
    Download,
    Image as ImageIcon,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import type { OrderResponse } from '../../types/response/order';
import { formatCurrency } from '../../utils/formatCurrency';
import { format, formatDistanceToNow } from 'date-fns';
import { StatusBadge } from './StatusBadge';
import { receiptGenerator } from '../../utils/receiptGenerator';

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
    const [isGeneratingReceipt, setIsGeneratingReceipt] = useState(false);
    const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
    const [imageIndexes, setImageIndexes] = useState<Record<string, number>>({});

    if (!isOpen || !order) return null;

    const canEdit = order.status !== 'COMPLETED' && order.status !== 'CANCELLED';

    const handlePrintReceipt = async () => {
        try {
            setIsGeneratingReceipt(true);
            receiptGenerator.printReceipt(order);
        } catch (error) {
            console.error('Error printing receipt:', error);
            alert('Failed to print receipt. Please try again.');
        } finally {
            setIsGeneratingReceipt(false);
        }
    };

    const handleDownloadReceipt = async () => {
        try {
            setIsGeneratingReceipt(true);
            await receiptGenerator.downloadPDF(order);
        } catch (error) {
            console.error('Error downloading receipt:', error);
            alert('Failed to download receipt. Please try again.');
        } finally {
            setIsGeneratingReceipt(false);
        }
    };

    const toggleItemExpansion = (itemId: string) => {
        setExpandedItemId(expandedItemId === itemId ? null : itemId);
    };

    const nextImage = (itemId: string, currentIndex: number, totalImages: number) => {
        setImageIndexes(prev => ({
            ...prev,
            [itemId]: (currentIndex + 1) % totalImages
        }));
    };

    const prevImage = (itemId: string, currentIndex: number, totalImages: number) => {
        setImageIndexes(prev => ({
            ...prev,
            [itemId]: (currentIndex - 1 + totalImages) % totalImages
        }));
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
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
                                        <ShoppingCart className="text-white w-7 h-7" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">
                                            Order #{order.id.slice(0, 8).toUpperCase()}
                                        </h2>
                                        <div className="flex items-center mt-1 space-x-3">
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
                                    className="p-2 transition-colors rounded-lg hover:bg-white/10"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-y-auto max-h-[calc(95vh-180px)]">
                        {/* Quick Actions */}
                        <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={handlePrintReceipt}
                                        disabled={isGeneratingReceipt}
                                        className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Printer className="w-4 h-4 mr-1.5" />
                                        {isGeneratingReceipt ? 'Generating...' : 'Print Receipt'}
                                    </button>
                                    <button
                                        onClick={handleDownloadReceipt}
                                        disabled={isGeneratingReceipt}
                                        className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Download className="w-4 h-4 mr-1.5" />
                                        {isGeneratingReceipt ? 'Generating...' : 'Download PDF'}
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
                            <div className="p-5 bg-white border border-gray-200 rounded-xl">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                    Order Status
                                </h3>
                                <div className="flex items-center justify-between">
                                    {['PENDING', 'PROCESSING', 'COMPLETED'].map((status, index) => (
                                        <div key={status} className="flex items-center">
                                            <div
                                                className={`flex flex-col items-center ${order.status === status ||
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
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center ${order.status === status ||
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
                                                <span className="mt-2 text-xs font-medium">
                                                    {status}
                                                </span>
                                            </div>
                                            {index < 2 && (
                                                <div
                                                    className={`w-full h-1 mx-2 ${(order.status === 'PROCESSING' &&
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
                                        <div className="flex flex-col items-center ml-8 text-red-600">
                                            <div className="flex items-center justify-center w-10 h-10 text-white bg-red-600 rounded-full">
                                                <XCircle size={20} />
                                            </div>
                                            <span className="mt-2 text-xs font-medium">
                                                CANCELLED
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Customer Information */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="p-5 bg-white border border-gray-200 rounded-xl">
                                    <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
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
                                            <p className="flex items-center text-base font-medium text-gray-900">
                                                <Phone className="w-4 h-4 mr-1.5 text-gray-400" />
                                                {order.customerPhone}
                                            </p>
                                        </div>
                                        {order.customerEmail && (
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p className="flex items-center text-base font-medium text-gray-900">
                                                    <Mail className="w-4 h-4 mr-1.5 text-gray-400" />
                                                    {order.customerEmail}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-5 bg-white border border-gray-200 rounded-xl">
                                    <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
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
                            <div className="overflow-hidden bg-white border border-gray-200 rounded-xl">
                                <div className="px-5 py-3 border-b border-gray-200 bg-gray-50">
                                    <h3 className="flex items-center text-lg font-semibold text-gray-900">
                                        <Package className="w-5 h-5 mr-2 text-gray-600" />
                                        Order Items ({order.items.length})
                                    </h3>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    {order.items.map((item, index) => {
                                        const hasImages = item.part.images && item.part.images.length > 0;
                                        const isExpanded = expandedItemId === item.id;
                                        const currentImageIndex = imageIndexes[item.id] || 0;
                                        const currentImage = hasImages ? item.part.images[currentImageIndex] : null;

                                        return (
                                            <div key={item.id} className="px-5 py-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-start space-x-4">
                                                            {/* Part Image */}
                                                            {hasImages ? (
                                                                <div className="flex-shrink-0">
                                                                    <div
                                                                        className="relative w-16 h-16 overflow-hidden bg-gray-100 rounded-lg cursor-pointer group"
                                                                        onClick={() => toggleItemExpansion(item.id)}
                                                                    >
                                                                        <img
                                                                            src={currentImage?.url}
                                                                            alt={item.part.name}
                                                                            className="object-cover w-full h-full transition-transform group-hover:scale-105"
                                                                        />
                                                                        {item.part.images.length > 1 && (
                                                                            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 text-white text-xs rounded">
                                                                                {currentImageIndex + 1}/{item.part.images.length}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    className="flex items-center justify-center flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg cursor-pointer"
                                                                    onClick={() => toggleItemExpansion(item.id)}
                                                                >
                                                                    <ImageIcon className="w-6 h-6 text-gray-400" />
                                                                </div>
                                                            )}

                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-start justify-between">
                                                                    <div className="flex-1">
                                                                        <p className="text-base font-medium text-gray-900">
                                                                            {index + 1}. {item.part.name}
                                                                        </p>
                                                                        <p className="mt-1 text-sm text-gray-500">
                                                                            Part #: {item.part.partNumber}
                                                                        </p>
                                                                        {item.part.vehicle && (
                                                                            <p className="mt-1 text-xs text-gray-400">
                                                                                {item.part.vehicle.make}{' '}
                                                                                {item.part.vehicle.model} (
                                                                                {item.part.vehicle.year})
                                                                            </p>
                                                                        )}
                                                                        <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
                                                                            <span>Qty: {item.quantity}</span>
                                                                            <span>Price: {formatCurrency(item.unitPrice)}</span>
                                                                            {Number(item.discount) > 0 && (
                                                                                <span className="text-red-600">
                                                                                    Discount: -{formatCurrency(item.discount)}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Expandable Image Gallery */}
                                                                {isExpanded && hasImages && (
                                                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-fadeIn">
                                                                        <div className="flex items-center justify-between mb-3">
                                                                            <h4 className="text-sm font-medium text-gray-900">
                                                                                Part Images ({item.part.images.length})
                                                                            </h4>
                                                                            <button
                                                                                onClick={() => setExpandedItemId(null)}
                                                                                className="text-gray-400 hover:text-gray-600"
                                                                            >
                                                                                <X size={16} />
                                                                            </button>
                                                                        </div>

                                                                        <div className="relative">
                                                                            <div className="flex items-center justify-center">
                                                                                <img
                                                                                    src={currentImage?.url}
                                                                                    alt={`${item.part.name} - Image ${currentImageIndex + 1}`}
                                                                                    className="max-h-64 max-w-full object-contain rounded-lg"
                                                                                />
                                                                            </div>

                                                                            {item.part.images.length > 1 && (
                                                                                <>
                                                                                    <button
                                                                                        onClick={() => prevImage(item.id, currentImageIndex, item.part.images.length)}
                                                                                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                                                                                    >
                                                                                        <ChevronLeft size={20} />
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => nextImage(item.id, currentImageIndex, item.part.images.length)}
                                                                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                                                                                    >
                                                                                        <ChevronRight size={20} />
                                                                                    </button>
                                                                                </>
                                                                            )}

                                                                            <div className="flex justify-center mt-3 space-x-2">
                                                                                {item.part.images.map((_, idx) => (
                                                                                    <button
                                                                                        key={idx}
                                                                                        onClick={() => setImageIndexes(prev => ({ ...prev, [item.id]: idx }))}
                                                                                        className={`w-2 h-2 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-purple-600' : 'bg-gray-300'
                                                                                            }`}
                                                                                    />
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4 text-right">
                                                        <p className="text-base font-semibold text-gray-900">
                                                            {formatCurrency(item.total)}
                                                        </p>
                                                        {hasImages && !isExpanded && (
                                                            <button
                                                                onClick={() => toggleItemExpansion(item.id)}
                                                                className="mt-2 text-xs text-purple-600 hover:text-purple-700"
                                                            >
                                                                View {item.part.images.length} image{item.part.images.length > 1 ? 's' : ''}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Order Summary */}
                                <div className="px-5 py-4 space-y-2 bg-gray-50">
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
                                <div className="p-5 bg-white border border-gray-200 rounded-xl">
                                    <h3 className="flex items-center mb-3 text-lg font-semibold text-gray-900">
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
                    <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
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
        </>
    );
};