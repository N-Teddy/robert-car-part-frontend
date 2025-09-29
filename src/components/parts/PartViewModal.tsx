// src/components/parts/PartViewModal.tsx
import React, { useState } from 'react';
import {
    X,
    Package,
    DollarSign,
    Hash,
    Edit2,
    Trash2,
    Car,
    FolderOpen,
    Archive,
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    Download,
    Printer,
    QrCode,
    Clock,
    FileText,
    Info,
} from 'lucide-react';
import type { Part } from '../../types/request/part';
import type { Vehicle } from '../../types/request/vehicle';
import type { Category } from '../../types/request/category';
import { formatCurrency } from '../../utils/formatCurrency';
import { format, formatDistanceToNow } from 'date-fns';
import { QRCodeDisplay } from './QRCodeDisplay';

interface PartViewModalProps {
    isOpen: boolean;
    part: Part | null;
    vehicle?: Vehicle;
    category?: Category;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export const PartViewModal: React.FC<PartViewModalProps> = ({
    isOpen,
    part,
    vehicle,
    category,
    onClose,
    onEdit,
    onDelete,
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showImageZoom, setShowImageZoom] = useState(false);
    const [showQRCode, setShowQRCode] = useState(false);

    if (!isOpen || !part) return null;

    const hasImages = part.images && part.images.length > 0;
    const currentImage = hasImages ? part.images[currentImageIndex] : null;

    const nextImage = () => {
        if (part.images && currentImageIndex < part.images.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        } else if (part.images) {
            setCurrentImageIndex(0);
        }
    };

    const prevImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        } else if (part.images) {
            setCurrentImageIndex(part.images.length - 1);
        }
    };

    const getStockStatus = () => {
        if (part.quantity === 0) {
            return {
                color: 'red',
                text: 'Out of Stock',
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200',
            };
        } else if (part.quantity < 5) {
            return {
                color: 'yellow',
                text: 'Low Stock',
                bgColor: 'bg-yellow-50',
                borderColor: 'border-yellow-200',
            };
        }
        return {
            color: 'green',
            text: 'In Stock',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
        };
    };

    const stockStatus = getStockStatus();

    const getConditionBadge = () => {
        switch (part.condition) {
            case 'New':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Used':
                return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'Refurbished':
                return 'bg-purple-100 text-purple-700 border-purple-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
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
                                        <Package className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">
                                            {part.name}
                                        </h2>
                                        <div className="flex items-center space-x-3 mt-1">
                                            <span className="text-sm text-gray-300 font-mono">
                                                #{part.partNumber}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setShowQRCode(!showQRCode)}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                        title="Show QR Code"
                                    >
                                        <QrCode className="w-5 h-5 text-white" />
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-y-auto max-h-[calc(95vh-180px)]">
                        {/* QR Code Display */}
                        {showQRCode && (
                            <div className="bg-gray-50 border-b border-gray-200 p-6 flex justify-center">
                                <QRCodeDisplay
                                    partId={part.id}
                                    name={part.name}
                                    price={part.price}
                                    createdAt={part.createdAt}
                                />
                            </div>
                        )}

                        {/* Image Gallery */}
                        {hasImages ? (
                            <div className="relative bg-gradient-to-b from-gray-100 to-gray-50">
                                <div className="relative h-96 bg-white">
                                    <img
                                        src={currentImage!.url}
                                        alt={part.name}
                                        className="w-full h-full object-contain cursor-zoom-in"
                                        onClick={() => setShowImageZoom(true)}
                                    />

                                    {/* Navigation Buttons */}
                                    {part.images.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
                                            >
                                                <ChevronLeft size={24} className="text-gray-700" />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
                                            >
                                                <ChevronRight size={24} className="text-gray-700" />
                                            </button>
                                        </>
                                    )}

                                    {/* Zoom Button */}
                                    <button
                                        onClick={() => setShowImageZoom(true)}
                                        className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-all"
                                    >
                                        <ZoomIn size={20} className="text-gray-700" />
                                    </button>

                                    {/* Image Counter */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                                        <span className="text-sm font-medium text-gray-700">
                                            {currentImageIndex + 1} / {part.images.length}
                                        </span>
                                    </div>
                                </div>

                                {/* Thumbnail Strip */}
                                {part.images.length > 1 && (
                                    <div className="px-6 py-4 bg-white border-t border-gray-200">
                                        <div className="flex space-x-2 overflow-x-auto pb-2">
                                            {part.images.map((img, idx) => (
                                                <button
                                                    key={img.id}
                                                    onClick={() => setCurrentImageIndex(idx)}
                                                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                                        idx === currentImageIndex
                                                            ? 'border-green-500 shadow-lg scale-105'
                                                            : 'border-gray-300 hover:border-gray-400'
                                                    }`}
                                                >
                                                    <img
                                                        src={img.url}
                                                        alt={`Thumbnail ${idx + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-gradient-to-b from-gray-100 to-gray-50 p-12">
                                <div className="text-center">
                                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Package className="w-12 h-12 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500">No images available</p>
                                </div>
                            </div>
                        )}

                        {/* Part Information */}
                        <div className="p-6 space-y-6">
                            {/* Stock Alert */}
                            {stockStatus.color !== 'green' && (
                                <div
                                    className={`${stockStatus.bgColor} ${stockStatus.borderColor} border rounded-lg p-4`}
                                >
                                    <div className="flex items-start">
                                        <AlertTriangle
                                            className={`w-5 h-5 ${
                                                stockStatus.color === 'red'
                                                    ? 'text-red-600'
                                                    : 'text-yellow-600'
                                            } mt-0.5 mr-3`}
                                        />
                                        <div>
                                            <p
                                                className={`font-semibold ${
                                                    stockStatus.color === 'red'
                                                        ? 'text-red-900'
                                                        : 'text-yellow-900'
                                                }`}
                                            >
                                                {stockStatus.text}
                                            </p>
                                            <p
                                                className={`text-sm mt-1 ${
                                                    stockStatus.color === 'red'
                                                        ? 'text-red-700'
                                                        : 'text-yellow-700'
                                                }`}
                                            >
                                                {stockStatus.color === 'red'
                                                    ? 'This part is currently out of stock and needs immediate restocking.'
                                                    : `Only ${part.quantity} units remaining. Consider restocking soon.`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 border border-green-200">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-green-600 font-medium">
                                                Price
                                            </p>
                                            <p className="text-2xl font-bold text-green-900 mt-1">
                                                {formatCurrency(part.price)}
                                            </p>
                                        </div>
                                        <div className="p-2 bg-green-200/50 rounded-lg">
                                            <DollarSign className="w-5 h-5 text-green-600" />
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className={`bg-gradient-to-br ${
                                        stockStatus.color === 'green'
                                            ? 'from-blue-50 to-blue-100/50 border-blue-200'
                                            : stockStatus.color === 'yellow'
                                              ? 'from-yellow-50 to-yellow-100/50 border-yellow-200'
                                              : 'from-red-50 to-red-100/50 border-red-200'
                                    } rounded-xl p-4 border`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p
                                                className={`text-sm font-medium ${
                                                    stockStatus.color === 'green'
                                                        ? 'text-blue-600'
                                                        : stockStatus.color === 'yellow'
                                                          ? 'text-yellow-600'
                                                          : 'text-red-600'
                                                }`}
                                            >
                                                Stock Level
                                            </p>
                                            <p
                                                className={`text-2xl font-bold mt-1 ${
                                                    stockStatus.color === 'green'
                                                        ? 'text-blue-900'
                                                        : stockStatus.color === 'yellow'
                                                          ? 'text-yellow-900'
                                                          : 'text-red-900'
                                                }`}
                                            >
                                                {part.quantity} units
                                            </p>
                                        </div>
                                        <div
                                            className={`p-2 rounded-lg ${
                                                stockStatus.color === 'green'
                                                    ? 'bg-blue-200/50'
                                                    : stockStatus.color === 'yellow'
                                                      ? 'bg-yellow-200/50'
                                                      : 'bg-red-200/50'
                                            }`}
                                        >
                                            <Archive
                                                className={`w-5 h-5 ${
                                                    stockStatus.color === 'green'
                                                        ? 'text-blue-600'
                                                        : stockStatus.color === 'yellow'
                                                          ? 'text-yellow-600'
                                                          : 'text-red-600'
                                                }`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {part.condition && (
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm text-purple-600 font-medium">
                                                    Condition
                                                </p>
                                                <p className="text-lg font-bold text-purple-900 mt-1">
                                                    {part.condition}
                                                </p>
                                            </div>
                                            <div className="p-2 bg-purple-200/50 rounded-lg">
                                                <Info className="w-5 h-5 text-purple-600" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            {part.description && (
                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                    <div className="flex items-center space-x-2 mb-3">
                                        <FileText className="w-5 h-5 text-gray-600" />
                                        <h3 className="font-semibold text-gray-900">Description</h3>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {part.description}
                                    </p>
                                </div>
                            )}

                            {/* Detailed Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-gray-900 flex items-center">
                                        <Package className="w-5 h-5 mr-2 text-gray-600" />
                                        Part Details
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                            <span className="text-sm text-gray-600">
                                                Part Number
                                            </span>
                                            <span className="text-sm font-mono font-medium text-gray-900">
                                                {part.partNumber}
                                            </span>
                                        </div>
                                        {vehicle && (
                                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                                <span className="text-sm text-gray-600">
                                                    Vehicle
                                                </span>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {vehicle.make} {vehicle.model} ({vehicle.year})
                                                </span>
                                            </div>
                                        )}
                                        {category && (
                                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                                <span className="text-sm text-gray-600">
                                                    Category
                                                </span>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {category.name}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                            <span className="text-sm text-gray-600">
                                                Total Value
                                            </span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {formatCurrency(Number(part.price) * part.quantity)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-semibold text-gray-900 flex items-center">
                                        <Clock className="w-5 h-5 mr-2 text-gray-600" />
                                        System Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                            <span className="text-sm text-gray-600">Created</span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {format(new Date(part.createdAt), 'MMM dd, yyyy')}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                            <span className="text-sm text-gray-600">
                                                Last Updated
                                            </span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {format(new Date(part.updatedAt), 'MMM dd, yyyy')}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                            <span className="text-sm text-gray-600">Age</span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {formatDistanceToNow(new Date(part.createdAt), {
                                                    addSuffix: true,
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                            <span className="text-sm text-gray-600">ID</span>
                                            <span className="text-sm font-mono text-gray-500">
                                                {part.id.slice(0, 8)}...
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Footer */}
                    <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                            >
                                Close
                            </button>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={onEdit}
                                    className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-medium transition-all flex items-center space-x-2"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    <span>Edit</span>
                                </button>
                                <button
                                    onClick={onDelete}
                                    className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 font-medium transition-all flex items-center space-x-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Zoom Modal */}
            {showImageZoom && currentImage && (
                <div
                    className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
                    onClick={() => setShowImageZoom(false)}
                >
                    <div className="relative max-w-7xl max-h-full animate-fadeIn">
                        <img
                            src={currentImage.url}
                            alt={part.name}
                            className="max-w-full max-h-[90vh] object-contain rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Navigation in Zoom */}
                        {part.images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        prevImage();
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all"
                                >
                                    <ChevronLeft size={24} className="text-white" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        nextImage();
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all"
                                >
                                    <ChevronRight size={24} className="text-white" />
                                </button>
                            </>
                        )}

                        {/* Close Button */}
                        <button
                            onClick={() => setShowImageZoom(false)}
                            className="absolute top-4 right-4 p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all"
                        >
                            <X size={24} className="text-white" />
                        </button>

                        {/* Image Counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                            <span className="text-white font-medium">
                                {currentImageIndex + 1} / {part.images.length}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
