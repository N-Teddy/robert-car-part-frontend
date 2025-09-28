// src/components/orders/OrderDeleteModal.tsx
import React from 'react';
import { AlertTriangle, X, XCircle, ShoppingCart } from 'lucide-react';
import type { OrderResponse } from '../../types/response/order';
import { formatCurrency } from '../../utils/formatCurrency';

interface OrderDeleteModalProps {
    isOpen: boolean;
    order: OrderResponse | null;
    onClose: () => void;
    onConfirm: () => void;
}

export const OrderDeleteModal: React.FC<OrderDeleteModalProps> = ({
    isOpen,
    order,
    onClose,
    onConfirm,
}) => {
    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
                {/* Header */}
                <div className="bg-red-50 px-6 py-6">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                        <div className="ml-4 flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">Cancel Order</h3>
                            <p className="mt-1 text-sm text-gray-600">
                                Are you sure you want to cancel this order? This will restore
                                inventory levels.
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="ml-4 text-gray-400 hover:text-gray-500"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <ShoppingCart className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900">
                                    Order #{order.id.slice(0, 8).toUpperCase()}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Customer: {order.customerName}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Items: {order.items.length} • Total:{' '}
                                    {formatCurrency(order.totalAmount)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <AlertTriangle className="w-5 h-5 text-amber-600" />
                            </div>
                            <div className="ml-3">
                                <h4 className="text-sm font-medium text-amber-800">Important</h4>
                                <div className="mt-1 text-sm text-amber-700">
                                    <p>Cancelling this order will:</p>
                                    <ul className="list-disc list-inside mt-1">
                                        <li>Change order status to CANCELLED</li>
                                        <li>
                                            Restore{' '}
                                            {order.items.reduce(
                                                (sum, item) => sum + item.quantity,
                                                0
                                            )}{' '}
                                            items to inventory
                                        </li>
                                        <li>This action cannot be undone</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
                    >
                        Keep Order
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors flex items-center"
                    >
                        <XCircle className="w-4 h-4 mr-1" />
                        Cancel Order
                    </button>
                </div>
            </div>
        </div>
    );
};
