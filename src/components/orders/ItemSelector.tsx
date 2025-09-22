// src/components/orders/ItemSelector.tsx
import React, { useState } from 'react';
import {
    Search,
    Plus,
    Minus,
    Package,
    X,
    ShoppingCart,
    QrCode,
    Loader2,
    AlertCircle
} from 'lucide-react';
import type { Part } from '../../types/request/part';
import { formatCurrency } from '../../utils/formatCurrency';
import { QRScannerModal } from './QRScannerModal';

interface SelectedItem {
    partId: string;
    quantity: number;
    unitPrice: number;
    discount: number;
}

interface ItemSelectorProps {
    parts: Part[];
    selectedItems: SelectedItem[];
    onItemAdd: (part: Part) => void;
    onItemUpdate: (partId: string, quantity: number) => void;
    onItemRemove: (partId: string) => void;
    onDiscountUpdate: (partId: string, discount: number) => void;
}

export const ItemSelector: React.FC<ItemSelectorProps> = ({
    parts,
    selectedItems,
    onItemAdd,
    onItemUpdate,
    onItemRemove,
    onDiscountUpdate,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [showOnlyAvailable, setShowOnlyAvailable] = useState(true);
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock'>('name');
    const [showScanner, setShowScanner] = useState(false);
    const [lastScannedId, setLastScannedId] = useState<string | null>(null);
    const [scanQuantity, setScanQuantity] = useState(1);
    const [showQuantityDialog, setShowQuantityDialog] = useState(false);
    const [pendingPart, setPendingPart] = useState<Part | null>(null);

    // Extract unique categories safely
    const categories = Array.from(
        new Set(parts.map(p => p.category?.name || 'Uncategorized').filter(Boolean))
    );

    // Filter and sort parts
    const filteredParts = parts
        .filter(part => {
            const matchesSearch =
                part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                part.partNumber.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory =
                selectedCategory === 'all' ||
                (part.category?.name || 'Uncategorized') === selectedCategory;
            const matchesAvailability = !showOnlyAvailable || part.quantity > 0;
            return matchesSearch && matchesCategory && matchesAvailability;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'price':
                    return Number(a.price) - Number(b.price);
                case 'stock':
                    return b.quantity - a.quantity;
                default:
                    return a.name.localeCompare(b.name);
            }
        });

    // Handle QR code scan - stays open for multiple scans
    const handleQRScan = (data: string) => {
        try {
            // Parse QR data - expecting JSON with partId
            const qrData = JSON.parse(data);
            const partId = qrData.partId || qrData.id;

            if (!partId) {
                alert('Invalid QR code format');
                return;
            }

            const scannedPart = parts.find(p => p.id === partId);

            if (!scannedPart) {
                alert('Part not found in inventory');
                return;
            }

            if (scannedPart.quantity === 0) {
                alert(`${scannedPart.name} is out of stock`);
                return;
            }

            setLastScannedId(partId);
            setPendingPart(scannedPart);
            setShowQuantityDialog(true);
            setScanQuantity(1);

        } catch (error) {
            alert('Invalid QR code');
        }
    };

    // Confirm adding scanned part with quantity
    const confirmScannedPart = () => {
        if (!pendingPart) return;

        const existingItem = selectedItems.find(item => item.partId === pendingPart.id);

        if (existingItem) {
            const newQuantity = Math.min(
                existingItem.quantity + scanQuantity,
                pendingPart.quantity
            );
            onItemUpdate(pendingPart.id, newQuantity);
        } else {
            // Add the part first, then update quantity if needed
            onItemAdd(pendingPart);
            if (scanQuantity > 1) {
                setTimeout(() => {
                    onItemUpdate(pendingPart.id, Math.min(scanQuantity, pendingPart.quantity));
                }, 100);
            }
        }

        setShowQuantityDialog(false);
        setPendingPart(null);
        setScanQuantity(1);
    };

    // Get selected item details
    const getSelectedItem = (partId: string) => {
        return selectedItems.find(item => item.partId === partId);
    };

    // Calculate item subtotal
    const calculateItemTotal = (item: SelectedItem) => {
        return (item.quantity * item.unitPrice) - (item.discount || 0);
    };

    // Get stock status color
    const getStockStatusColor = (quantity: number) => {
        if (quantity === 0) return 'text-red-600 bg-red-50 border-red-200';
        if (quantity < 5) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-green-600 bg-green-50 border-green-200';
    };

    // Calculate total
    const calculateTotal = () => {
        return selectedItems.reduce((total, item) =>
            total + calculateItemTotal(item), 0
        );
    };

    return (
        <>
            <div className="space-y-4">
                {/* Search and Filters */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search parts by name or number..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        <button
                            onClick={() => setShowScanner(true)}
                            className="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                        >
                            <QrCode className="w-5 h-5 mr-2" />
                            Scan QR
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                        >
                            <option value="name">Sort by Name</option>
                            <option value="price">Sort by Price</option>
                            <option value="stock">Sort by Stock</option>
                        </select>

                        <label className="flex items-center cursor-pointer bg-white px-3 py-2 border border-gray-300 rounded-lg">
                            <input
                                type="checkbox"
                                checked={showOnlyAvailable}
                                onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                                className="mr-2 rounded text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700">Available only</span>
                        </label>
                    </div>
                </div>

                {/* Parts List */}
                <div className="bg-white rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
                    {filteredParts.length === 0 ? (
                        <div className="p-8 text-center">
                            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No parts found</p>
                            <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {filteredParts.map(part => {
                                const selectedItem = getSelectedItem(part.id);
                                const isMaxQuantity = (selectedItem?.quantity || 0) >= part.quantity;
                                const isLastScanned = lastScannedId === part.id;

                                return (
                                    <div
                                        key={part.id}
                                        className={`p-4 transition-all ${isLastScanned ? 'bg-purple-50 ring-2 ring-purple-500' : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-start space-x-4">
                                            {/* Part Image */}
                                            {part.images && part.images.length > 0 ? (
                                                <img
                                                    src={part.images[0].url}
                                                    alt={part.name}
                                                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                    <Package className="w-8 h-8 text-gray-400" />
                                                </div>
                                            )}

                                            {/* Part Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1 min-w-0 mr-4">
                                                        <h5 className="font-medium text-gray-900">
                                                            {part.name}
                                                            {isLastScanned && (
                                                                <span className="ml-2 text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">
                                                                    Just scanned
                                                                </span>
                                                            )}
                                                        </h5>
                                                        <p className="text-sm text-gray-500">
                                                            #{part.partNumber} • {part.category?.name || 'Uncategorized'}
                                                        </p>
                                                        {part.vehicle && (
                                                            <p className="text-xs text-gray-400 mt-1">
                                                                {part.vehicle.make} {part.vehicle.model} ({part.vehicle.year})
                                                            </p>
                                                        )}
                                                        <div className="flex items-center space-x-3 mt-2">
                                                            <span className="text-sm font-semibold text-purple-600">
                                                                {formatCurrency(Number(part.price))}
                                                            </span>
                                                            <span className={`text-xs px-2 py-0.5 rounded-full border ${getStockStatusColor(part.quantity)}`}>
                                                                {part.quantity} in stock
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex-shrink-0">
                                                        {!selectedItem ? (
                                                            <button
                                                                onClick={() => onItemAdd(part)}
                                                                disabled={part.quantity === 0}
                                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${part.quantity === 0
                                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                        : 'bg-purple-600 text-white hover:bg-purple-700'
                                                                    }`}
                                                            >
                                                                Add
                                                            </button>
                                                        ) : (
                                                            <div className="flex items-center space-x-2">
                                                                <div className="flex items-center border border-gray-300 rounded-lg">
                                                                    <button
                                                                        onClick={() => onItemUpdate(part.id, Math.max(0, selectedItem.quantity - 1))}
                                                                        className="p-1.5 hover:bg-gray-100 transition-colors"
                                                                    >
                                                                        <Minus size={14} />
                                                                    </button>
                                                                    <input
                                                                        type="number"
                                                                        value={selectedItem.quantity}
                                                                        onChange={(e) => {
                                                                            const val = parseInt(e.target.value) || 0;
                                                                            if (val <= part.quantity && val >= 0) {
                                                                                onItemUpdate(part.id, val);
                                                                            }
                                                                        }}
                                                                        className="w-12 text-center text-sm border-0 focus:ring-0"
                                                                    />
                                                                    // src/components/orders/ItemSelector.tsx (continued)
                                                                    <button
                                                                        onClick={() => onItemUpdate(part.id, selectedItem.quantity + 1)}
                                                                        disabled={isMaxQuantity}
                                                                        className="p-1.5 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                                                    >
                                                                        <Plus size={14} />
                                                                    </button>
                                                                </div>

                                                                <button
                                                                    onClick={() => onItemRemove(part.id)}
                                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                                >
                                                                    <X size={18} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Selected item discount */}
                                                {selectedItem && (
                                                    <div className="mt-2 flex items-center space-x-2">
                                                        <label className="text-xs text-gray-600">Discount:</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={selectedItem.discount || 0}
                                                            onChange={(e) => onDiscountUpdate(part.id, parseFloat(e.target.value) || 0)}
                                                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                                        />
                                                        <span className="text-xs text-gray-500">
                                                            Subtotal: {formatCurrency(calculateItemTotal(selectedItem))}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Selected Items Summary */}
                {selectedItems.length > 0 && (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                                <ShoppingCart className="w-5 h-5 text-green-600 mr-2" />
                                <h4 className="text-sm font-semibold text-green-900">
                                    Selected Items ({selectedItems.length})
                                </h4>
                            </div>
                            <span className="text-lg font-bold text-green-900">
                                {formatCurrency(calculateTotal())}
                            </span>
                        </div>
                        <div className="text-xs text-green-700">
                            {selectedItems.map(item => {
                                const part = parts.find(p => p.id === item.partId);
                                return part ? `${part.name} (${item.quantity})` : '';
                            }).filter(Boolean).join(', ')}
                        </div>
                    </div>
                )}
            </div>

            {/* QR Scanner Modal */}
            <QRScannerModal
                isOpen={showScanner}
                onClose={() => setShowScanner(false)}
                onScan={handleQRScan}
                stayOpen={true}
            />

            {/* Quantity Dialog for Scanned Items */}
            {showQuantityDialog && pendingPart && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Part Scanned Successfully
                        </h3>

                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <div className="flex items-center space-x-3">
                                {pendingPart.images && pendingPart.images.length > 0 ? (
                                    <img
                                        src={pendingPart.images[0].url}
                                        alt={pendingPart.name}
                                        className="w-12 h-12 rounded-lg object-cover"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                        <Package className="w-6 h-6 text-gray-400" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{pendingPart.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {formatCurrency(Number(pendingPart.price))} • {pendingPart.quantity} in stock
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Quantity to add:
                            </label>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setScanQuantity(Math.max(1, scanQuantity - 1))}
                                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                                >
                                    <Minus size={20} />
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    max={pendingPart.quantity}
                                    value={scanQuantity}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value) || 1;
                                        if (val > 0 && val <= pendingPart.quantity) {
                                            setScanQuantity(val);
                                        }
                                    }}
                                    className="w-24 px-3 py-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                />
                                <button
                                    onClick={() => setScanQuantity(Math.min(pendingPart.quantity, scanQuantity + 1))}
                                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => {
                                    setShowQuantityDialog(false);
                                    setPendingPart(null);
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmScannedPart}
                                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                                Add to Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};