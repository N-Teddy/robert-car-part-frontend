import React from 'react';
import {
    X,
    Mail,
    Phone,
    Calendar,
    Shield,
    Edit2,
    Clock,
    CheckCircle,
    XCircle,
    User as UserIcon,
    Briefcase,
    Hash
} from 'lucide-react';
import type { User } from '../../types/request/user';
import { Button } from '../ui/Button';

interface UserQuickViewModalProps {
    user: User;
    isOpen: boolean;
    onClose: () => void;
    onEdit?: (user: User) => void;
}

export const UserQuickViewModal: React.FC<UserQuickViewModalProps> = ({
    user,
    isOpen,
    onClose,
    onEdit,
}) => {
    if (!isOpen) return null;

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
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

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const roleConfig: Record<string, { color: string; bgGradient: string; icon: React.ReactNode }> = {
        ADMIN: {
            color: 'bg-purple-100 text-purple-800 border-purple-200',
            bgGradient: 'from-purple-500 to-purple-600',
            icon: <Shield className="w-3 h-3" />
        },
        MANAGER: {
            color: 'bg-blue-100 text-blue-800 border-blue-200',
            bgGradient: 'from-blue-500 to-blue-600',
            icon: <Briefcase className="w-3 h-3" />
        },
        DEV: {
            color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
            bgGradient: 'from-indigo-500 to-indigo-600',
            icon: <Hash className="w-3 h-3" />
        },
        SALES: {
            color: 'bg-green-100 text-green-800 border-green-200',
            bgGradient: 'from-green-500 to-green-600',
            icon: <UserIcon className="w-3 h-3" />
        },
        STAFF: {
            color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            bgGradient: 'from-yellow-500 to-yellow-600',
            icon: <UserIcon className="w-3 h-3" />
        },
        CUSTOMER: {
            color: 'bg-gray-100 text-gray-800 border-gray-200',
            bgGradient: 'from-gray-500 to-gray-600',
            icon: <UserIcon className="w-3 h-3" />
        },
        UNKNOWN: {
            color: 'bg-gray-100 text-gray-800 border-gray-200',
            bgGradient: 'from-gray-400 to-gray-500',
            icon: <UserIcon className="w-3 h-3" />
        },
    };

    const currentRoleConfig = roleConfig[user.role] || roleConfig.UNKNOWN;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay with blur */}
                <div
                    className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300 z-30"
                    onClick={onClose}
                    aria-hidden="true"
                />

                {/* Center modal hack for alignment */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                    &#8203;
                </span>

                {/* Modal panel with animation */}
                <div className="relative inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full animate-in fade-in zoom-in duration-300 z-40">
                    {/* Gradient Header */}
                    <div className={`bg-gradient-to-r ${currentRoleConfig.bgGradient} px-6 py-8 relative overflow-hidden`}>
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div
                                className="absolute inset-0"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.5'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                }}
                            />
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        {/* User Avatar and Basic Info */}
                        <div className="relative text-center">
                            <div className="inline-block relative">
                                <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-2xl ring-4 ring-white/30">
                                    {user.profileImage ? (
                                        <img
                                            src={user.profileImage.url}
                                            alt={user.fullName}
                                            className="h-24 w-24 rounded-full object-cover"
                                        />
                                    ) : (
                                        getInitials(user.fullName)
                                    )}
                                </div>
                                {user.isActive ? (
                                    <div className="absolute bottom-0 right-0 h-7 w-7 bg-green-500 rounded-full flex items-center justify-center ring-4 ring-white">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                ) : (
                                    <div className="absolute bottom-0 right-0 h-7 w-7 bg-red-500 rounded-full flex items-center justify-center ring-4 ring-white">
                                        <XCircle className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>
                            <h3 className="mt-4 text-2xl font-bold text-white">{user.fullName}</h3>
                            <p className="text-white/90 text-sm mt-1">{user.email}</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6">
                        {/* Role and Status Badges */}
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${currentRoleConfig.color}`}>
                                {currentRoleConfig.icon}
                                {user.role}
                            </span>
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${user.isActive
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-red-100 text-red-800 border border-red-200'
                                }`}>
                                {user.isActive ? 'Active Account' : 'Inactive Account'}
                            </span>
                        </div>

                        {/* Contact Information Grid */}
                        <div className="grid grid-cols-1 gap-4 mb-6">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Mail className="w-5 h-5 text-blue-600" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email Address</p>
                                        <p className="text-sm text-gray-900 mt-1">{user.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <Phone className="w-5 h-5 text-green-600" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</p>
                                        <p className="text-sm text-gray-900 mt-1">{user.phoneNumber}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline Information */}
                        <div className="border-t border-gray-200 pt-4">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Activity Timeline</h4>
                            <div className="space-y-3">
                                <div className="flex items-center text-sm">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                        <Calendar className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-600 text-xs">Account Created</p>
                                        <p className="text-gray-900 font-medium">{formatDate(user.createdAt)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center text-sm">
                                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                                        <Clock className="w-4 h-4 text-amber-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-600 text-xs">Last Modified</p>
                                        <p className="text-gray-900 font-medium">{formatDateTime(user.updatedAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                            ID: <span className="font-mono text-gray-700">{user.id.slice(0, 8)}...</span>
                        </div>
                        <div className="flex space-x-2">
                            {onEdit && (
                                <Button
                                    variant="primary"
                                    size="sm"
                                    icon={<Edit2 size={16} />}
                                    onClick={() => {
                                        onEdit(user);
                                        onClose();
                                    }}
                                >
                                    Edit User
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClose}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
