// src/components/users/UserDeleteModal.tsx
import React from 'react';
import { AlertTriangle, X, Trash2, Mail, Phone, Shield, Calendar, User2 } from 'lucide-react';
import type { User } from '../../types/request/user';

interface UserDeleteModalProps {
    isOpen: boolean;
    user: User | null;
    onClose: () => void;
    onConfirm: () => void;
}

export const UserDeleteModal: React.FC<UserDeleteModalProps> = ({
    isOpen,
    user,
    onClose,
    onConfirm,
}) => {
    if (!isOpen || !user) return null;

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Get role display name and color
    const getRoleInfo = (role: string) => {
        const roleConfig = {
            ADMIN: { name: 'Administrator', color: 'text-red-600 bg-red-100', severity: 'high' },
            MANAGER: { name: 'Manager', color: 'text-blue-600 bg-blue-100', severity: 'high' },
            DEV: { name: 'Developer', color: 'text-purple-600 bg-purple-100', severity: 'medium' },
            SALES: { name: 'Sales', color: 'text-green-600 bg-green-100', severity: 'medium' },
            STAFF: { name: 'Staff', color: 'text-orange-600 bg-orange-100', severity: 'medium' },
            CUSTOMER: { name: 'Customer', color: 'text-gray-600 bg-gray-100', severity: 'low' },
            UNKNOWN: { name: 'Unknown', color: 'text-gray-400 bg-gray-100', severity: 'low' },
        };
        return roleConfig[role as keyof typeof roleConfig] || roleConfig.UNKNOWN;
    };

    const roleInfo = getRoleInfo(user.role);

    // Get role-specific warnings
    const getRoleWarnings = (role: string) => {
        const warnings = {
            ADMIN: [
                'This user has full system administrator privileges',
                'Deleting an admin may affect system operations',
                'Ensure another admin exists to manage the system',
            ],
            MANAGER: [
                'This user has managerial access and permissions',
                'They may be managing other users or important data',
                'Verify no critical processes depend on this account',
            ],
            DEV: [
                'This user has developer-level access',
                'They may have access to development tools and systems',
                'Check if they are responsible for any ongoing projects',
            ],
            SALES: [
                'This user has sales team access',
                'They may have customer relationships or sales pipelines',
                'Consider transferring any active sales activities',
            ],
            STAFF: [
                'This user has staff-level access',
                'They may be involved in daily operations',
                'Verify no critical tasks are assigned to this account',
            ],
            CUSTOMER: [
                'This is a customer account',
                'Deleting will remove their order history and preferences',
                'Consider disabling instead of deleting for record keeping',
            ],
        };
        return warnings[role as keyof typeof warnings] || [];
    };

    const roleWarnings = getRoleWarnings(user.role);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md overflow-hidden bg-white rounded-lg shadow-xl">
                {/* Header */}
                <div className="px-6 py-6 bg-red-50">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                        <div className="flex-1 ml-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Confirm Delete User
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">
                                This action cannot be undone. Please confirm your decision.
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="ml-4 text-gray-400 hover:text-gray-500"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                    {/* User Information */}
                    <div className="p-4 rounded-lg bg-gray-50">
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                {user.profileImage ? (
                                    <img
                                        src={user.profileImage.url}
                                        alt={user.fullName}
                                        className="object-cover w-16 h-16 rounded-full"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full">
                                        <User2 className="w-8 h-8 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                    <p className="text-lg font-semibold text-gray-900 truncate">
                                        {user.fullName}
                                    </p>
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleInfo.color}`}
                                    >
                                        <Shield className="w-3 h-3 mr-1" />
                                        {roleInfo.name}
                                    </span>
                                </div>

                                <div className="mt-2 space-y-1 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <Mail className="w-4 h-4 mr-2" />
                                        <span className="truncate">{user.email}</span>
                                    </div>

                                    {user.phoneNumber && (
                                        <div className="flex items-center">
                                            <Phone className="w-4 h-4 mr-2" />
                                            <span>{user.phoneNumber}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        <span>Joined {formatDate(user.createdAt)}</span>
                                    </div>
                                </div>

                                <div className="flex items-center mt-2">
                                    <div
                                        className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                                            user.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        <div
                                            className={`w-1.5 h-1.5 rounded-full mr-1 ${
                                                user.isActive ? 'bg-green-500' : 'bg-red-500'
                                            }`}
                                        />
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Role-Based Warnings */}
                    {roleWarnings.length > 0 && (
                        <div className="p-4 mt-4 border rounded-lg bg-amber-50 border-amber-200">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                                </div>
                                <div className="ml-3">
                                    <h4 className="text-sm font-medium text-amber-800">
                                        Role-Specific Considerations
                                    </h4>
                                    <div className="mt-1 text-sm text-amber-700">
                                        <ul className="space-y-1 list-disc list-inside">
                                            {roleWarnings.map((warning, index) => (
                                                <li key={index}>{warning}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Active User Warning */}
                    {user.isActive && (
                        <div className="p-4 mt-3 border border-red-200 rounded-lg bg-red-50">
                            <div className="flex">
                                <AlertTriangle className="flex-shrink-0 w-5 h-5 text-red-600" />
                                <div className="ml-3">
                                    <h4 className="text-sm font-medium text-red-800">
                                        Active User Account
                                    </h4>
                                    <div className="mt-1 text-sm text-red-700">
                                        <p>This user currently has active access to the system.</p>
                                        <ul className="mt-1 space-y-1 list-disc list-inside">
                                            <li>They may be currently using the system</li>
                                            <li>Active sessions will be terminated immediately</li>
                                            <li>
                                                Consider disabling the account instead of deleting
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* General Warning */}
                    <div className="p-3 mt-3 border border-red-200 rounded-lg bg-red-50">
                        <div className="flex">
                            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                            <div className="ml-2">
                                <p className="text-sm font-medium text-red-800">
                                    Permanent Deletion
                                </p>
                                <p className="text-xs text-red-700 mt-0.5">
                                    All user data, preferences, and access will be permanently
                                    removed and cannot be recovered.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end px-6 py-4 space-x-3 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex items-center px-4 py-2 font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete User
                    </button>
                </div>
            </div>
        </div>
    );
};
