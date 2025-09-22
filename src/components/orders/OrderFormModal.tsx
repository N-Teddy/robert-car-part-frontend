// src/components/orders/OrderFormModal.tsx
import React, { useState, useEffect } from 'react';
import {
    X,
    ShoppingCart,
    User,
    Package,
    Check,
    Loader2,
    Plus,
    Minus,
    Search,
    AlertCircle,
    Phone,
    Mail,
    Truck,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';
import type { Part } from '../../types/request/part';
import type { OrderResponse } from '../../types/response/order';
import type { CreateOrderRequest, OrderItemRequest } from '../../types/request/order';
import { formatCurrency } from '../../utils/formatCurrency';
import { Stepper } from '../ui/Stepper';

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
    const [searchTerm, setSearchTerm] = useState('');
    const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (mode === 'edit' && order) {
            setFormData({
                customerName: order.customerName,
                customerPhone: order.customerPhone,
                customerEmail: order.customerEmail,
                deliveryMethod: order.deliveryMethod,
                notes: order.notes || '',
            });
            setOrderItems(order.items.map(item => ({
                partId: item.part.id,
                quantity: item.quantity,
                unitPrice: Number(item.unitPrice),
                discount: Number(item.discount),
            })));
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

    const filteredParts = parts.filter(part =>
        part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.partNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredCustomers = savedCustomers.filter(customer =>
        customer.name.toLowerCase().includes(formData.customerName.toLowerCase()) ||
        customer.phone.includes(formData.customerPhone)
    );

    const handleCustomerSelect = (customer: typeof savedCustomers[0]) => {
        setFormData({
            ...formData,
            customerName: customer.name,
            customerPhone: customer.phone,
            customerEmail: customer.email,
        });
        setShowCustomerSuggestions(false);
    };

    const handleAddItem = (part: Part) => {
        const existingItem = orderItems.find(item => item.partId === part.id);

        if (existingItem) {
            // Check stock
            if (existingItem.quantity >= part.quantity) {
                alert(`Only ${part.quantity} units available in stock`);
                return;
            }
            // Increment quantity
            setOrderItems(orderItems.map(item =>
                item.partId === part.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            // Add new item
            if (part.quantity === 0) {
                alert('This part is out of stock');
                return;
            }
            setOrderItems([...orderItems, {
                partId: part.id,
                quantity: 1,
                unitPrice: Number(part.price),
                discount: 0,
            }]);
        }
    };

    const handleUpdateQuantity = (partId: string, quantity: number) => {
        const part = parts.find(p => p.id === partId);
        if (!part) return;

        if (quantity > part.quantity) {
            alert(`Only ${part.quantity} units available in stock`);
            return;
        }

        if (quantity === 0) {
            setOrderItems(orderItems.filter(item => item.partId !== partId));
        } else {
            setOrderItems(orderItems.map(item =>
                item.partId === partId ? { ...item, quantity } : item
            ));
        }
    };

    const handleUpdateDiscount = (partId: string, discount: number) => {
        setOrderItems(orderItems.map(item =>
            item.partId === partId ? { ...item, discount } : item
        ));
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
            if (!formData.customerPhone.trim()) newErrors.customerPhone = 'Phone number is required';
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-500">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full"></div>
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white rounded-full"></div>
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
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Step Indicator */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
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
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Customer Information
                                </h3>

                                {/* Customer Suggestions */}
                                {savedCustomers.length > 0 && (
                                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm text-blue-800 mb-2">
                                            Select from previous customers:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {savedCustomers.slice(0, 3).map((customer, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleCustomerSelect(customer)}
                                                    className="px-3 py-1.5 bg-white border border-blue-300 rounded-lg text-sm text-blue-700 hover:bg-blue-100 transition-colors"
                                                >
                                                    {customer.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                            <User className="w-4 h-4 mr-1.5 text-gray-400" />
                                            Customer Name <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.customerName}
                                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.customerName
                                                    ? 'border-red-300 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-purple-500'
                                                } focus:ring-2 focus:border-transparent transition-all`}
                                            placeholder="John Doe"
                                        />
                                        {errors.customerName && (
                                            <p className="mt-1.5 text-xs text-red-600 flex items-center">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                {errors.customerName}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                            <Phone className="w-4 h-4 mr-1.5 text-gray-400" />
                                            Phone Number <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.customerPhone}
                                            onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.customerPhone
                                                    ? 'border-red-300 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-purple-500'
                                                } focus:ring-2 focus:border-transparent transition-all`}
                                            placeholder="+237 6XX XXX XXX"
                                        />
                                        {errors.customerPhone && (
                                            <p className="mt-1.5 text-xs text-red-600 flex items-center">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                {errors.customerPhone}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                            <Mail className="w-4 h-4 mr-1.5 text-gray-400" />
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.customerEmail}
                                            onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.customerEmail
                                                    ? 'border-red-300 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-purple-500'
                                                } focus:ring-2 focus:border-transparent transition-all`}
                                            placeholder="john@example.com (optional)"
                                        />
                                        {errors.customerEmail && (
                                            <p className="mt-1.5 text-xs text-red-600 flex items-center">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                {errors.customerEmail}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                            <Truck className="w-4 h-4 mr-1.5 text-gray-400" />
                                            Delivery Method <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <label className={`relative flex items-center justify-center px-4 py-2.5 border-2 rounded-lg cursor-pointer transition-all ${formData.deliveryMethod === 'PICKUP'
                                                    ? 'border-purple-500 bg-purple-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}>
                                                <input
                                                    type="radio"
                                                    name="deliveryMethod"
                                                    value="PICKUP"
                                                    checked={formData.deliveryMethod === 'PICKUP'}
                                                    onChange={(e) => setFormData({ ...formData, deliveryMethod: 'PICKUP' })}
                                                    className="sr-only"
                                                />
                                                <span className={`text-sm font-medium ${formData.deliveryMethod === 'PICKUP'
                                                        ? 'text-purple-700'
                                                        : 'text-gray-700'
                                                    }`}>
                                                    🏪 Pickup
                                                </span>
                                            </label>
                                            <label className={`relative flex items-center justify-center px-4 py-2.5 border-2 rounded-lg cursor-pointer transition-all ${formData.deliveryMethod === 'SHIPPING'
                                                    ? 'border-purple-500 bg-purple-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}>
                                                <input
                                                    type="radio"
                                                    name="deliveryMethod"
                                                    value="SHIPPING"
                                                    checked={formData.deliveryMethod === 'SHIPPING'}
                                                    onChange={(e) => setFormData({ ...formData, deliveryMethod: 'SHIPPING' })}
                                                    className="sr-only"
                                                />
                                                <span className={`text-sm font-medium ${formData.deliveryMethod === 'SHIPPING'
                                                        ? 'text-purple-700'
                                                        : 'text-gray-700'
                                                    }`}>
                                                    🚚 Shipping
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Notes
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                                        placeholder="Additional notes or special instructions..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Add Items */}
                    {currentStep === 2 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Add Items to Order
                                </h3>

                                {/* Search Parts */}
                                <div className="mb-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search parts by name or part number..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Available Parts */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Available Parts</h4>
                                    <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                                        {filteredParts.map(part => (
                                            <div
                                                key={part.id}
                                                className="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                            >
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {part.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        #{part.partNumber} • {formatCurrency(part.price)} •
                                                        <span className={part.quantity === 0 ? 'text-red-600' : part.quantity < 5 ? 'text-yellow-600' : 'text-green-600'}>
                                                            {' '}{part.quantity} in stock
                                                        </span>
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleAddItem(part)}
                                                    disabled={part.quantity === 0}

                                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${part.quantity === 0
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'bg-purple-600 text-white hover:bg-purple-700'
                                                        }`}
                                                >
                                                    <Plus size={16} className="inline" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Selected Items */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Order Items</h4>
                                    {errors.items && (
                                        <div className="mb-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                            <p className="text-sm text-red-800 flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-2" />
                                                {errors.items}
                                            </p>
                                        </div>
                                    )}
                                    {orderItems.length === 0 ? (
                                        <div className="p-8 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                            <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-500">No items added yet</p>
                                            <p className="text-xs text-gray-400 mt-1">Search and add parts above</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {orderItems.map((item, index) => {
                                                const part = parts.find(p => p.id === item.partId);
                                                if (!part) return null;

                                                const itemTotal = (item.quantity * item.unitPrice) - (item.discount || 0);

                                                return (
                                                    <div key={item.partId} className="bg-white border border-gray-200 rounded-lg p-4">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <p className="font-medium text-gray-900">
                                                                    {index + 1}. {part.name}
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    #{part.partNumber}
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={() => setOrderItems(orderItems.filter(i => i.partId !== item.partId))}
                                                                className="text-red-600 hover:text-red-700"
                                                            >
                                                                <X size={18} />
                                                            </button>
                                                        </div>

                                                        <div className="mt-3 grid grid-cols-4 gap-3">
                                                            <div>
                                                                <label className="text-xs text-gray-600">Quantity</label>
                                                                <div className="flex items-center mt-1">
                                                                    <button
                                                                        onClick={() => handleUpdateQuantity(item.partId, item.quantity - 1)}
                                                                        className="p-1 border border-gray-300 rounded-l hover:bg-gray-100"
                                                                    >
                                                                        <Minus size={14} />
                                                                    </button>
                                                                    <input
                                                                        type="number"
                                                                        value={item.quantity}
                                                                        onChange={(e) => handleUpdateQuantity(item.partId, parseInt(e.target.value) || 0)}
                                                                        className="w-16 px-2 py-1 border-t border-b border-gray-300 text-center text-sm"
                                                                    />
                                                                    <button
                                                                        onClick={() => handleUpdateQuantity(item.partId, item.quantity + 1)}
                                                                        disabled={item.quantity >= part.quantity}
                                                                        className="p-1 border border-gray-300 rounded-r hover:bg-gray-100 disabled:opacity-50"
                                                                    >
                                                                        <Plus size={14} />
                                                                    </button>
                                                                </div>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    Max: {part.quantity}
                                                                </p>
                                                            </div>

                                                            <div>
                                                                <label className="text-xs text-gray-600">Unit Price</label>
                                                                <p className="mt-1 text-sm font-medium">
                                                                    {formatCurrency(item.unitPrice)}
                                                                </p>
                                                            </div>

                                                            <div>
                                                                <label className="text-xs text-gray-600">Discount</label>
                                                                <input
                                                                    type="number"
                                                                    value={item.discount || 0}
                                                                    onChange={(e) => handleUpdateDiscount(item.partId, parseFloat(e.target.value) || 0)}
                                                                    className="w-full mt-1 px-2 py-1 border border-gray-300 rounded text-sm"
                                                                    placeholder="0"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="text-xs text-gray-600">Total</label>
                                                                <p className="mt-1 text-sm font-bold text-purple-600">
                                                                    {formatCurrency(itemTotal)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Order Summary */}
                                {orderItems.length > 0 && (
                                    <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-purple-900">Subtotal:</span>
                                            <span className="text-lg font-bold text-purple-900">
                                                {formatCurrency(calculateTotal())}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Review Order */}
                    {currentStep === 3 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Review Order
                                </h3>

                                {/* Customer Summary */}
                                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Customer Information</h4>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <span className="text-gray-500">Name:</span>
                                            <p className="font-medium text-gray-900">{formData.customerName}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Phone:</span>
                                            <p className="font-medium text-gray-900">{formData.customerPhone}</p>
                                        </div>
                                        {formData.customerEmail && (
                                            <div>
                                                <span className="text-gray-500">Email:</span>
                                                <p className="font-medium text-gray-900">{formData.customerEmail}</p>
                                            </div>
                                        )}
                                        <div>
                                            <span className="text-gray-500">Delivery:</span>
                                            <p className="font-medium text-gray-900">
                                                {formData.deliveryMethod === 'PICKUP' ? '🏪 Pickup' : '🚚 Shipping'}
                                            </p>
                                        </div>
                                    </div>
                                    {formData.notes && (
                                        <div className="mt-3">
                                            <span className="text-sm text-gray-500">Notes:</span>
                                            <p className="text-sm text-gray-700 mt-1">{formData.notes}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Items Summary */}
                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                        <h4 className="text-sm font-medium text-gray-700">Order Items</h4>
                                    </div>
                                    <div className="divide-y divide-gray-200">
                                        {orderItems.map((item, index) => {
                                            const part = parts.find(p => p.id === item.partId);
                                            if (!part) return null;

                                            const itemTotal = (item.quantity * item.unitPrice) - (item.discount || 0);

                                            return (
                                                <div key={item.partId} className="px-4 py-3">
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {index + 1}. {part.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {item.quantity} × {formatCurrency(item.unitPrice)}
                                                                {item.discount > 0 && ` - ${formatCurrency(item.discount)} discount`}
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
                                    <div className="bg-purple-50 px-4 py-3 border-t border-purple-200">
                                        <div className="flex justify-between items-center">
                                            <span className="text-base font-semibold text-purple-900">Total Amount:</span>
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
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            {currentStep > 1 && (
                                <button
                                    onClick={handlePrevious}
                                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors flex items-center"
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
                                            <span>{mode === 'create' ? 'Create Order' : 'Update Order'}</span>
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