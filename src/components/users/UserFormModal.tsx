// src/components/users/UserFormModal.tsx
import React, { useEffect, useState } from 'react';
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
    Eye,
    EyeOff
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { User } from '../../types/request/user';
import { createUserSchema, updateUserSchema, type CreateUserFormData, type UpdateUserFormData } from '../../validation/user.validation';

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    user?: User | null;
    mode: 'create' | 'edit';
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    user,
    mode,
}) => {
    const isEditMode = mode === 'edit';
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
        reset,
        setValue,
        watch,
    } = useForm<CreateUserFormData | UpdateUserFormData>({
        resolver: zodResolver(isEditMode ? updateUserSchema : createUserSchema),
    });

    const watchedRole = watch('role');
    const currentRole = watchedRole || (user?.role as any) || 'STAFF';

    const roleOptions = [
        { value: 'ADMIN', label: 'Administrator', description: 'Full system access', color: 'purple' },
        { value: 'MANAGER', label: 'Manager', description: 'Manage teams and reports', color: 'blue' },
        { value: 'DEV', label: 'Developer', description: 'Technical access', color: 'indigo' },
        { value: 'SALES', label: 'Sales', description: 'Sales operations', color: 'green' },
        { value: 'STAFF', label: 'Staff', description: 'General staff access', color: 'yellow' },
        { value: 'CUSTOMER', label: 'Customer', description: 'Customer portal access', color: 'gray' },
    ];

    const getRoleColor = (role: string) => {
        const option = roleOptions.find(opt => opt.value === role);
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
                    button: 'bg-purple-600 hover:bg-purple-700'
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
                    button: 'bg-blue-600 hover:bg-blue-700'
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
                    button: 'bg-indigo-600 hover:bg-indigo-700'
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
                    button: 'bg-green-600 hover:bg-green-700'
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
                    button: 'bg-yellow-600 hover:bg-yellow-700'
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
                    button: 'bg-gray-600 hover:bg-gray-700'
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
                    button: 'bg-red-600 hover:bg-red-700'
                };
        }
    };

    const colorClasses = getColorClasses(currentColor);

    useEffect(() => {
        if (isEditMode && user) {
            setValue('fullName', user.fullName);
            setValue('email', user.email);
            setValue('phoneNumber', user.phoneNumber);
            setValue('role', user.role as any);
            setValue('isActive', user.isActive);
        } else {
            reset();
        }
    }, [user, isEditMode, setValue, reset]);

    const handleFormSubmit = async (data: any) => {
        await onSubmit(data);
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-30 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay with blur */}
                <div
                    className="fixed inset-0 transition-opacity  bg-opacity-50 backdrop-blur-sm"
                    onClick={onClose}
                    aria-hidden="true"
                />

                {/* Center modal */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                    &#8203;
                </span>

                {/* Modal panel with animation */}
                <div className="relative inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full animate-in fade-in zoom-in duration-300 z-40">
                    {/* Header with dynamic gradient */}
                    <div className={`bg-gradient-to-r ${colorClasses.gradient} px-6 py-4`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                    <UserIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">
                                        {isEditMode ? 'Edit User' : 'Create New User'}
                                    </h3>
                                    <p className="text-xs text-white/80">
                                        {isEditMode ? 'Update user information' : 'Add a new user to the system'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(handleFormSubmit)}>
                        <div className="px-6 py-6 space-y-6">
                            {/* Personal Information Section */}
                            <div>
                                <div className="flex items-center space-x-2 mb-4">
                                    <div className={`w-8 h-8 ${colorClasses.bg} rounded-lg flex items-center justify-center`}>
                                        <Info className={`w-4 h-4 ${colorClasses.text}`} />
                                    </div>
                                    <h4 className="text-sm font-semibold text-gray-900">Personal Information</h4>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                {...register('fullName')}
                                                type="text"
                                                placeholder="John Doe"
                                                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm transition-all ${errors.fullName
                                                    ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                                                    : `border-gray-300 ${colorClasses.focusBorder} focus:ring-2 ${colorClasses.focusRing}`
                                                    } focus:outline-none`}
                                            />
                                        </div>
                                        {errors.fullName && (
                                            <p className="mt-1 text-xs text-red-600 flex items-center">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                {errors.fullName.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Email Address <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    {...register('email')}
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm transition-all ${errors.email
                                                        ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                                                        : `border-gray-300 ${colorClasses.focusBorder} focus:ring-2 ${colorClasses.focusRing}`
                                                        } focus:outline-none`}
                                                />
                                            </div>
                                            {errors.email && (
                                                <p className="mt-1 text-xs text-red-600 flex items-center">
                                                    <AlertCircle className="w-3 h-3 mr-1" />
                                                    {errors.email.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Phone Number <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    {...register('phoneNumber')}
                                                    type="tel"
                                                    placeholder="+1 (555) 123-4567"
                                                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm transition-all ${errors.phoneNumber
                                                        ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                                                        : `border-gray-300 ${colorClasses.focusBorder} focus:ring-2 ${colorClasses.focusRing}`
                                                        } focus:outline-none`}
                                                />
                                            </div>
                                            {errors.phoneNumber && (
                                                <p className="mt-1 text-xs text-red-600 flex items-center">
                                                    <AlertCircle className="w-3 h-3 mr-1" />
                                                    {errors.phoneNumber.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Role & Access Section */}
                            <div>
                                <div className="flex items-center space-x-2 mb-4">
                                    <div className={`w-8 h-8 ${colorClasses.bg} rounded-lg flex items-center justify-center`}>
                                        <Shield className={`w-4 h-4 ${colorClasses.text}`} />
                                    </div>
                                    <h4 className="text-sm font-semibold text-gray-900">Role & Access</h4>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            User Role <span className="text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {roleOptions.map((option) => {
                                                const optionColorClasses = getColorClasses(option.color);
                                                const isSelected = watchedRole === option.value;
                                                return (
                                                    <label
                                                        key={option.value}
                                                        className={`relative flex items-start p-3 border rounded-lg cursor-pointer transition-all ${isSelected
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
                                                            <p className={`text-sm font-medium ${isSelected ? `${optionColorClasses.text}` : 'text-gray-900'
                                                                }`}>
                                                                {option.label}
                                                            </p>
                                                            <p className={`text-xs mt-0.5 ${isSelected ? `${optionColorClasses.text}` : 'text-gray-500'
                                                                }`}>
                                                                {option.description}
                                                            </p>
                                                        </div>
                                                        {isSelected && (
                                                            <CheckCircle className={`w-5 h-5 ${optionColorClasses.text} flex-shrink-0`} />
                                                        )}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                        {errors.role && (
                                            <p className="mt-2 text-xs text-red-600 flex items-center">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                {errors.role.message}
                                            </p>
                                        )}
                                    </div>

                                    {!isEditMode && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Password <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    {...register('password')}
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Enter password"
                                                    className={`w-full pl-10 pr-10 py-2.5 border rounded-lg text-sm transition-all ${(errors as any).password
                                                        ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                                                        : `border-gray-300 ${colorClasses.focusBorder} focus:ring-2 ${colorClasses.focusRing}`
                                                        } focus:outline-none`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            {(errors as any).password && (
                                                <p className="mt-1 text-xs text-red-600 flex items-center">
                                                    <AlertCircle className="w-3 h-3 mr-1" />
                                                    {(errors as any).password.message}
                                                </p>
                                            )}
                                            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                                <p className="text-xs text-amber-800">
                                                    <strong>Password Requirements:</strong> Minimum 8 characters
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {isEditMode && (
                                        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                            <input
                                                {...register('isActive')}
                                                type="checkbox"
                                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                            />
                                            <label className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">Active Account</p>
                                                <p className="text-xs text-gray-500">User can access the system</p>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer - Fixed to be always visible */}
                        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
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
                                disabled={!isDirty && isEditMode}
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

