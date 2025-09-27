// src/pages/users/UsersListPage.tsx
import React, { useState, useMemo } from 'react';
import { Plus, Search, Users as UsersIcon, UserCheck, Shield, TrendingUp } from 'lucide-react';
import { useUser } from '../../hooks/userHook';
import { UserTable } from '../../components/users/UserTable';
import { UserFormModal } from '../../components/users/UserFormModal';
import { Button } from '../../components/ui/Button';
import type { UserFilter, User } from '../../types/request/user';
import { useDebounce } from '../../hooks/useDebounce';
import NotificationToast from '../../components/notifications/NotificationToast';

export const UsersListPage: React.FC = () => {
    const { useGetAllUsers, useDeleteUser, useUpdateUser, useCreateUser } = useUser(); // Added useCreateUser

    const [filters, setFilters] = useState<UserFilter>({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [toast, setToast] = useState<{ message: string; title: string } | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<User | null>(null);
    const [formModal, setFormModal] = useState<{ isOpen: boolean; mode: 'create' | 'edit'; user?: User | null }>({
        isOpen: false,
        mode: 'create',
        user: null,
    });
    const [selectedImage, setSelectedImage] = useState<File | null>(null); // Added selectedImage state

    const debouncedSearch = useDebounce(searchTerm, 500);

    const { data, isLoading, refetch } = useGetAllUsers({
        ...filters,
        search: debouncedSearch,
    });

    const deleteMutation = useDeleteUser();
    const updateMutation = useUpdateUser();
    const createMutation = useCreateUser(); // Added create mutation

    const stats = useMemo(() => {
        if (!data?.items) return { total: 0, active: 0, admins: 0, newThisMonth: 0 };

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        return {
            total: data.meta?.total || data.items.length,
            active: data.items.filter(u => u.isActive).length,
            admins: data.items.filter(u => u.role === 'ADMIN').length,
            newThisMonth: data.items.filter(u => new Date(u.createdAt) >= startOfMonth).length,
        };
    }, [data]);

    const handleEdit = (user: User) => {
        setSelectedImage(null); // Reset image when opening edit modal
        setFormModal({ isOpen: true, mode: 'edit', user });
    };

    const handleCreate = () => {
        setSelectedImage(null); // Reset image when opening create modal
        setFormModal({ isOpen: true, mode: 'create', user: null });
    };

    const handleFormSubmit = async (data: any) => {
        try {
            // Prepare FormData for file upload
            const formData = new FormData();

            // Append all form fields
            Object.keys(data).forEach(key => {
                if (key !== 'image' && data[key] !== undefined && data[key] !== null) {
                    formData.append(key, data[key]);
                }
            });

            // Append image file if selected
            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            if (formModal.mode === 'edit' && formModal.user) {
                await updateMutation.mutateAsync({
                    id: formModal.user.id,
                    data: formData,
                });
                setToast({
                    message: 'User updated successfully',
                    title: 'User Updated',
                });
            } else {
                // Create user with FormData
                await createMutation.mutateAsync(formData);
                setToast({
                    message: 'User created successfully',
                    title: 'User Created',
                });
            }

            // Reset form and close modal
            setSelectedImage(null);
            setFormModal({ isOpen: false, mode: 'create', user: null });
            refetch();
        } catch (error) {
            console.error('Form submission error:', error);
            setToast({
                message: formModal.mode === 'edit' ? 'Failed to update user' : 'Failed to create user',
                title: formModal.mode === 'edit' ? 'Update error' : 'Create error',
            });
        }
    };

    const handleDelete = async (user: User) => {
        setDeleteConfirm(user);
    };

    const confirmDelete = async () => {
        if (!deleteConfirm) return;

        try {
            await deleteMutation.mutateAsync(deleteConfirm.id);
            setToast({
                message: 'User deleted successfully',
                title: 'User Deleted',
            });
            refetch();
        } catch (error) {
            setToast({
                message: 'Failed to delete user',
                title: 'Deletion Error',
            });
        } finally {
            setDeleteConfirm(null);
        }
    };

    const handleStatusToggle = async (user: User) => {
        try {
            await updateMutation.mutateAsync({
                id: user.id,
                data: { isActive: !user.isActive },
            });
            setToast({
                message: `User ${user.isActive ? 'deactivated' : 'activated'} successfully`,
                title: 'User Updated',
            });
            refetch();
        } catch (error) {
            setToast({
                message: 'Failed to update user status',
                title: 'Update Error',
            });
        }
    };

    // Update UserFormModal to pass selectedImage and setSelectedImage
    return (
        <>
            {toast && (
                <NotificationToast
                    notification={toast}
                    onClose={() => setToast(null)}
                />
            )}

            {/* User Form Modal */}
            <UserFormModal
                isOpen={formModal.isOpen}
                onClose={() => {
                    setSelectedImage(null);
                    setFormModal({ isOpen: false, mode: 'create', user: null });
                }}
                onSubmit={handleFormSubmit}
                user={formModal.user}
                mode={formModal.mode}
                selectedImage={selectedImage}
                onImageChange={setSelectedImage}
            />

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 bg-gray-500/50" onClick={() => setDeleteConfirm(null)} />
                        <div className="relative w-full max-w-md p-6 bg-white rounded-lg">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Confirm Delete</h3>
                            <p className="mb-6 text-gray-600">
                                Are you sure you want to delete <strong>{deleteConfirm.fullName}</strong>? This action cannot be undone.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setDeleteConfirm(null)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={confirmDelete}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    Delete User
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="px-4 py-8 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Manage system users and their roles
                            </p>
                        </div>
                        <Button
                            variant="primary"
                            icon={<Plus size={20} />}
                            onClick={handleCreate}
                        >
                            Add New User
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="p-4 mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <div className="relative">
                            <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                        </div>

                        <select
                            value={filters.role || ''}
                            onChange={(e) => setFilters({ ...filters, role: e.target.value as any || undefined })}
                            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="">All Roles</option>
                            <option value="ADMIN">Admin</option>
                            <option value="MANAGER">Manager</option>
                            <option value="DEV">Developer</option>
                            <option value="SALES">Sales</option>
                            <option value="STAFF">Staff</option>
                            <option value="CUSTOMER">Customer</option>
                        </select>

                        <select
                            value={filters.isActive === undefined ? '' : filters.isActive.toString()}
                            onChange={(e) => setFilters({
                                ...filters,
                                isActive: e.target.value === '' ? undefined : e.target.value === 'true'
                            })}
                            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="">All Status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>

                        <select
                            value={`${filters.sortBy}-${filters.sortOrder}`}
                            onChange={(e) => {
                                const [sortBy, sortOrder] = e.target.value.split('-');
                                setFilters({ ...filters, sortBy, sortOrder: sortOrder as any });
                            }}
                            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="fullName-ASC">Name (A-Z)</option>
                            <option value="fullName-DESC">Name (Z-A)</option>
                            <option value="email-ASC">Email (A-Z)</option>
                            <option value="role-ASC">Role</option>
                            <option value="createdAt-DESC">Newest First</option>
                            <option value="createdAt-ASC">Oldest First</option>
                        </select>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Users</p>
                                <p className="mt-1 text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                                <UsersIcon className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active Users</p>
                                <p className="mt-1 text-2xl font-bold text-gray-900">{stats.active}</p>
                            </div>
                            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                                <UserCheck className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Administrators</p>
                                <p className="mt-1 text-2xl font-bold text-gray-900">{stats.admins}</p>
                            </div>
                            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                                <Shield className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">New This Month</p>
                                <p className="mt-1 text-2xl font-bold text-gray-900">{stats.newThisMonth}</p>
                            </div>
                            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <UserTable
                    users={data?.items || []}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onStatusToggle={handleStatusToggle}
                    isLoading={isLoading}
                />

                {/* Pagination */}
                {data?.meta && (
                    <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-gray-700">
                            Showing {((filters.page! - 1) * filters.limit!) + 1} to{' '}
                            {Math.min(filters.page! * filters.limit!, data.meta.total)} of{' '}
                            {data.meta.total} results
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={!data.meta.hasPrev}
                                onClick={() => setFilters({ ...filters, page: filters.page! - 1 })}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={!data.meta.hasNext}
                                onClick={() => setFilters({ ...filters, page: filters.page! + 1 })}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};