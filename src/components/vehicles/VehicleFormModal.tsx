// src/components/vehicles/VehicleFormModal.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
    X,
    Upload,
    Image as ImageIcon,
    Car,
    AlertCircle,
    Calendar,
    DollarSign,
    Hash,
    FileText,
    Tag,
    Info,
    Check,
    Loader2,
    Sparkles,
    Plus
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import type { Vehicle } from '../../types/request/vehicle';

interface VehicleFormModalProps {
    isOpen: boolean;
    mode: 'create' | 'edit';
    vehicle?: Vehicle | null;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export const VehicleFormModal: React.FC<VehicleFormModalProps> = ({
    isOpen,
    mode,
    vehicle,
    onClose,
    onSubmit,
}) => {
    const [formData, setFormData] = useState({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        vin: '',
        description: '',
        purchasePrice: '',
        purchaseDate: '',
        auctionName: '',
        isPartedOut: false,
    });
    const [images, setImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<any[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<'basic' | 'purchase' | 'images'>('basic');

    useEffect(() => {
        if (mode === 'edit' && vehicle) {
            setFormData({
                make: vehicle.make,
                model: vehicle.model,
                year: vehicle.year,
                vin: vehicle.vin,
                description: vehicle.description,
                purchasePrice: vehicle.purchasePrice.toString(),
                purchaseDate: vehicle.purchaseDate,
                auctionName: vehicle.auctionName || '',
                isPartedOut: vehicle.isPartedOut,
            });
            setExistingImages(vehicle.images || []);
        } else {
            // Reset form for create mode
            setFormData({
                make: '',
                model: '',
                year: new Date().getFullYear(),
                vin: '',
                description: '',
                purchasePrice: '',
                purchaseDate: '',
                auctionName: '',
                isPartedOut: false,
            });
            setImages([]);
            setExistingImages([]);
        }
        setErrors({});
        setActiveTab('basic');
    }, [mode, vehicle, isOpen]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const validFiles = acceptedFiles.filter(file => {
            if (file.size > MAX_IMAGE_SIZE) {
                alert(`File ${file.name} is too large. Max size is 5MB.`);
                return false;
            }
            if (file.type === 'image/svg+xml') {
                alert(`SVG files are not allowed.`);
                return false;
            }
            return true;
        });

        const totalImages = images.length + existingImages.length + validFiles.length;
        if (totalImages > MAX_IMAGES) {
            alert(`Maximum ${MAX_IMAGES} images allowed. You can add ${MAX_IMAGES - images.length - existingImages.length} more.`);
            return;
        }

        setImages(prev => [...prev, ...validFiles]);
    }, [images.length, existingImages.length]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
        },
        maxFiles: MAX_IMAGES,
    });

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.make.trim()) newErrors.make = 'Make is required';
        if (!formData.model.trim()) newErrors.model = 'Model is required';
        if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear()) {
            newErrors.year = `Year must be between 1900 and ${new Date().getFullYear()}`;
        }
        if (!formData.vin.trim()) newErrors.vin = 'VIN is required';
        if (!formData.purchasePrice || Number(formData.purchasePrice) <= 0) {
            newErrors.purchasePrice = 'Purchase price must be a positive number';
        }
        if (!formData.purchaseDate) newErrors.purchaseDate = 'Purchase date is required';

        setErrors(newErrors);

        // Switch to the tab with the first error
        if (newErrors.make || newErrors.model || newErrors.year || newErrors.vin) {
            setActiveTab('basic');
        } else if (newErrors.purchasePrice || newErrors.purchaseDate) {
            setActiveTab('purchase');
        }

        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: keyof typeof formData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);

        try {
            const submitData: any = {
                make: formData.make.trim(),
                model: formData.model.trim(),
                year: Number(formData.year),
                vin: formData.vin.trim(),
                description: formData.description.trim(),
                purchasePrice: Number(formData.purchasePrice),
                purchaseDate: formData.purchaseDate,
                auctionName: formData.auctionName.trim() || undefined,
                isPartedOut: formData.isPartedOut,
                images: images.length > 0 ? images : undefined,
            };

            await onSubmit(submitData);
        } catch (error) {
            // Error handled in parent
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const totalImages = images.length + existingImages.length;
    const canAddMore = totalImages < MAX_IMAGES;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Enhanced Header */}
                <div className={`relative overflow-hidden ${mode === 'create'
                        ? 'bg-gradient-to-br from-red-600 via-red-500 to-orange-500'
                        : 'bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-500'
                    }`}>
                    {/* Decorative Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full"></div>
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white rounded-full"></div>
                    </div>

                    <div className="relative px-6 py-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className={`p-2.5 rounded-xl ${mode === 'create' ? 'bg-white/20' : 'bg-white/20'
                                    } backdrop-blur-sm`}>
                                    {mode === 'create' ? (
                                        <Sparkles className="w-6 h-6 text-white" />
                                    ) : (
                                        <Car className="w-6 h-6 text-white" />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        {mode === 'create' ? 'Add New Vehicle' : 'Edit Vehicle'}
                                    </h2>
                                    <p className="text-xs text-white/80 mt-0.5">
                                        {mode === 'create'
                                            ? 'Fill in the details to add a new vehicle to your inventory'
                                            : `Editing: ${vehicle?.make} ${vehicle?.model}`}
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

                {/* Tab Navigation */}
                <div className="border-b border-gray-200 bg-gray-50">
                    <div className="flex space-x-1 px-6">
                        {[
                            { id: 'basic', label: 'Basic Info', icon: Car },
                            { id: 'purchase', label: 'Purchase Details', icon: DollarSign },
                            { id: 'images', label: 'Images', icon: ImageIcon },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-all ${activeTab === tab.id
                                        ? mode === 'create'
                                            ? 'border-red-500 text-red-600 bg-white'
                                            : 'border-blue-500 text-blue-600 bg-white'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                <span className="font-medium text-sm">{tab.label}</span>
                                {tab.id === 'images' && totalImages > 0 && (
                                    <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${mode === 'create'
                                            ? 'bg-red-100 text-red-600'
                                            : 'bg-blue-100 text-blue-600'
                                        }`}>
                                        {totalImages}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-200px)]">
                    <div className="p-6">
                        {/* Basic Info Tab */}
                        {activeTab === 'basic' && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                            <Car className="w-4 h-4 mr-1.5 text-gray-400" />
                                            Make <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.make}
                                            onChange={(e) => handleChange('make', e.target.value)}
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.make
                                                    ? 'border-red-300 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-blue-500'
                                                } focus:ring-2 focus:border-transparent transition-all`}
                                            placeholder="e.g., Toyota"
                                        />
                                        {errors.make && (
                                            <p className="mt-1.5 text-xs text-red-600 flex items-center">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                {errors.make}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                            <Car className="w-4 h-4 mr-1.5 text-gray-400" />
                                            Model <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.model}
                                            onChange={(e) => handleChange('model', e.target.value)}
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.model
                                                    ? 'border-red-300 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-blue-500'
                                                } focus:ring-2 focus:border-transparent transition-all`}
                                            placeholder="e.g., Camry"
                                        />
                                        {errors.model && (
                                            <p className="mt-1.5 text-xs text-red-600 flex items-center">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                {errors.model}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                            <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
                                            Year <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            min={1900}
                                            max={new Date().getFullYear()}
                                            value={formData.year}
                                            onChange={(e) => handleChange('year', Number(e.target.value))}
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.year
                                                    ? 'border-red-300 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-blue-500'
                                                } focus:ring-2 focus:border-transparent transition-all`}
                                        />
                                        {errors.year && (
                                            <p className="mt-1.5 text-xs text-red-600 flex items-center">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                {errors.year}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                            <Hash className="w-4 h-4 mr-1.5 text-gray-400" />
                                            VIN <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.vin}
                                            onChange={(e) => handleChange('vin', e.target.value.toUpperCase())}
                                            className={`w-full px-4 py-2.5 rounded-lg border font-mono ${errors.vin
                                                    ? 'border-red-300 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-blue-500'
                                                } focus:ring-2 focus:border-transparent transition-all`}
                                            placeholder="Vehicle Identification Number"
                                        />
                                        {errors.vin && (
                                            <p className="mt-1.5 text-xs text-red-600 flex items-center">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                {errors.vin}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <FileText className="w-4 h-4 mr-1.5 text-gray-400" />
                                        Description
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={formData.description}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                        placeholder="Additional details about the vehicle (condition, features, history, etc.)"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        {formData.description.length}/500 characters
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Purchase Details Tab */}
                        {activeTab === 'purchase' && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                            <DollarSign className="w-4 h-4 mr-1.5 text-gray-400" />
                                            Purchase Price (FCFA) <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                min={0}
                                                step={1000}
                                                value={formData.purchasePrice}
                                                onChange={(e) => handleChange('purchasePrice', e.target.value)}
                                                className={`w-full pl-12 pr-4 py-2.5 rounded-lg border ${errors.purchasePrice
                                                        ? 'border-red-300 focus:ring-red-500'
                                                        : 'border-gray-300 focus:ring-blue-500'
                                                    } focus:ring-2 focus:border-transparent transition-all`}
                                                placeholder="0"
                                            />
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                                                FCFA
                                            </span>
                                        </div>
                                        {errors.purchasePrice && (
                                            <p className="mt-1.5 text-xs text-red-600 flex items-center">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                {errors.purchasePrice}
                                            </p>
                                        )}
                                        {formData.purchasePrice && (
                                            <p className="mt-1 text-xs text-gray-600">
                                                ≈ {Number(formData.purchasePrice).toLocaleString('fr-FR')} FCFA
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                            <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
                                            Purchase Date <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.purchaseDate}
                                            onChange={(e) => handleChange('purchaseDate', e.target.value)}
                                            max={new Date().toISOString().split('T')[0]}
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.purchaseDate
                                                    ? 'border-red-300 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-blue-500'
                                                } focus:ring-2 focus:border-transparent transition-all`}
                                        />
                                        {errors.purchaseDate && (
                                            <p className="mt-1.5 text-xs text-red-600 flex items-center">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                {errors.purchaseDate}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Tag className="w-4 h-4 mr-1.5 text-gray-400" />
                                        Auction Name
                                        <span className="ml-2 text-xs text-gray-500">(Optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.auctionName}
                                        onChange={(e) => handleChange('auctionName', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="e.g., Copart, IAAI, Manheim"
                                    />
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.isPartedOut}
                                            onChange={(e) => handleChange('isPartedOut', e.target.checked)}
                                            className="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                        />
                                        <div className="ml-3">
                                            <span className="text-sm font-medium text-gray-700">
                                                Mark as Parted Out
                                            </span>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Check this if the vehicle has already been dismantled for parts
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Images Tab */}
                        {activeTab === 'images' && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex">
                                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div className="ml-3">
                                            <p className="text-sm text-blue-800">Image Guidelines</p>
                                            <ul className="mt-1 text-xs text-blue-700 space-y-0.5">
                                                <li>• Maximum {MAX_IMAGES} images allowed</li>
                                                <li>• Accepted formats: JPEG, PNG, GIF, WebP (no SVG)</li>
                                                <li>• Maximum file size: 5MB per image</li>
                                                <li>• First image will be used as the primary display image</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Upload Area */}
                                {canAddMore && (
                                    <div
                                        {...getRootProps()}
                                        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragActive
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                            }`}
                                    >
                                        <input {...getInputProps()} />
                                        <div className="flex flex-col items-center">
                                            <div className={`p-3 rounded-full ${isDragActive ? 'bg-blue-100' : 'bg-gray-100'
                                                }`}>
                                                <Upload className={`w-8 h-8 ${isDragActive ? 'text-blue-600' : 'text-gray-400'
                                                    }`} />
                                            </div>
                                            <p className="mt-3 text-sm font-medium text-gray-700">
                                                {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                or click to browse from your computer
                                            </p>
                                            <p className="mt-2 text-xs text-gray-400">
                                                {totalImages}/{MAX_IMAGES} images uploaded
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Existing Images */}
                                {existingImages.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                                            Current Images
                                        </h4>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                            {existingImages.map((img, idx) => (
                                                <div key={img.id} className="relative group">
                                                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                                        <img
                                                            src={img.url}
                                                            alt={`Vehicle ${idx + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    {idx === 0 && (
                                                        <span className="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-md">
                                                            Primary
                                                        </span>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExistingImage(idx)}
                                                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* New Images */}
                                {images.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                                            New Images to Upload
                                        </h4>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                            {images.map((file, idx) => {
                                                const url = URL.createObjectURL(file);
                                                return (
                                                    <div key={idx} className="relative group">
                                                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                                            <img
                                                                src={url}
                                                                alt={`New ${idx + 1}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="absolute bottom-2 left-2 right-2">
                                                            <p className="text-xs text-white bg-black/50 rounded px-1 py-0.5 truncate">
                                                                {(file.size / 1024 / 1024).toFixed(1)}MB
                                                            </p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(idx)}
                                                            className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500">
                                {mode === 'edit' && vehicle && (
                                    <span>Editing vehicle ID: {vehicle.id.slice(0, 8)}...</span>
                                )}
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`px-5 py-2.5 rounded-lg font-medium text-white transition-all flex items-center space-x-2 ${mode === 'create'
                                            ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600'
                                            : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
                                        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            <span>{mode === 'create' ? 'Create Vehicle' : 'Update Vehicle'}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

