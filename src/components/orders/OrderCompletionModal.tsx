// src/components/orders/OrderCompletionModal.tsx
import React from 'react';
import { CheckCircle, X, Package, AlertCircle } from 'lucide-react';
import type { OrderResponse } from '../../types/response/order';
import { formatCurrency } from '../../utils/formatCurrency';

interface OrderCompletionModalProps {
    isOpen: boolean;
    order: OrderResponse | null;
    onClose: () => void;
    onConfirm: () => void;
    isCompleting: boolean;
}

export const OrderCompletionModal: React.FC<OrderCompletionModalProps> = ({
    isOpen,
    order,
    onClose,
    onConfirm,
    isCompleting,
}) => {
    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
                {/* Header */}
                <div className="bg-green-50 px-6 py-6">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <div className="ml-4 flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">Complete Order</h3>
                            <p className="mt-1 text-sm text-gray-600">
                                Mark this order as completed?
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
                            <Package className="w-5 h-5 text-gray-400 mt-0.5" />
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
                                <p className="text-xs text-gray-500 mt-1">
                                    Current Status:{' '}
                                    <span className="font-medium">{order.status}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <AlertCircle className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="ml-3">
                                <h4 className="text-sm font-medium text-blue-800">
                                    What happens next?
                                </h4>
                                <div className="mt-1 text-sm text-blue-700">
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Order status will change to COMPLETED</li>
                                        <li>Inventory levels will be updated automatically</li>
                                        <li>Order will become read-only</li>
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
                        disabled={isCompleting}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isCompleting}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors flex items-center disabled:opacity-50"
                    >
                        {isCompleting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Completing...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Complete Order
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
