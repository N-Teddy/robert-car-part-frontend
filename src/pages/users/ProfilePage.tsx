// src/pages/users/ProfilePage.tsx
import React, { useState } from 'react';
import { User, Mail, Phone, Shield, Calendar, Save, Camera, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import { updateProfileSchema, type UpdateProfileFormData } from '../../validation/user.validation';
import { useAuthContext } from '../../context/AuthContext';
import { useUser } from '../../hooks/userHook';

export const ProfilePage: React.FC = () => {
    const { user } = useAuthContext();
    const { useGetProfile, useUpdateProfile } = useUser();
    const { data: profile, refetch } = useGetProfile();
    const updateMutation = useUpdateProfile();

    const [isEditing, setIsEditing] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [showPasswordChange, setShowPasswordChange] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        reset,
    } = useForm<UpdateProfileFormData>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            fullName: profile?.fullName || user?.fullName || '',
            email: profile?.email || user?.email || '',
            phoneNumber: profile?.phoneNumber || '',
        },
    });

    const onSubmit = async (data: UpdateProfileFormData) => {
        try {
            await updateMutation.mutateAsync(data);
            setToast({ message: 'Profile updated successfully', type: 'success' });
            setIsEditing(false);
            refetch();
        } catch (error) {
            setToast({ message: 'Failed to update profile', type: 'error' });
        }
    };

    const handleCancel = () => {
        reset();
        setIsEditing(false);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const currentProfile = profile || user;

    return (
        <>
            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}

            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage your personal information and account settings
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Profile Card */}
                        <div className="lg:col-span-1">
                            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                                <div className="text-center">
                                    {/* Avatar */}
                                    <div className="relative inline-block">
                                        <div className="flex items-center justify-center w-32 h-32 mx-auto text-3xl font-semibold text-white rounded-full bg-gradient-to-br from-red-500 to-red-600">
                                            {currentProfile?.profileImage ? (
                                                <img
                                                    src={currentProfile.profileImage.url}
                                                    alt={currentProfile.fullName}
                                                    className="object-cover w-32 h-32 rounded-full"
                                                />
                                            ) : (
                                                getInitials(currentProfile?.fullName || 'User')
                                            )}
                                        </div>
                                        <button className="absolute bottom-0 right-0 flex items-center justify-center w-10 h-10 transition-colors bg-white border border-gray-300 rounded-full hover:bg-gray-50">
                                            <Camera size={18} className="text-gray-600" />
                                        </button>
                                    </div>

                                    <h2 className="mt-4 text-xl font-semibold text-gray-900">
                                        {currentProfile?.fullName}
                                    </h2>
                                    <p className="text-sm text-gray-600">{currentProfile?.email}</p>

                                    {/* Role Badge */}
                                    <div className="mt-4">
                                        <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-purple-800 bg-purple-100 border border-purple-200 rounded-full">
                                            <Shield size={14} className="mr-1" />
                                            {currentProfile?.role}
                                        </span>
                                    </div>

                                    {/* Stats */}
                                    <div className="pt-6 mt-6 border-t border-gray-200">
                                        <div className="space-y-3 text-left">
                                            <div className="flex items-center text-sm">
                                                <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                                                <span className="text-gray-600">Joined:</span>
                                                <span className="ml-2 text-gray-900">
                                                    {currentProfile?.createdAt &&
                                                        formatDate(currentProfile.createdAt)}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                                <div
                                                    className={`w-2 h-2 rounded-full mr-3 ml-1 ${
                                                        currentProfile?.isActive
                                                            ? 'bg-green-500'
                                                            : 'bg-red-500'
                                                    }`}
                                                />
                                                <span className="text-gray-600">Status:</span>
                                                <span className="ml-2 text-gray-900">
                                                    {currentProfile?.isActive
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                                {/* Personal Information */}
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Personal Information
                                        </h3>
                                        {!isEditing ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setIsEditing(true)}
                                            >
                                                Edit Profile
                                            </Button>
                                        ) : (
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleCancel}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    icon={<Save size={16} />}
                                                    onClick={handleSubmit(onSubmit)}
                                                    disabled={!isDirty}
                                                >
                                                    Save Changes
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    <form className="space-y-4">
                                        <Input
                                            {...register('fullName')}
                                            label="Full Name"
                                            type="text"
                                            icon={<User size={18} />}
                                            disabled={!isEditing}
                                            error={errors.fullName?.message}
                                        />

                                        <Input
                                            {...register('email')}
                                            label="Email Address"
                                            type="email"
                                            icon={<Mail size={18} />}
                                            disabled={!isEditing}
                                            error={errors.email?.message}
                                        />

                                        <Input
                                            {...register('phoneNumber')}
                                            label="Phone Number"
                                            type="tel"
                                            icon={<Phone size={18} />}
                                            disabled={!isEditing}
                                            error={errors.phoneNumber?.message}
                                        />
                                    </form>
                                </div>

                                {/* Security Settings */}
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Security Settings
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-600">
                                                Manage your password and security preferences
                                            </p>
                                        </div>
                                    </div>

                                    {!showPasswordChange ? (
                                        <Button
                                            variant="outline"
                                            icon={<Lock size={18} />}
                                            onClick={() => setShowPasswordChange(true)}
                                        >
                                            Change Password
                                        </Button>
                                    ) : (
                                        <div className="space-y-4">
                                            <Input
                                                label="Current Password"
                                                type="password"
                                                icon={<Lock size={18} />}
                                            />
                                            <Input
                                                label="New Password"
                                                type="password"
                                                icon={<Lock size={18} />}
                                            />
                                            <Input
                                                label="Confirm New Password"
                                                type="password"
                                                icon={<Lock size={18} />}
                                            />
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setShowPasswordChange(false)}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button variant="primary">Update Password</Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Activity Log */}
                            <div className="p-6 mt-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                    Recent Activity
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="w-2 h-2 mt-2 mr-3 bg-green-500 rounded-full"></div>
                                        <div>
                                            <p className="text-sm text-gray-900">
                                                Login successful
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Today at 9:00 AM
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-2 h-2 mt-2 mr-3 bg-blue-500 rounded-full"></div>
                                        <div>
                                            <p className="text-sm text-gray-900">Profile updated</p>
                                            <p className="text-xs text-gray-500">
                                                Yesterday at 3:45 PM
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-2 h-2 mt-2 mr-3 bg-yellow-500 rounded-full"></div>
                                        <div>
                                            <p className="text-sm text-gray-900">
                                                Password changed
                                            </p>
                                            <p className="text-xs text-gray-500">3 days ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
