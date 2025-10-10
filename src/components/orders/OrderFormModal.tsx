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
    Search,
    QrCode,
    Trash2,
    Plus,
    Minus,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import type { Part } from '../../types/request/part';
import type { OrderResponse } from '../../types/response/order';
import type { CreateOrderRequest, OrderItemRequest } from '../../types/request/order';
import { Stepper } from '../ui/Stepper';
import { formatCurrency } from '../../utils/formatCurrency';
import { partApi } from '../../api/partApi';
import { QRScannerModal } from './QRScannerModal';

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
    const [searchTerm, setSearchTerm] = useState('');
    const [showScanner, setShowScanner] = useState(false);
    const [fetchingPartId, setFetchingPartId] = useState<string | null>(null);
    const [isItemsCollapsed, setIsItemsCollapsed] = useState(false);

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
        setSearchTerm('');
    }, [mode, order, isOpen]);

    // Handle QR code scan
    const handleQRScan = async (data: string) => {
        try {
            console.log('QR Data received:', data);

            // Parse QR data - expecting JSON with partId
            const qrData = JSON.parse(data);
            const partId = qrData.partId || qrData.id;

            if (!partId) {
                alert('Invalid QR code format: No part ID found');
                return;
            }

            console.log('Looking for part ID:', partId);

            // First try to find in local parts list (faster)
            let scannedPart = parts.find((p) => p.id === partId);

            // If not found locally, try API
            if (!scannedPart) {
                console.log('Part not found locally, fetching from API...');
                try {
                    setFetchingPartId(partId);
                    const fetchedPart = await partApi.getPart(partId);

                    if (!fetchedPart) {
                        alert(`Part with ID ${partId} not found in database`);
                        return;
                    }

                    scannedPart = fetchedPart.data;
                    console.log('Part fetched successfully:', scannedPart.name);
                } catch (error) {
                    console.error('Error fetching part:', error);
                    alert('Error fetching part details from server');
                    return;
                } finally {
                    setFetchingPartId(null);
                }
            } else {
                console.log('Part found locally:', scannedPart.name);
            }

            // Part found (either locally or via API)
            if (scannedPart.quantity === 0) {
                alert(`${scannedPart.name} is out of stock`);
                return;
            }

            // Add part immediately with default values
            addOrUpdatePart(scannedPart);

            // Close scanner immediately after successful scan
            setShowScanner(false);

        } catch (error) {
            console.error('QR Scan error:', error);
            alert('Invalid QR code format. Expected JSON with partId.');
        }
    };

    // Add or update part in order items
    const addOrUpdatePart = (part: Part) => {
        const existingItem = orderItems.find((item) => item.partId === part.id);

        if (existingItem) {
            // Check stock before incrementing
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
            // Add new item with default values
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

    // Handle search and add part
    const handleSearchAdd = () => {
        if (!searchTerm.trim()) return;

        // Find part by name, part number, or ID
        const foundPart = parts.find((part) =>
            part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            part.partNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            part.id === searchTerm
        );

        if (foundPart) {
            if (foundPart.quantity === 0) {
                alert(`${foundPart.name} is out of stock`);
                return;
            }
            addOrUpdatePart(foundPart);
            setSearchTerm('');
        } else {
            alert('Part not found');
        }
    };

    // Item management functions
    const handleQuantityChange = (partId: string, newQuantity: number) => {
        const part = parts.find((p) => p.id === partId);
        if (!part) return;

        if (newQuantity > part.quantity) {
            alert(`Only ${part.quantity} units available in stock`);
            return;
        }

        if (newQuantity === 0) {
            setOrderItems(orderItems.filter((item) => item.partId !== partId));
        } else {
            setOrderItems(
                orderItems.map((item) =>
                    item.partId === partId ? { ...item, quantity: newQuantity } : item
                )
            );
        }
    };

    const handleUnitPriceChange = (partId: string, newPrice: number) => {
        if (newPrice < 0) {
            alert('Unit price cannot be negative');
            return;
        }

        setOrderItems(
            orderItems.map((item) =>
                item.partId === partId ? { ...item, unitPrice: newPrice } : item
            )
        );
    };

    const handleDiscountChange = (partId: string, newDiscount: number) => {
        const item = orderItems.find((item) => item.partId === partId);
        if (!item) return;

        const maxDiscount = item.quantity * item.unitPrice;
        if (newDiscount > maxDiscount) {
            alert(`Discount cannot exceed item subtotal of ${formatCurrency(maxDiscount)}`);
            return;
        }

        if (newDiscount < 0) {
            alert('Discount cannot be negative');
            return;
        }

        setOrderItems(
            orderItems.map((item) =>
                item.partId === partId ? { ...item, discount: newDiscount } : item
            )
        );
    };

    const handleItemRemove = (partId: string) => {
        setOrderItems(orderItems.filter((item) => item.partId !== partId));
    };

    // Calculation functions
    const calculateItemTotal = (item: OrderItemRequest) => {
        return (item.quantity * item.unitPrice) - (item.discount || 0);
    };

    const calculateOrderTotal = () => {
        return orderItems.reduce((total, item) => total + calculateItemTotal(item), 0);
    };

    const calculateSubtotal = () => {
        return orderItems.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
    };

    const calculateTotalDiscount = () => {
        return orderItems.reduce((total, item) => total + (item.discount || 0), 0);
    };

    // Get part details for display
    const getPartDetails = (partId: string) => {
        return parts.find((p) => p.id === partId);
    };

    // Validation
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

    console.log('Debug Info:', {
        orderItems,
        parts: parts,
        partsLength: parts.length,
        orderItemsWithParts: orderItems.map(item => ({
            item,
            part: getPartDetails(item.partId)
        }))
    });

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
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

                        {/* Step 2: Add Items */}
                        {currentStep === 2 && (
                            <div className="space-y-6 animate-fadeIn">
                                <div>
                                    <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                        Add Items to Order
                                    </h3>
                                    <p className="mb-4 text-sm text-gray-600">
                                        Search for parts by name or ID, or scan QR codes
                                    </p>

                                    {errors.items && (
                                        <div className="p-3 mb-4 border border-red-200 rounded-lg bg-red-50">
                                            <p className="text-sm text-red-800">
                                                {errors.items}
                                            </p>
                                        </div>
                                    )}

                                    {/* Search and QR Scanner */}
                                    <div className="flex flex-col gap-3 mb-6 sm:flex-row">
                                        <div className="relative flex-1">
                                            <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                                            <input
                                                type="text"
                                                placeholder="Search parts by name, ID, or part number..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleSearchAdd();
                                                    }
                                                }}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                        <button
                                            onClick={() => handleSearchAdd()}
                                            disabled={!searchTerm.trim()}
                                            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Add Part
                                        </button>
                                        <button
                                            onClick={() => setShowScanner(true)}
                                            disabled={fetchingPartId !== null}
                                            className="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {fetchingPartId ? (
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            ) : (
                                                <QrCode className="w-5 h-5 mr-2" />
                                            )}
                                            {fetchingPartId ? 'Fetching...' : 'Scan QR'}
                                        </button>
                                    </div>

                                    {/* Selected Items Card */}
                                    <div className="overflow-hidden bg-white border border-gray-200 shadow-lg rounded-xl">
                                        {/* Card Header */}
                                        <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-500">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                                                        <Package className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-white">Selected Items</h3>
                                                        <p className="text-sm text-white/80">Manage your order items</p>
                                                    </div>
                                                </div>
                                                <div className="text-right text-white">
                                                    <span className="text-2xl font-bold">{formatCurrency(calculateOrderTotal())}</span>
                                                    <p className="text-sm opacity-80">{orderItems.length} item{orderItems.length !== 1 ? 's' : ''}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Collapsible Button for Mobile */}
                                        <div className="border-b border-gray-200 ">
                                            <button
                                                onClick={() => setIsItemsCollapsed(!isItemsCollapsed)}
                                                className="flex items-center justify-between w-full px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                <span>Order Items ({orderItems.length})</span>
                                                {isItemsCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                                            </button>
                                        </div>

                                        {/* Selected Items List */}
                                        {(!isItemsCollapsed || window.innerWidth >= 640) && (
                                            <div className="overflow-y-auto max-h-96">
                                                {orderItems.length === 0 ? (
                                                    <div className="p-8 text-center">
                                                        <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                                                            <Package className="w-6 h-6 text-gray-400" />
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-900">No items added</p>
                                                        <p className="text-xs text-gray-500 mt-1">Search or scan to add items</p>
                                                    </div>
                                                ) : (
                                                    <div className="divide-y divide-gray-100">
                                                        {orderItems.map((item) => {
                                                            const part = getPartDetails(item.partId);
                                                            if (!part) return null;

                                                            const itemTotal = calculateItemTotal(item);
                                                            const stockAvailable = part.quantity;

                                                            return (
                                                                <div key={item.partId} className="p-4 hover:bg-gray-50 transition-colors">
                                                                    <div className="flex gap-3">
                                                                        {/* Part Image */}
                                                                        <div className="flex-shrink-0">
                                                                            {part.images && part.images.length > 0 ? (
                                                                                <img
                                                                                    src={part.images[0].url}
                                                                                    alt={part.name}
                                                                                    className="w-12 h-12 rounded object-cover border border-gray-200"
                                                                                />
                                                                            ) : (
                                                                                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                                                                    <Package className="w-5 h-5 text-gray-400" />
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        {/* Part Details and Controls */}
                                                                        <div className="flex-1 min-w-0">
                                                                            {/* Header Row */}
                                                                            <div className="flex items-start justify-between mb-2">
                                                                                <div>
                                                                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                                                                        {part.name}
                                                                                    </h4>
                                                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                                                        #{part.partNumber} • {part.category?.name || 'Uncategorized'}
                                                                                    </p>
                                                                                </div>
                                                                                <button
                                                                                    onClick={() => handleItemRemove(item.partId)}
                                                                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                                                                >
                                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                                </button>
                                                                            </div>

                                                                            {/* Stock Status */}
                                                                            <div className="flex items-center gap-2 mb-3 text-xs">
                                                                                <span className="text-gray-500">Stock:</span>
                                                                                <span className={`font-medium ${stockAvailable > 20 ? 'text-green-600' :
                                                                                        stockAvailable > 5 ? 'text-yellow-600' : 'text-red-600'
                                                                                    }`}>
                                                                                    {stockAvailable} available
                                                                                </span>
                                                                                {part.vehicle && (
                                                                                    <>
                                                                                        <span className="text-gray-400">•</span>
                                                                                        <span className="text-gray-500">
                                                                                            {part.vehicle.make} {part.vehicle.model} ({part.vehicle.year})
                                                                                        </span>
                                                                                    </>
                                                                                )}
                                                                            </div>

                                                                            {/* Input Controls */}
                                                                            <div className="flex flex-wrap items-center gap-3">
                                                                                {/* Quantity */}
                                                                                <div className="flex items-center">
                                                                                    <label className="text-xs text-gray-600 mr-2">Qty:</label>
                                                                                    <div className="flex items-center border border-gray-200 rounded">
                                                                                        <button
                                                                                            onClick={() => handleQuantityChange(item.partId, item.quantity - 1)}
                                                                                            className="p-1 hover:bg-gray-50 transition-colors"
                                                                                        >
                                                                                            <Minus className="w-3 h-3 text-gray-500" />
                                                                                        </button>
                                                                                        <input
                                                                                            type="number"
                                                                                            value={item.quantity}
                                                                                            onChange={(e) => handleQuantityChange(item.partId, parseInt(e.target.value) || 0)}
                                                                                            min="1"
                                                                                            max={stockAvailable}
                                                                                            className="w-12 text-center text-sm border-0 focus:ring-0"
                                                                                        />
                                                                                        <button
                                                                                            onClick={() => handleQuantityChange(item.partId, item.quantity + 1)}
                                                                                            disabled={item.quantity >= stockAvailable}
                                                                                            className="p-1 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                                        >
                                                                                            <Plus className="w-3 h-3 text-gray-500" />
                                                                                        </button>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Unit Price */}
                                                                                <div className="flex items-center">
                                                                                    <label className="text-xs text-gray-600 mr-2">Price:</label>
                                                                                    <div className="relative">
                                                                                        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                                                                                        <input
                                                                                            type="number"
                                                                                            value={item.unitPrice}
                                                                                            onChange={(e) => handleUnitPriceChange(item.partId, parseFloat(e.target.value) || 0)}
                                                                                            min="0"
                                                                                            step="0.01"
                                                                                            className="w-20 pl-4 pr-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                                                                        />
                                                                                    </div>
                                                                                </div>

                                                                                {/* Discount */}
                                                                                <div className="flex items-center">
                                                                                    <label className="text-xs text-gray-600 mr-2">Disc:</label>
                                                                                    <div className="relative">
                                                                                        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                                                                                        <input
                                                                                            type="number"
                                                                                            value={item.discount || 0}
                                                                                            onChange={(e) => handleDiscountChange(item.partId, parseFloat(e.target.value) || 0)}
                                                                                            min="0"
                                                                                            max={item.quantity * item.unitPrice}
                                                                                            step="0.01"
                                                                                            className="w-20 pl-4 pr-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                                                                        />
                                                                                    </div>
                                                                                </div>

                                                                                {/* Item Total */}
                                                                                <div className="flex items-center ml-auto">
                                                                                    {item.discount > 0 && (
                                                                                        <span className="text-xs text-gray-400 line-through mr-2">
                                                                                            {formatCurrency(item.quantity * item.unitPrice)}
                                                                                        </span>
                                                                                    )}
                                                                                    <span className="text-sm font-semibold text-gray-900">
                                                                                        {formatCurrency(itemTotal)}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Order Summary */}
                                        {orderItems.length > 0 && (
                                            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Subtotal:</span>
                                                        <span className="font-medium text-gray-900">{formatCurrency(calculateSubtotal())}</span>
                                                    </div>
                                                    {calculateTotalDiscount() > 0 && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Total Discount:</span>
                                                            <span className="font-medium text-red-600">-{formatCurrency(calculateTotalDiscount())}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between pt-2 border-t border-gray-200">
                                                        <span className="font-semibold text-gray-900">Order Total:</span>
                                                        <span className="text-lg font-bold text-purple-600">{formatCurrency(calculateOrderTotal())}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
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
                                                const part = getPartDetails(item.partId);
                                                if (!part) return null;

                                                const itemTotal = calculateItemTotal(item);

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
                                                    {formatCurrency(calculateOrderTotal())}
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


            {/* QR Scanner Modal */}
            <QRScannerModal
                isOpen={showScanner}
                onClose={() => setShowScanner(false)}
                onScan={handleQRScan}
                stayOpen={false} // Always close after one scan
            />
        </>
    );
};