// src/components/parts/PartFormModal.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
    X,
    Upload,
    Package,
    DollarSign,
    Hash,
    FileText,
    Car,
    FolderOpen,
    Info,
    Check,
    Loader2,
    Plus,
    Archive,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import type { Part } from '../../types/request/part';
import type { Vehicle } from '../../types/request/vehicle';
import type { Category } from '../../types/request/category';
import { Stepper } from '../ui/Stepper';

interface PartFormModalProps {
    isOpen: boolean;
    mode: 'create' | 'edit';
    part?: Part | null;
    vehicles: Vehicle[];
    categories: Category[];
    onClose: () => void;
    onSubmit: (data: any) => void;
}

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export const PartFormModal: React.FC<PartFormModalProps> = ({
    isOpen,
    mode,
    part,
    vehicles,
    categories,
    onClose,
    onSubmit,
}) => {
    const [formData, setFormData] = useState({
        name: '',
        partNumber: '',
        description: '',
        price: '',
        quantity: '',
        condition: 'New',
        vehicleId: '',
        categoryId: '',
    });
    const [images, setImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<any[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    // Stepper steps configuration
    const steps = [
        { id: 1, label: 'Basic Info', icon: Package },
        { id: 2, label: 'Pricing & Stock', icon: Archive },
        { id: 3, label: 'Images', icon: Upload },
    ];

    useEffect(() => {
        if (mode === 'edit' && part) {
            setFormData({
                name: part.name,
                partNumber: part.partNumber,
                description: part.description,
                price: part.price.toString(),
                quantity: part.quantity.toString(),
                condition: part.condition || 'New',
                vehicleId: part.vehicleId,
                categoryId: part.categoryId,
            });
            setExistingImages(part.images || []);
        } else {
            setFormData({
                name: '',
                partNumber: '',
                description: '',
                price: '',
                quantity: '',
                condition: 'New',
                vehicleId: '',
                categoryId: '',
            });
            setImages([]);
            setExistingImages([]);
        }
        setErrors({});
        setCurrentStep(1);
    }, [mode, part, isOpen]);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const validFiles = acceptedFiles.filter((file) => {
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
                alert(
                    `Maximum ${MAX_IMAGES} images allowed. You can add ${MAX_IMAGES - images.length - existingImages.length} more.`
                );
                return;
            }

            setImages((prev) => [...prev, ...validFiles]);
        },
        [images.length, existingImages.length]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
        },
        maxFiles: MAX_IMAGES,
        noClick: false,
        noKeyboard: true,
    });

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index: number) => {
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
    };

    // Step-specific validation
    const validateStep = (step: number) => {
        const newErrors: Record<string, string> = {};

        if (step === 1) {
            if (!formData.name.trim()) newErrors.name = 'Part name is required';
            if (!formData.partNumber.trim()) newErrors.partNumber = 'Part number is required';
            if (!formData.vehicleId) newErrors.vehicleId = 'Vehicle is required';
            if (!formData.categoryId) newErrors.categoryId = 'Category is required';
        }

        if (step === 2) {
            if (!formData.price || Number(formData.price) <= 0) {
                newErrors.price = 'Price must be a positive number';
            }
            if (formData.quantity === '' || Number(formData.quantity) < 0) {
                newErrors.quantity = 'Quantity must be 0 or greater';
            }
        }

        if (step === 3) {
            // Optional: Add image validation if needed
            // if (images.length === 0 && existingImages.length === 0) {
            //     newErrors.images = 'At least one image is required';
            // }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: keyof typeof formData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length));
        }
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent event bubbling

        // Only allow submission from the final step
        if (currentStep !== steps.length) {
            return;
        }

        if (!validateStep(3)) return; // Final validation

        setIsSubmitting(true);

        try {
            const submitData: any = {
                name: formData.name.trim(),
                partNumber: formData.partNumber.trim(),
                description: formData.description.trim(),
                price: Number(formData.price),
                quantity: Number(formData.quantity),
                condition: formData.condition || null,
                vehicleId: formData.vehicleId,
                categoryId: formData.categoryId,
                images: images.length > 0 ? images : undefined,
            };

            await onSubmit(submitData);
        } catch (error) {
            // Error handled in parent
        } finally {
            setIsSubmitting(false);
        }
    };

    // Prevent form submission on Enter key
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && currentStep !== steps.length) {
            e.preventDefault();
            // Optionally, you can make Enter key trigger "Next" instead
            if (currentStep < steps.length) {
                handleNext();
            }
        }
    };

    if (!isOpen) return null;

    const totalImages = images.length + existingImages.length;
    const canAddMore = totalImages < MAX_IMAGES;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div
                    className={`relative overflow-hidden ${
                        mode === 'create'
                            ? 'bg-gradient-to-br from-green-600 via-green-500 to-emerald-500'
                            : 'bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-500'
                    }`}
                >
                    {/* Decorative Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute w-24 h-24 bg-white rounded-full -top-4 -right-4"></div>
                        <div className="absolute w-32 h-32 bg-white rounded-full -bottom-4 -left-4"></div>
                    </div>

                    <div className="relative px-6 py-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
                                    {mode === 'create' ? (
                                        <Plus className="w-6 h-6 text-white" />
                                    ) : (
                                        <Package className="w-6 h-6 text-white" />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        {mode === 'create' ? 'Add New Part' : 'Edit Part'}
                                    </h2>
                                    <p className="text-xs text-white/80 mt-0.5">
                                        {mode === 'create'
                                            ? 'Add a new part to your inventory'
                                            : `Editing: ${part?.name}`}
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

                {/* Stepper */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <Stepper
                        steps={steps}
                        currentStep={currentStep}
                        onStepClick={setCurrentStep}
                        allowNavigation={true}
                        mode={mode}
                    />
                </div>

                {/* Form Content */}
                <div onKeyDown={handleKeyDown} className="overflow-y-auto max-h-[calc(90vh-200px)]">
                    <div className="p-6">
                        {/* Step 1: Basic Info */}
                        {currentStep === 1 && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
                                            <Package className="w-4 h-4 mr-1.5 text-gray-400" />
                                            Part Name <span className="ml-1 text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            className={`w-full px-4 py-2.5 rounded-lg border ${
                                                errors.name
                                                    ? 'border-red-300 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-green-500'
                                            } focus:ring-2 focus:border-transparent transition-all`}
                                            placeholder="e.g., Brake Pad Set"
                                        />
                                        {errors.name && (
                                            <p className="mt-1.5 text-xs text-red-600">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
                                            <Hash className="w-4 h-4 mr-1.5 text-gray-400" />
                                            Part Number <span className="ml-1 text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.partNumber}
                                            onChange={(e) =>
                                                handleChange(
                                                    'partNumber',
                                                    e.target.value.toUpperCase()
                                                )
                                            }
                                            className={`w-full px-4 py-2.5 rounded-lg border font-mono ${
                                                errors.partNumber
                                                    ? 'border-red-300 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-green-500'
                                            } focus:ring-2 focus:border-transparent transition-all`}
                                            placeholder="e.g., BP-12345"
                                        />
                                        {errors.partNumber && (
                                            <p className="mt-1.5 text-xs text-red-600">
                                                {errors.partNumber}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
                                            <Car className="w-4 h-4 mr-1.5 text-gray-400" />
                                            Vehicle <span className="ml-1 text-red-500">*</span>
                                        </label>
                                        <select
                                            value={formData.vehicleId}
                                            onChange={(e) =>
                                                handleChange('vehicleId', e.target.value)
                                            }
                                            className={`w-full px-4 py-2.5 rounded-lg border ${
                                                errors.vehicleId
                                                    ? 'border-red-300 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-green-500'
                                            } focus:ring-2 focus:border-transparent transition-all`}
                                        >
                                            <option value="">Select a vehicle</option>
                                            {vehicles.map((v) => (
                                                <option key={v.id} value={v.id}>
                                                    {v.make} {v.model} ({v.year}) - {v.vin}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.vehicleId && (
                                            <p className="mt-1.5 text-xs text-red-600">
                                                {errors.vehicleId}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
                                            <FolderOpen className="w-4 h-4 mr-1.5 text-gray-400" />
                                            Category <span className="ml-1 text-red-500">*</span>
                                        </label>
                                        <select
                                            value={formData.categoryId}
                                            onChange={(e) =>
                                                handleChange('categoryId', e.target.value)
                                            }
                                            className={`w-full px-4 py-2.5 rounded-lg border ${
                                                errors.categoryId
                                                    ? 'border-red-300 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-green-500'
                                            } focus:ring-2 focus:border-transparent transition-all`}
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.categoryId && (
                                            <p className="mt-1.5 text-xs text-red-600">
                                                {errors.categoryId}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
                                        <FileText className="w-4 h-4 mr-1.5 text-gray-400" />
                                        Description
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={formData.description}
                                        onChange={(e) =>
                                            handleChange('description', e.target.value)
                                        }
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                                        placeholder="Additional details about the part..."
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 2: Pricing & Stock */}
                        {currentStep === 2 && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
                                            <DollarSign className="w-4 h-4 mr-1.5 text-gray-400" />
                                            Price (FCFA){' '}
                                            <span className="ml-1 text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                min={0}
                                                step={100}
                                                value={formData.price}
                                                onChange={(e) =>
                                                    handleChange('price', e.target.value)
                                                }
                                                className={`w-full pl-12 pr-4 py-2.5 rounded-lg border ${
                                                    errors.price
                                                        ? 'border-red-300 focus:ring-red-500'
                                                        : 'border-gray-300 focus:ring-green-500'
                                                } focus:ring-2 focus:border-transparent transition-all`}
                                                placeholder="0"
                                            />
                                            <span className="absolute font-medium text-gray-500 -translate-y-1/2 left-3 top-1/2">
                                                FCFA
                                            </span>
                                        </div>
                                        {errors.price && (
                                            <p className="mt-1.5 text-xs text-red-600">
                                                {errors.price}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
                                            <Archive className="w-4 h-4 mr-1.5 text-gray-400" />
                                            Quantity <span className="ml-1 text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            value={formData.quantity}
                                            onChange={(e) =>
                                                handleChange('quantity', e.target.value)
                                            }
                                            className={`w-full px-4 py-2.5 rounded-lg border ${
                                                errors.quantity
                                                    ? 'border-red-300 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-green-500'
                                            } focus:ring-2 focus:border-transparent transition-all`}
                                            placeholder="0"
                                        />
                                        {errors.quantity && (
                                            <p className="mt-1.5 text-xs text-red-600">
                                                {errors.quantity}
                                            </p>
                                        )}
                                        {formData.quantity &&
                                            Number(formData.quantity) < 5 &&
                                            Number(formData.quantity) > 0 && (
                                                <p className="mt-1 text-xs text-yellow-600">
                                                    ⚠️ Low stock warning threshold is 5 units
                                                </p>
                                            )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-3 text-sm font-medium text-gray-700">
                                        Condition
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['New', 'Used', 'Refurbished'].map((condition) => (
                                            <label
                                                key={condition}
                                                className={`relative flex items-center justify-center px-4 py-3 border-2 rounded-lg cursor-pointer transition-all ${
                                                    formData.condition === condition
                                                        ? 'border-green-500 bg-green-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="condition"
                                                    value={condition}
                                                    checked={formData.condition === condition}
                                                    onChange={(e) =>
                                                        handleChange('condition', e.target.value)
                                                    }
                                                    className="sr-only"
                                                />
                                                <span
                                                    className={`text-sm font-medium ${
                                                        formData.condition === condition
                                                            ? 'text-green-700'
                                                            : 'text-gray-700'
                                                    }`}
                                                >
                                                    {condition}
                                                </span>
                                                {formData.condition === condition && (
                                                    <Check className="absolute w-4 h-4 text-green-600 top-2 right-2" />
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                                    <div className="flex">
                                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div className="ml-3">
                                            <p className="text-sm text-blue-800">Inventory Tips</p>
                                            <ul className="mt-1 text-xs text-blue-700 space-y-0.5">
                                                <li>
                                                    • Set accurate quantities to track stock levels
                                                </li>
                                                <li>
                                                    • Parts with less than 5 units will trigger low
                                                    stock alerts
                                                </li>
                                                <li>• Use consistent pricing for similar parts</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Images */}
                        {currentStep === 3 && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                                    <div className="flex">
                                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div className="ml-3">
                                            <p className="text-sm text-blue-800">
                                                Image Guidelines
                                            </p>
                                            <ul className="mt-1 text-xs text-blue-700 space-y-0.5">
                                                <li>• Maximum {MAX_IMAGES} images allowed</li>
                                                <li>
                                                    • Accepted formats: JPEG, PNG, GIF, WebP (no
                                                    SVG)
                                                </li>
                                                <li>• Maximum file size: 5MB per image</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Upload Area */}
                                {canAddMore && (
                                    <div
                                        {...getRootProps()}
                                        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                                            isDragActive
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                        }`}
                                    >
                                        <input {...getInputProps()} />
                                        <div className="flex flex-col items-center">
                                            <div
                                                className={`p-3 rounded-full ${
                                                    isDragActive ? 'bg-green-100' : 'bg-gray-100'
                                                }`}
                                            >
                                                <Upload
                                                    className={`w-8 h-8 ${
                                                        isDragActive
                                                            ? 'text-green-600'
                                                            : 'text-gray-400'
                                                    }`}
                                                />
                                            </div>
                                            <p className="mt-3 text-sm font-medium text-gray-700">
                                                {isDragActive
                                                    ? 'Drop images here'
                                                    : 'Drag & drop images here'}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                or click to browse
                                            </p>
                                            <p className="mt-2 text-xs text-gray-400">
                                                {totalImages}/{MAX_IMAGES} images
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Image Preview */}
                                {(existingImages.length > 0 || images.length > 0) && (
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                                        {existingImages.map((img, idx) => (
                                            <div key={img.id} className="relative group">
                                                <div className="overflow-hidden bg-gray-100 rounded-lg aspect-square">
                                                    <img
                                                        src={img.url}
                                                        alt={`Part ${idx + 1}`}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingImage(idx)}
                                                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                        {images.map((file, idx) => {
                                            const url = URL.createObjectURL(file);
                                            return (
                                                <div key={idx} className="relative group">
                                                    <div className="overflow-hidden bg-gray-100 rounded-lg aspect-square">
                                                        <img
                                                            src={url}
                                                            alt={`New ${idx + 1}`}
                                                            className="object-cover w-full h-full"
                                                        />
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
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer with Navigation */}
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500">
                                {mode === 'edit' && part && (
                                    <span>Editing part ID: {part.id.slice(0, 8)}...</span>
                                )}
                            </div>
                            <div className="flex space-x-3">
                                {/* Back Button (not shown on first step) */}
                                {currentStep > 1 && (
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors flex items-center space-x-2"
                                        disabled={isSubmitting}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        <span>Back</span>
                                    </button>
                                )}

                                {/* Cancel Button */}
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>

                                {/* Next/Submit Button */}
                                {currentStep < steps.length ? (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className={`px-5 py-2.5 rounded-lg font-medium text-white transition-all flex items-center space-x-2 ${
                                            mode === 'create'
                                                ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600'
                                                : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
                                        }`}
                                    >
                                        <span>Next</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className={`px-5 py-2.5 rounded-lg font-medium text-white transition-all flex items-center space-x-2 ${
                                            mode === 'create'
                                                ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600'
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
                                                <span>
                                                    {mode === 'create'
                                                        ? 'Create Part'
                                                        : 'Update Part'}
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
        </div>
    );
};
