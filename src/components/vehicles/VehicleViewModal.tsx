// src/components/vehicles/VehicleViewModal.tsx
import React, { useState } from 'react';
import {
    X,
    Car,
    Calendar,
    DollarSign,
    Tag,
    Edit2,
    Trash2,
    Wrench,
    CheckCircle,
    Clock,
    FileText,
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    ExternalLink,
    Hash,
    Info,
    Image as ImageIcon,
    Download,
    Share2,
    Printer,
    MoreVertical
} from 'lucide-react';
import type { Vehicle } from '../../types/request/vehicle';
import { formatCurrency } from '../../utils/formatCurrency';
import { format, formatDistanceToNow } from 'date-fns';

interface VehicleViewModalProps {
    isOpen: boolean;
    vehicle: Vehicle | null;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onMarkAsPartedOut: () => void;
}

export const VehicleViewModal: React.FC<VehicleViewModalProps> = ({
    isOpen,
    vehicle,
    onClose,
    onEdit,
    onDelete,
    onMarkAsPartedOut,
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showImageZoom, setShowImageZoom] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);

    if (!isOpen || !vehicle) return null;

    const hasImages = vehicle.images && vehicle.images.length > 0;
    const currentImage = hasImages ? vehicle.images[currentImageIndex] : null;

    const nextImage = () => {
        if (vehicle.images && currentImageIndex < vehicle.images.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        } else if (vehicle.images) {
            setCurrentImageIndex(0); // Loop back to first
        }
    };

    const prevImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        } else if (vehicle.images) {
            setCurrentImageIndex(vehicle.images.length - 1); // Loop to last
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `${vehicle.make} ${vehicle.model} ${vehicle.year}`,
                text: `Check out this ${vehicle.make} ${vehicle.model} - VIN: ${vehicle.vin}`,
                url: window.location.href,
            });
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden">
                    {/* Enhanced Header */}
                    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            }} />
                        </div>

                        <div className="relative px-6 py-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                                        <Car className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">
                                            {vehicle.make} {vehicle.model}
                                        </h2>
                                        <div className="flex items-center space-x-3 mt-1">
                                            <span className="text-sm text-gray-300">
                                                {vehicle.year}
                                            </span>
                                            <span className="text-gray-400">•</span>
                                            <span className="text-sm text-gray-300 font-mono">
                                                VIN: {vehicle.vin}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowMoreMenu(!showMoreMenu)}
                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                        >
                                            <MoreVertical className="w-5 h-5 text-white" />
                                        </button>
                                        {showMoreMenu && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                                                <button
                                                    onClick={handlePrint}
                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                >
                                                    <Printer className="w-4 h-4 mr-2" />
                                                    Print Details
                                                </button>
                                                <button
                                                    onClick={handleShare}
                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                >
                                                    <Share2 className="w-4 h-4 mr-2" />
                                                    Share
                                                </button>
                                                {currentImage && (
                                                    <a
                                                        href={currentImage.url}
                                                        download
                                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                    >
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Download Image
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-white" />
                                    </button>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className="absolute bottom-4 right-6">
                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${vehicle.isPartedOut
                                        ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                                        : 'bg-green-500/20 text-green-300 border border-green-500/30'
                                    }`}>
                                    {vehicle.isPartedOut ? (
                                        <>
                                            <Wrench className="w-4 h-4 mr-1.5" />
                                            Parted Out
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-4 h-4 mr-1.5" />
                                            Active
                                        </>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-y-auto max-h-[calc(95vh-180px)]">
                        {/* Enhanced Image Gallery */}
                        {hasImages ? (
                            <div className="relative bg-gradient-to-b from-gray-100 to-gray-50">
                                <div className="relative h-96 bg-white">
                                    <img
                                        src={currentImage!.url}
                                        alt={`${vehicle.make} ${vehicle.model}`}
                                        className="w-full h-full object-contain cursor-zoom-in"
                                        onClick={() => setShowImageZoom(true)}
                                    />

                                    {/* Gradient Overlays */}
                                    <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
                                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                                    {/* Navigation Buttons */}
                                    {vehicle.images.length > 1 && (
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
                                            {currentImageIndex + 1} / {vehicle.images.length}
                                        </span>
                                    </div>
                                </div>

                                {/* Thumbnail Strip */}
                                {vehicle.images.length > 1 && (
                                    <div className="px-6 py-4 bg-white border-t border-gray-200">
                                        <div className="flex space-x-2 overflow-x-auto pb-2">
                                            {vehicle.images.map((img, idx) => (
                                                <button
                                                    key={img.id}
                                                    onClick={() => setCurrentImageIndex(idx)}
                                                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${idx === currentImageIndex
                                                            ? 'border-blue-500 shadow-lg scale-105'
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
                                        <ImageIcon className="w-12 h-12 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500">No images available</p>
                                </div>
                            </div>
                        )}

                        {/* Vehicle Information Grid */}
                        <div className="p-6 space-y-6">
                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-blue-600 font-medium">Purchase Price</p>
                                            <p className="text-2xl font-bold text-blue-900 mt-1">
                                                {formatCurrency(vehicle.purchasePrice)}
                                            </p>
                                        </div>
                                        <div className="p-2 bg-blue-200/50 rounded-lg">
                                            <DollarSign className="w-5 h-5 text-blue-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 border border-green-200">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-green-600 font-medium">Purchase Date</p>
                                            <p className="text-lg font-bold text-green-900 mt-1">
                                                {format(new Date(vehicle.purchaseDate), 'MMM dd, yyyy')}
                                            </p>
                                            <p className="text-xs text-green-600 mt-0.5">
                                                {formatDistanceToNow(new Date(vehicle.purchaseDate), { addSuffix: true })}
                                            </p>
                                        </div>
                                        <div className="p-2 bg-green-200/50 rounded-lg">
                                            <Calendar className="w-5 h-5 text-green-600" />
                                        </div>
                                    </div>
                                </div>

                                {vehicle.auctionName && (
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm text-purple-600 font-medium">Auction</p>
                                                <p className="text-lg font-bold text-purple-900 mt-1">
                                                    {vehicle.auctionName}
                                                </p>
                                            </div>
                                            <div className="p-2 bg-purple-200/50 rounded-lg">
                                                <Tag className="w-5 h-5 text-purple-600" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Description Section */}
                            {vehicle.description && (
                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                    <div className="flex items-center space-x-2 mb-3">
                                        <FileText className="w-5 h-5 text-gray-600" />
                                        <h3 className="font-semibold text-gray-900">Description</h3>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {vehicle.description}
                                    </p>
                                </div>
                            )}

                            {/* Detailed Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-gray-900 flex items-center">
                                        <Info className="w-5 h-5 mr-2 text-gray-600" />
                                        Vehicle Details
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                            <span className="text-sm text-gray-600">Make</span>
                                            <span className="text-sm font-medium text-gray-900">{vehicle.make}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                            <span className="text-sm text-gray-600">Model</span>
                                            <span className="text-sm font-medium text-gray-900">{vehicle.model}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                            <span className="text-sm text-gray-600">Year</span>
                                            <span className="text-sm font-medium text-gray-900">{vehicle.year}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                            <span className="text-sm text-gray-600">VIN</span>
                                            <span className="text-sm font-mono font-medium text-gray-900">{vehicle.vin}</span>
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
                                            <span className="text-sm text-gray-600">Status</span>
                                            <span className={`text-sm font-medium ${vehicle.isActive ? 'text-green-600' : 'text-gray-500'
                                                }`}>
                                                {vehicle.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                            <span className="text-sm text-gray-600">Created</span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {format(new Date(vehicle.createdAt), 'MMM dd, yyyy')}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                            <span className="text-sm text-gray-600">Last Updated</span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {format(new Date(vehicle.updatedAt), 'MMM dd, yyyy')}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                            <span className="text-sm text-gray-600">ID</span>
                                            <span className="text-sm font-mono text-gray-500">
                                                {vehicle.id.slice(0, 8)}...
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Action Footer */}
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
                                    onClick={onMarkAsPartedOut}
                                    className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center space-x-2 ${vehicle.isPartedOut
                                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                                            : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                                        }`}
                                >
                                    {vehicle.isPartedOut ? (
                                        <>
                                            <CheckCircle className="w-4 h-4" />
                                            <span>Mark as Active</span>
                                        </>
                                    ) : (
                                        <>
                                            <Wrench className="w-4 h-4" />
                                            <span>Mark as Parted Out</span>
                                        </>
                                    )}
                                </button>
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

            {/* Enhanced Image Zoom Modal */}
            {showImageZoom && currentImage && (
                <div
                    className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
                    onClick={() => setShowImageZoom(false)}
                >
                    <div className="relative max-w-7xl max-h-full animate-fadeIn">
                        <img
                            src={currentImage.url}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            className="max-w-full max-h-[90vh] object-contain rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Navigation in Zoom */}
                        {vehicle.images.length > 1 && (
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
                                {currentImageIndex + 1} / {vehicle.images.length}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};