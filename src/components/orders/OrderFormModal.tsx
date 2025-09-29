// src/components/orders/OrderFormModal.tsx
import React, { useState, useEffect } from 'react';
import {
    X,
    ShoppingCart,
    User,
    Package,
    Check,
    Loader2,
    ChevronRight,
    ChevronLeft,
} from 'lucide-react';
import type { Part } from '../../types/request/part';
import type { OrderResponse } from '../../types/response/order';
import type { CreateOrderRequest, OrderItemRequest } from '../../types/request/order';
import { Stepper } from '../ui/Stepper';
import { ItemSelector } from './ItemSelector';
import { formatCurrency } from '../../utils/formatCurrency';
import { usePart } from '../../hooks/partHook';

interface OrderFormModalProps {
    isOpen: boolean;
    mode: 'create' | 'edit';
    order?: OrderResponse | null;
    parts: Part[];
    savedCustomers: Array<{ name: string; phone: string; email: string }>;
    onClose: () => void;
    onSubmit: (data: CreateOrderRequest) => void;
}

export const OrderFormModal: React.FC<OrderFormModalProps> = ({
    isOpen,
    mode,
    order,
    parts,
    savedCustomers,
    onClose,
    onSubmit,
}) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        deliveryMethod: 'PICKUP' as 'PICKUP' | 'SHIPPING',
        notes: '',
    });
    const [orderItems, setOrderItems] = useState<OrderItemRequest[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { useGetPartById } = usePart();

    useEffect(() => {
        if (mode === 'edit' && order) {
            setFormData({
                customerName: order.customerName,
                customerPhone: order.customerPhone,
                customerEmail: order.customerEmail,
                deliveryMethod: order.deliveryMethod,
                notes: order.notes || '',
            });
            setOrderItems(
                order.items.map((item) => ({
                    partId: item.part.id,
                    quantity: item.quantity,
                    unitPrice: Number(item.unitPrice),
                    discount: Number(item.discount),
                }))
            );
        } else {
            // Reset for create mode
            setFormData({
                customerName: '',
                customerPhone: '',
                customerEmail: '',
                deliveryMethod: 'PICKUP',
                notes: '',
            });
            setOrderItems([]);
        }
        setCurrentStep(1);
        setErrors({});
    }, [mode, order, isOpen]);

    // ItemSelector handlers
    const handleItemAdd = (part: Part) => {
        const existingItem = orderItems.find((item) => item.partId === part.id);

        if (existingItem) {
            // Check stock
            if (existingItem.quantity >= part.quantity) {
                alert(`Only ${part.quantity} units available in stock`);
                return;
            }
            // Increment quantity
            setOrderItems(
                orderItems.map((item) =>
                    item.partId === part.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            );
        } else {
            // Add new item
            if (part.quantity === 0) {
                alert('This part is out of stock');
                return;
            }
            setOrderItems([
                ...orderItems,
                {
                    partId: part.id,
                    quantity: 1,
                    unitPrice: Number(part.price),
                    discount: 0,
                },
            ]);
        }
    };

    const handleItemUpdate = (partId: string, quantity: number) => {
        const part = parts.find((p) => p.id === partId);
        if (!part) return;

        if (quantity > part.quantity) {
            alert(`Only ${part.quantity} units available in stock`);
            return;
        }

        if (quantity === 0) {
            setOrderItems(orderItems.filter((item) => item.partId !== partId));
        } else {
            setOrderItems(
                orderItems.map((item) => (item.partId === partId ? { ...item, quantity } : item))
            );
        }
    };

    const handleItemRemove = (partId: string) => {
        setOrderItems(orderItems.filter((item) => item.partId !== partId));
    };

    const handleDiscountUpdate = (partId: string, discount: number) => {
        setOrderItems(
            orderItems.map((item) => (item.partId === partId ? { ...item, discount } : item))
        );
    };

    const calculateTotal = () => {
        return orderItems.reduce((total, item) => {
            const subtotal = item.quantity * (item.unitPrice || 0);
            const discount = item.discount || 0;
            return total + (subtotal - discount);
        }, 0);
    };

    const validateStep = (step: number) => {
        const newErrors: Record<string, string> = {};

        if (step === 1) {
            if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required';
            if (!formData.customerPhone.trim())
                newErrors.customerPhone = 'Phone number is required';
            if (formData.customerEmail && !formData.customerEmail.includes('@')) {
                newErrors.customerEmail = 'Invalid email format';
            }
        }

        if (step === 2) {
            if (orderItems.length === 0) newErrors.items = 'At least one item is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async () => {
        if (!validateStep(1) || !validateStep(2)) return;

        setIsSubmitting(true);
        try {
            await onSubmit({
                ...formData,
                items: orderItems,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-500">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute w-24 h-24 bg-white rounded-full -top-4 -right-4"></div>
                        <div className="absolute w-32 h-32 bg-white rounded-full -bottom-4 -left-4"></div>
                    </div>

                    <div className="relative px-6 py-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
                                    <ShoppingCart className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        {mode === 'create' ? 'Create New Order' : 'Edit Order'}
                                    </h2>
                                    <p className="text-xs text-white/80 mt-0.5">
                                        {mode === 'create'
                                            ? 'Add a new customer order'
                                            : `Order #${order?.id.slice(0, 8).toUpperCase()}`}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 transition-colors rounded-lg hover:bg-white/20"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Step Indicator */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <Stepper
                        steps={[
                            { id: 1, label: 'Customer Info', icon: User },
                            { id: 2, label: 'Add Items', icon: Package },
                            { id: 3, label: 'Review Order', icon: Check },
                        ]}
                        currentStep={currentStep}
                        onStepClick={(step) => {
                            if (validateStep(Math.min(currentStep, step - 1))) {
                                setCurrentStep(step);
                            }
                        }}
                        allowNavigation={true}
                    />
                </div>

                {/* Form Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-280px)] p-6">
                    {/* Step 1: Customer Information */}
                    {currentStep === 1 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div>
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                    Customer Information
                                </h3>

                                {/* Customer Suggestions */}
                                {savedCustomers.length > 0 && (
                                    <div className="p-3 mb-4 border border-blue-200 rounded-lg bg-blue-50">
                                        <p className="mb-2 text-sm text-blue-800">
                                            Select from previous customers:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {savedCustomers.slice(0, 3).map((customer, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => {
                                                        setFormData({
                                                            ...formData,
                                                            customerName: customer.name,
                                                            customerPhone: customer.phone,
                                                            customerEmail: customer.email,
                                                        });
                                                    }}
                                                    className="px-3 py-1.5 bg-white border border-blue-300 rounded-lg text-sm text-blue-700 hover:bg-blue-100 transition-colors"
                                                >
                                                    {customer.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
                                            <User className="w-4 h-4 mr-1.5 text-gray-400" />
                                            Customer Name{' '}
                                            <span className="ml-1 text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.customerName}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    customerName: e.target.value,
                                                })
                                            }
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.customerName
                                                    ? 'border-red-300 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-purple-500'
                                                } focus:ring-2 focus:border-transparent transition-all`}
                                            placeholder="John Doe"
                                        />
                                        {errors.customerName && (
                                            <p className="mt-1.5 text-xs text-red-600">
                                                {errors.customerName}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
                                            Phone Number{' '}
                                            <span className="ml-1 text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.customerPhone}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    customerPhone: e.target.value,
                                                })
                                            }
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.customerPhone
                                                    ? 'border-red-300 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-purple-500'
                                                } focus:ring-2 focus:border-transparent transition-all`}
                                            placeholder="+237 6XX XXX XXX"
                                        />
                                        {errors.customerPhone && (
                                            <p className="mt-1.5 text-xs text-red-600">
                                                {errors.customerPhone}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.customerEmail}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    customerEmail: e.target.value,
                                                })
                                            }
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.customerEmail
                                                    ? 'border-red-300 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-purple-500'
                                                } focus:ring-2 focus:border-transparent transition-all`}
                                            placeholder="john@example.com (optional)"
                                        />
                                        {errors.customerEmail && (
                                            <p className="mt-1.5 text-xs text-red-600">
                                                {errors.customerEmail}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
                                            Delivery Method{' '}
                                            <span className="ml-1 text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <label
                                                className={`relative flex items-center justify-center px-4 py-2.5 border-2 rounded-lg cursor-pointer transition-all ${formData.deliveryMethod === 'PICKUP'
                                                        ? 'border-purple-500 bg-purple-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="deliveryMethod"
                                                    value="PICKUP"
                                                    checked={formData.deliveryMethod === 'PICKUP'}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            deliveryMethod: 'PICKUP',
                                                        })
                                                    }
                                                    className="sr-only"
                                                />
                                                <span
                                                    className={`text-sm font-medium ${formData.deliveryMethod === 'PICKUP'
                                                            ? 'text-purple-700'
                                                            : 'text-gray-700'
                                                        }`}
                                                >
                                                    🏪 Pickup
                                                </span>
                                            </label>
                                            <label
                                                className={`relative flex items-center justify-center px-4 py-2.5 border-2 rounded-lg cursor-pointer transition-all ${formData.deliveryMethod === 'SHIPPING'
                                                        ? 'border-purple-500 bg-purple-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="deliveryMethod"
                                                    value="SHIPPING"
                                                    checked={formData.deliveryMethod === 'SHIPPING'}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            deliveryMethod: 'SHIPPING',
                                                        })
                                                    }
                                                    className="sr-only"
                                                />
                                                <span
                                                    className={`text-sm font-medium ${formData.deliveryMethod === 'SHIPPING'
                                                            ? 'text-purple-700'
                                                            : 'text-gray-700'
                                                        }`}
                                                >
                                                    🚚 Shipping
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Notes
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={formData.notes}
                                        onChange={(e) =>
                                            setFormData({ ...formData, notes: e.target.value })
                                        }
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                                        placeholder="Additional notes or special instructions..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Add Items with QR Scanner */}
                    {currentStep === 2 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div>
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                    Add Items to Order
                                </h3>
                                <p className="mb-4 text-sm text-gray-600">
                                    Search for parts or scan QR codes to add items to the order
                                </p>

                                {errors.items && (
                                    <div className="p-3 mb-4 border border-red-200 rounded-lg bg-red-50">
                                        <p className="text-sm text-red-800">
                                            {errors.items}
                                        </p>
                                    </div>
                                )}

                                {/* ItemSelector Component */}
                                <ItemSelector
                                    parts={parts}
                                    selectedItems={orderItems}
                                    onItemAdd={handleItemAdd}
                                    onItemUpdate={handleItemUpdate}
                                    onItemRemove={handleItemRemove}
                                    onDiscountUpdate={handleDiscountUpdate}
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Review Order */}
                    {currentStep === 3 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div>
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                    Review Order
                                </h3>

                                {/* Customer Summary */}
                                <div className="p-4 mb-4 rounded-lg bg-gray-50">
                                    <h4 className="mb-3 text-sm font-medium text-gray-700">
                                        Customer Information
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <span className="text-gray-500">Name:</span>
                                            <p className="font-medium text-gray-900">
                                                {formData.customerName}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Phone:</span>
                                            <p className="font-medium text-gray-900">
                                                {formData.customerPhone}
                                            </p>
                                        </div>
                                        {formData.customerEmail && (
                                            <div>
                                                <span className="text-gray-500">Email:</span>
                                                <p className="font-medium text-gray-900">
                                                    {formData.customerEmail}
                                                </p>
                                            </div>
                                        )}
                                        <div>
                                            <span className="text-gray-500">Delivery:</span>
                                            <p className="font-medium text-gray-900">
                                                {formData.deliveryMethod === 'PICKUP'
                                                    ? '🏪 Pickup'
                                                    : '🚚 Shipping'}
                                            </p>
                                        </div>
                                    </div>
                                    {formData.notes && (
                                        <div className="mt-3">
                                            <span className="text-sm text-gray-500">Notes:</span>
                                            <p className="mt-1 text-sm text-gray-700">
                                                {formData.notes}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Items Summary */}
                                <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
                                    <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                                        <h4 className="text-sm font-medium text-gray-700">
                                            Order Items ({orderItems.length})
                                        </h4>
                                    </div>
                                    <div className="divide-y divide-gray-200">
                                        {orderItems.map((item, index) => {
                                            const part = parts.find((p) => p.id === item.partId);
                                            if (!part) return null;

                                            const itemTotal =
                                                item.quantity * item.unitPrice -
                                                (item.discount || 0);

                                            return (
                                                <div key={item.partId} className="px-4 py-3">
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {index + 1}. {part.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {item.quantity} ×{' '}
                                                                {formatCurrency(item.unitPrice)}
                                                                {item.discount > 0 &&
                                                                    ` - ${formatCurrency(item.discount)} discount`}
                                                            </p>
                                                        </div>
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            {formatCurrency(itemTotal)}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="px-4 py-3 border-t border-purple-200 bg-purple-50">
                                        <div className="flex items-center justify-between">
                                            <span className="text-base font-semibold text-purple-900">
                                                Total Amount:
                                            </span>
                                            <span className="text-xl font-bold text-purple-900">
                                                {formatCurrency(calculateTotal())}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div>
                            {currentStep > 1 && (
                                <button
                                    onClick={handlePrevious}
                                    className="flex items-center px-4 py-2 font-medium text-gray-700 transition-colors hover:text-gray-900"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Previous
                                </button>
                            )}
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            {currentStep < 3 ? (
                                <button
                                    onClick={handleNext}
                                    className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors flex items-center"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className={`px-5 py-2.5 rounded-lg font-medium text-white transition-all flex items-center space-x-2 ${isSubmitting
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Creating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            <span>
                                                {mode === 'create'
                                                    ? 'Create Order'
                                                    : 'Update Order'}
                                            </span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};