// src/components/users/UserTable.tsx
import React, { useState } from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import type { User } from '../../types/request/user';
import { UserQuickViewModal } from './UserQuickViewModal';

interface UserTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
    onStatusToggle: (user: User) => void;
    isLoading?: boolean;
}

const roleColors: Record<string, string> = {
    ADMIN: 'bg-purple-100 text-purple-800 border-purple-200',
    MANAGER: 'bg-blue-100 text-blue-800 border-blue-200',
    DEV: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    SALES: 'bg-green-100 text-green-800 border-green-200',
    STAFF: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    CUSTOMER: 'bg-gray-100 text-gray-800 border-gray-200',
    UNKNOWN: 'bg-gray-100 text-gray-800 border-gray-200',
};

export const UserTable: React.FC<UserTableProps> = ({
    users,
    onEdit,
    onDelete,
    onStatusToggle,
    isLoading,
}) => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showQuickView, setShowQuickView] = useState(false);

    const handleQuickView = (user: User) => {
        setSelectedUser(user);
        setShowQuickView(true);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getAvatarColor = (role: string) => {
        const colors: Record<string, string> = {
            ADMIN: 'from-purple-500 to-purple-600',
            MANAGER: 'from-blue-500 to-blue-600',
            DEV: 'from-indigo-500 to-indigo-600',
            SALES: 'from-green-500 to-green-600',
            STAFF: 'from-yellow-500 to-yellow-600',
            CUSTOMER: 'from-gray-500 to-gray-600',
            UNKNOWN: 'from-gray-400 to-gray-500',
        };
        return colors[role] || colors.UNKNOWN;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="animate-pulse">
                    <div className="h-12 bg-gray-50 border-b border-gray-200"></div>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="border-b border-gray-200 p-4">
                            <div className="flex items-center space-x-4">
                                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Phone
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div
                                                className={`h-10 w-10 rounded-full bg-gradient-to-br ${getAvatarColor(user.role)} flex items-center justify-center text-white font-semibold text-sm`}
                                            >
                                                {user.profileImage ? (
                                                    <img
                                                        src={user.profileImage.url}
                                                        alt={user.fullName}
                                                        className="h-10 w-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    getInitials(user.fullName)
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.fullName}
                                                </div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleColors[user.role]}`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => onStatusToggle(user)}
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${user.isActive
                                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                }`}
                                        >
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.phoneNumber}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(user.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                        <button
                                            onClick={() => handleQuickView(user)}
                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                            aria-label="View user details"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={() => onEdit(user)}
                                            className="text-blue-600 hover:text-blue-700 transition-colors"
                                            aria-label="Edit user"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(user)}
                                            className="text-red-600 hover:text-red-700 transition-colors"
                                            aria-label="Delete user"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick View Modal */}
            {selectedUser && (
                <UserQuickViewModal
                    user={selectedUser}
                    isOpen={showQuickView}
                    onClose={() => setShowQuickView(false)}
                    onEdit={onEdit}
                />
            )}
        </>
    );
};
