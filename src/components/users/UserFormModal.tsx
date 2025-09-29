// src/components/users/UserFormModal.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
    X,
    User as UserIcon,
    Mail,
    Phone,
    Shield,
    Lock,
    Save,
    AlertCircle,
    CheckCircle,
    Info,
    Camera,
    Upload,
    Trash2,
    Image as ImageIcon,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { User, ProfileImage } from '../../types/request/user';
import {
    createUserSchema,
    updateUserSchema,
    type CreateUserFormData,
    type UpdateUserFormData,
    validateImageFile,
} from '../../validation/user.validation';

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    user?: User | null;
    mode: 'create' | 'edit';
    selectedImage: File | null;
    onImageChange: (file: File | null) => void;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    user,
    mode,
    selectedImage, // Receive from parent
    onImageChange, // Receive from parent
}) => {
    const isEditMode = mode === 'edit';
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
        reset,
        setValue,
        watch,
        setError,
        clearErrors,
    } = useForm<CreateUserFormData | UpdateUserFormData>({
        resolver: zodResolver(isEditMode ? updateUserSchema : createUserSchema),
    });

    const watchedRole = watch('role');
    const currentRole = watchedRole || (user?.role as any) || 'STAFF';

    const roleOptions = [
        {
            value: 'ADMIN',
            label: 'Administrator',
            description: 'Full system access',
            color: 'purple',
        },
        {
            value: 'MANAGER',
            label: 'Manager',
            description: 'Manage teams and reports',
            color: 'blue',
        },
        { value: 'DEV', label: 'Developer', description: 'Technical access', color: 'indigo' },
        { value: 'SALES', label: 'Sales', description: 'Sales operations', color: 'green' },
        { value: 'STAFF', label: 'Staff', description: 'General staff access', color: 'yellow' },
        {
            value: 'CUSTOMER',
            label: 'Customer',
            description: 'Customer portal access',
            color: 'gray',
        },
    ];

    const getRoleColor = (role: string) => {
        const option = roleOptions.find((opt) => opt.value === role);
        return option?.color || 'gray';
    };

    const currentColor = getRoleColor(currentRole);

    // Function to get color classes based on role
    const getColorClasses = (color: string) => {
        switch (color) {
            case 'purple':
                return {
                    gradient: 'from-purple-500 to-purple-600',
                    focusRing: 'focus:ring-purple-100',
                    focusBorder: 'focus:border-purple-500',
                    bg: 'bg-purple-50',
                    text: 'text-purple-600',
                    border: 'border-purple-500',
                    ring: 'ring-purple-200',
                    button: 'bg-purple-600 hover:bg-purple-700',
                };
            case 'blue':
                return {
                    gradient: 'from-blue-500 to-blue-600',
                    focusRing: 'focus:ring-blue-100',
                    focusBorder: 'focus:border-blue-500',
                    bg: 'bg-blue-50',
                    text: 'text-blue-600',
                    border: 'border-blue-500',
                    ring: 'ring-blue-200',
                    button: 'bg-blue-600 hover:bg-blue-700',
                };
            case 'indigo':
                return {
                    gradient: 'from-indigo-500 to-indigo-600',
                    focusRing: 'focus:ring-indigo-100',
                    focusBorder: 'focus:border-indigo-500',
                    bg: 'bg-indigo-50',
                    text: 'text-indigo-600',
                    border: 'border-indigo-500',
                    ring: 'ring-indigo-200',
                    button: 'bg-indigo-600 hover:bg-indigo-700',
                };
            case 'green':
                return {
                    gradient: 'from-green-500 to-green-600',
                    focusRing: 'focus:ring-green-100',
                    focusBorder: 'focus:border-green-500',
                    bg: 'bg-green-50',
                    text: 'text-green-600',
                    border: 'border-green-500',
                    ring: 'ring-green-200',
                    button: 'bg-green-600 hover:bg-green-700',
                };
            case 'yellow':
                return {
                    gradient: 'from-yellow-500 to-yellow-600',
                    focusRing: 'focus:ring-yellow-100',
                    focusBorder: 'focus:border-yellow-500',
                    bg: 'bg-yellow-50',
                    text: 'text-yellow-600',
                    border: 'border-yellow-500',
                    ring: 'ring-yellow-200',
                    button: 'bg-yellow-600 hover:bg-yellow-700',
                };
            case 'gray':
                return {
                    gradient: 'from-gray-500 to-gray-600',
                    focusRing: 'focus:ring-gray-100',
                    focusBorder: 'focus:border-gray-500',
                    bg: 'bg-gray-50',
                    text: 'text-gray-600',
                    border: 'border-gray-500',
                    ring: 'ring-gray-200',
                    button: 'bg-gray-600 hover:bg-gray-700',
                };
            default:
                return {
                    gradient: 'from-red-500 to-red-600',
                    focusRing: 'focus:ring-red-100',
                    focusBorder: 'focus:border-red-500',
                    bg: 'bg-red-50',
                    text: 'text-red-600',
                    border: 'border-red-500',
                    ring: 'ring-red-200',
                    button: 'bg-red-600 hover:bg-red-700',
                };
        }
    };

    const colorClasses = getColorClasses(currentColor);

    // Handle image selection - use onImageChange from props
    const handleImageSelect = (file: File) => {
        const validationError = validateImageFile(file);
        if (validationError) {
            setError('image', {
                type: 'manual',
                message: validationError,
            });
            return;
        }

        clearErrors('image');
        onImageChange(file); // Use parent's function instead of local state

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    // Handle file input change
    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleImageSelect(file);
        }
    };

    // Handle drag and drop
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            handleImageSelect(file);
        }
    };

    // Remove selected image - use onImageChange from props
    const handleRemoveImage = () => {
        onImageChange(null); // Use parent's function instead of local state
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        clearErrors('image');
    };

    // Trigger file input click
    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    // Format file size
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    useEffect(() => {
        if (isEditMode && user) {
            setValue('fullName', user.fullName);
            setValue('email', user.email);
            setValue('phoneNumber', user.phoneNumber);
            setValue('role', user.role as any);
            setValue('isActive', user.isActive);

            // Set existing profile image if available
            if (user.profileImage?.url) {
                setImagePreview(user.profileImage.url);
            }
        } else {
            reset();
            setImagePreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, [user, isEditMode, setValue, reset]);

    // Update image preview when selectedImage changes from parent
    useEffect(() => {
        if (selectedImage) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(selectedImage);
        } else if (!user?.profileImage?.url) {
            setImagePreview(null);
        }
    }, [selectedImage, user]);

    const handleFormSubmit = async (data: any) => {
        try {
            // Prepare form data with image file
            const formData = new FormData();

            // Append all form fields
            Object.keys(data).forEach((key) => {
                if (key !== 'image' && data[key] !== undefined && data[key] !== null) {
                    formData.append(key, data[key]);
                }
            });

            // Append image file if selected - using 'image' field name
            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            await onSubmit(formData);
            reset();
            onImageChange(null); // Reset image in parent
            setImagePreview(null);
            onClose();
        } catch (error) {
            console.error('Form submission error:', error);
            setError('root', {
                type: 'manual',
                message: 'Failed to submit form. Please try again.',
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-30 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay with blur */}
                <div
                    className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-50 backdrop-blur-sm"
                    onClick={onClose}
                    aria-hidden="true"
                />

                {/* Center modal */}
                <span
                    className="hidden sm:inline-block sm:align-middle sm:h-screen"
                    aria-hidden="true"
                >
                    &#8203;
                </span>

                {/* Modal panel with animation */}
                <div className="relative z-40 inline-block overflow-hidden text-left align-bottom transition-all duration-300 transform bg-white shadow-2xl rounded-xl sm:my-8 sm:align-middle sm:max-w-xl sm:w-full animate-in fade-in zoom-in">
                    {/* Header with dynamic gradient */}
                    <div className={`bg-gradient-to-r ${colorClasses.gradient} px-6 py-4`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm">
                                    <UserIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">
                                        {isEditMode ? 'Edit User' : 'Create New User'}
                                    </h3>
                                    <p className="text-xs text-white/80">
                                        {isEditMode
                                            ? 'Update user information'
                                            : 'Add a new user to the system'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="transition-colors text-white/80 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(handleFormSubmit)} encType="multipart/form-data">
                        <div className="px-6 py-6 space-y-6">
                            {/* Profile Image Section */}
                            <div>
                                <div className="flex items-center mb-4 space-x-2">
                                    <div
                                        className={`w-8 h-8 ${colorClasses.bg} rounded-lg flex items-center justify-center`}
                                    >
                                        <Camera className={`w-4 h-4 ${colorClasses.text}`} />
                                    </div>
                                    <h4 className="text-sm font-semibold text-gray-900">
                                        Profile Image
                                    </h4>
                                </div>

                                <div className="space-y-4">
                                    {/* Drag and Drop Area */}
                                    <div
                                        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                                            isDragging
                                                ? 'border-red-500 bg-red-50'
                                                : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                                        }`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={handleImageClick}
                                    >
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileInputChange}
                                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                            className="hidden"
                                        />

                                        {imagePreview ? (
                                            <div className="flex items-center justify-center space-x-6">
                                                {/* Image Preview */}
                                                <div className="relative">
                                                    <div className="w-20 h-20 overflow-hidden bg-white border-2 border-gray-200 rounded-full shadow-sm">
                                                        <img
                                                            src={imagePreview}
                                                            alt="Profile preview"
                                                            className="object-cover w-full h-full"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemoveImage();
                                                        }}
                                                        className="absolute flex items-center justify-center w-6 h-6 text-white transition-colors bg-red-500 rounded-full shadow-lg -top-1 -right-1 hover:bg-red-600"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>

                                                {/* Image Info */}
                                                <div className="text-left">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        Profile image selected
                                                    </p>
                                                    {selectedImage && (
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            {selectedImage.name} •{' '}
                                                            {formatFileSize(selectedImage.size)}
                                                        </p>
                                                    )}
                                                    <p className="mt-2 text-xs text-gray-400">
                                                        Click to change image
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-300 rounded-full">
                                                    <ImageIcon className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        Drag & drop or click to upload
                                                    </p>
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        JPG, PNG, GIF, WebP. Max 5MB.
                                                    </p>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    icon={<Upload className="w-4 h-4" />}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    Choose File
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Existing Image Info */}
                                    {isEditMode && user?.profileImage && !selectedImage && (
                                        <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <ImageIcon className="w-4 h-4 text-blue-600" />
                                                    <div>
                                                        <p className="text-xs font-medium text-blue-900">
                                                            Current profile image
                                                        </p>
                                                        <p className="text-xs text-blue-700">
                                                            {user.profileImage.format} •{' '}
                                                            {formatFileSize(user.profileImage.size)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleImageClick}
                                                    className="text-xs font-medium text-blue-600 hover:text-blue-800"
                                                >
                                                    Change
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {errors.image && (
                                        <div className="p-3 border border-red-200 rounded-lg bg-red-50">
                                            <p className="flex items-center text-xs text-red-600">
                                                <AlertCircle className="flex-shrink-0 w-3 h-3 mr-2" />
                                                {errors.image.message}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Personal Information Section */}
                            <div>
                                <div className="flex items-center mb-4 space-x-2">
                                    <div
                                        className={`w-8 h-8 ${colorClasses.bg} rounded-lg flex items-center justify-center`}
                                    >
                                        <Info className={`w-4 h-4 ${colorClasses.text}`} />
                                    </div>
                                    <h4 className="text-sm font-semibold text-gray-900">
                                        Personal Information
                                    </h4>
                                </div>

                                <div className="space-y-4">
                                    <Input
                                        label="Full Name"
                                        icon={<UserIcon size={16} />}
                                        placeholder="John Doe"
                                        error={errors.fullName?.message}
                                        {...register('fullName')}
                                    />

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <Input
                                            label="Email Address"
                                            type="email"
                                            icon={<Mail size={16} />}
                                            placeholder="john@example.com"
                                            error={errors.email?.message}
                                            {...register('email')}
                                        />

                                        <Input
                                            label="Phone Number"
                                            type="tel"
                                            icon={<Phone size={16} />}
                                            placeholder="+1 (555) 123-4567"
                                            error={errors.phoneNumber?.message}
                                            {...register('phoneNumber')}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Role & Access Section */}
                            <div>
                                <div className="flex items-center mb-4 space-x-2">
                                    <div
                                        className={`w-8 h-8 ${colorClasses.bg} rounded-lg flex items-center justify-center`}
                                    >
                                        <Shield className={`w-4 h-4 ${colorClasses.text}`} />
                                    </div>
                                    <h4 className="text-sm font-semibold text-gray-900">
                                        Role & Access
                                    </h4>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            User Role <span className="text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {roleOptions.map((option) => {
                                                const optionColorClasses = getColorClasses(
                                                    option.color
                                                );
                                                const isSelected = watchedRole === option.value;
                                                return (
                                                    <label
                                                        key={option.value}
                                                        className={`relative flex items-start p-3 border rounded-lg cursor-pointer transition-all ${
                                                            isSelected
                                                                ? `${optionColorClasses.border} ${optionColorClasses.bg} ring-2 ${optionColorClasses.ring}`
                                                                : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        <input
                                                            {...register('role')}
                                                            type="radio"
                                                            value={option.value}
                                                            className="sr-only"
                                                        />
                                                        <div className="flex-1">
                                                            <p
                                                                className={`text-sm font-medium ${
                                                                    isSelected
                                                                        ? `${optionColorClasses.text}`
                                                                        : 'text-gray-900'
                                                                }`}
                                                            >
                                                                {option.label}
                                                            </p>
                                                            <p
                                                                className={`text-xs mt-0.5 ${
                                                                    isSelected
                                                                        ? `${optionColorClasses.text}`
                                                                        : 'text-gray-500'
                                                                }`}
                                                            >
                                                                {option.description}
                                                            </p>
                                                        </div>
                                                        {isSelected && (
                                                            <CheckCircle
                                                                className={`w-5 h-5 ${optionColorClasses.text} flex-shrink-0`}
                                                            />
                                                        )}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                        {errors.role && (
                                            <p className="flex items-center mt-2 text-xs text-red-600">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                {errors.role.message}
                                            </p>
                                        )}
                                    </div>

                                    {!isEditMode && (
                                        <div>
                                            <Input
                                                label="Password"
                                                type="password"
                                                icon={<Lock size={16} />}
                                                placeholder="Enter password"
                                                error={(errors as any).password?.message}
                                                {...register('password')}
                                            />
                                            <div className="p-3 mt-2 border rounded-lg bg-amber-50 border-amber-200">
                                                <p className="text-xs text-amber-800">
                                                    <strong>Password Requirements:</strong> Minimum
                                                    8 characters
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {isEditMode && (
                                        <div className="flex items-center p-4 rounded-lg bg-gray-50">
                                            <input
                                                {...register('isActive')}
                                                type="checkbox"
                                                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                            />
                                            <label className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">
                                                    Active Account
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    User can access the system
                                                </p>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer - Fixed to be always visible */}
                        <div className="flex justify-end px-6 py-4 space-x-3 border-t border-gray-200 bg-gray-50">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                size="sm"
                                icon={<Save size={16} />}
                                isLoading={isSubmitting}
                                disabled={!isDirty && isEditMode && !selectedImage}
                                className={colorClasses.button}
                            >
                                {isEditMode ? 'Update User' : 'Create User'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
