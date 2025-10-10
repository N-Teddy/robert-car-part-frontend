// src/components/orders/OrderReceipt.tsx
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { OrderResponse } from '../../types/response/order';
import { format } from 'date-fns';
import { formatCurrency } from '../../utils/formatCurrency';
import QRCode from 'qrcode';

interface OrderReceiptProps {
    order: OrderResponse;
    onClose: () => void;
}

export const OrderReceipt: React.FC<OrderReceiptProps> = ({ order, onClose }) => {
    const qrCodeRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (qrCodeRef.current) {
            // Generate QR code with just the order ID
            QRCode.toCanvas(qrCodeRef.current, order.id, {
                width: 100,
                margin: 0,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF',
                },
            });
        }
    }, [order.id]);

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
            {/* Print Styles */}
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .receipt-container,
                    .receipt-container * {
                        visibility: visible;
                    }
                    .receipt-container {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .no-print {
                        display: none !important;
                    }
                    @page {
                        size: 80mm 297mm;
                        margin: 0;
                    }
                }
            `}</style>

            {/* Receipt Modal */}
            <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 no-print">
                <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-auto">
                    {/* Close Button */}
                    <div className="flex justify-end p-4 border-b border-gray-200 no-print">
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Receipt Content */}
                    <div className="receipt-container p-8 font-mono text-black bg-white">
                        {/* Header */}
                        <div className="text-center mb-6 pb-4 border-b-2 border-black border-dashed">
                            <h1 className="text-2xl font-bold mb-2">AUTO PARTS STORE</h1>
                            <p className="text-sm">123 Main Street, Douala</p>
                            <p className="text-sm">Tel: +237 6XX XXX XXX</p>
                            <p className="text-sm">Email: info@autoparts.cm</p>
                        </div>

                        {/* Receipt Title */}
                        <div className="text-center mb-4">
                            <h2 className="text-lg font-bold">SALES RECEIPT</h2>
                            <p className="text-sm mt-1">#{order.id.slice(0, 8).toUpperCase()}</p>
                        </div>

                        {/* Date and Time */}
                        <div className="mb-4 pb-2 border-b border-gray-400">
                            <div className="flex justify-between text-sm">
                                <span>Date:</span>
                                <span>{format(new Date(order.createdAt), 'dd/MM/yyyy')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Time:</span>
                                <span>{format(new Date(order.createdAt), 'HH:mm:ss')}</span>
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div className="mb-4 pb-2 border-b border-gray-400">
                            <p className="text-sm font-bold mb-1">CUSTOMER:</p>
                            <p className="text-sm">{order.customerName}</p>
                            <p className="text-sm">{order.customerPhone}</p>
                            {order.customerEmail && (
                                <p className="text-sm">{order.customerEmail}</p>
                            )}
                        </div>

                        {/* Items */}
                        <div className="mb-4">
                            <div className="border-b-2 border-black pb-1 mb-2">
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="flex-1">ITEM</span>
                                    <span className="w-12 text-center">QTY</span>
                                    <span className="w-20 text-right">PRICE</span>
                                    <span className="w-20 text-right">TOTAL</span>
                                </div>
                            </div>

                            {order.items.map((item, index) => (
                                <div key={item.id} className="mb-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="flex-1">
                                            {index + 1}. {item.part.name}
                                        </span>
                                        <span className="w-12 text-center">{item.quantity}</span>
                                        <span className="w-20 text-right">
                                            {formatCurrency(Number(item.unitPrice))}
                                        </span>
                                        <span className="w-20 text-right">
                                            {formatCurrency(item.quantity * Number(item.unitPrice))}
                                        </span>
                                    </div>
                                    {item.part.partNumber && (
                                        <div className="text-xs text-gray-600 ml-4">
                                            Part #: {item.part.partNumber}
                                        </div>
                                    )}
                                    {Number(item.discount) > 0 && (
                                        <div className="text-xs text-gray-600 ml-4">
                                            Discount: -{formatCurrency(Number(item.discount))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="border-t-2 border-black border-dashed pt-2 mb-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span>Subtotal:</span>
                                <span>{formatCurrency(calculateSubtotal())}</span>
                            </div>
                            {calculateDiscounts() > 0 && (
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Total Discounts:</span>
                                    <span>-{formatCurrency(calculateDiscounts())}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-base font-bold border-t border-black pt-1 mt-1">
                                <span>TOTAL:</span>
                                <span>{formatCurrency(Number(order.totalAmount))}</span>
                            </div>
                        </div>

                        {/* Delivery Method */}
                        <div className="mb-4 pb-2 border-b border-gray-400">
                            <div className="flex justify-between text-sm">
                                <span>Delivery Method:</span>
                                <span className="font-bold">
                                    {order.deliveryMethod === 'PICKUP'
                                        ? 'STORE PICKUP'
                                        : 'SHIPPING'}
                                </span>
                            </div>
                        </div>

                        {/* Notes */}
                        {order.notes && (
                            <div className="mb-4 pb-2 border-b border-gray-400">
                                <p className="text-sm font-bold mb-1">NOTES:</p>
                                <p className="text-xs">{order.notes}</p>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="text-center mt-6 pt-4 border-t-2 border-black border-dashed">
                            <p className="text-sm font-bold mb-2">THANK YOU FOR YOUR PURCHASE!</p>
                            <p className="text-xs">Please keep this receipt for your records</p>
                            <p className="text-xs mt-2">
                                Returns accepted within 7 days with receipt
                            </p>

                            {/* QR Code */}
                            <div className="mt-4 flex justify-center">
                                <canvas ref={qrCodeRef} />
                            </div>
                            <p className="text-xs mt-1">
                                Order ID: {order.id.slice(0, 8).toUpperCase()}
                            </p>
                        </div>

                        {/* Signature Section */}
                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <div>
                                <div className="border-b border-black mb-1 h-8"></div>
                                <p className="text-xs text-center">Customer Signature</p>
                            </div>
                            <div>
                                <div className="border-b border-black mb-1 h-8"></div>
                                <p className="text-xs text-center">Authorized Signature</p>
                            </div>
                        </div>
                    </div>

                    {/* Print Button */}
                    <div className="p-4 border-t border-gray-200 no-print">
                        <button
                            onClick={() => window.print()}
                            className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium transition-colors"
                        >
                            Print Receipt
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
