// src/components/categories/CategoryViewModal.tsx
import React from 'react';
import {
    X,
    Folder,
    Package,
    Calendar,
    Edit2,
    Trash2,
    ChevronRight,
    FolderOpen,
} from 'lucide-react';
import { Button } from '../ui/Button';
import type { CategoryWithChildren } from '../../types/request/category';
import { formatDistanceToNow } from 'date-fns';

interface CategoryViewModalProps {
    isOpen: boolean;
    category: CategoryWithChildren | null;
    onClose: () => void;
    onEdit: (category: CategoryWithChildren) => void;
    onDelete: (category: CategoryWithChildren) => void;
}

export const CategoryViewModal: React.FC<CategoryViewModalProps> = ({
    isOpen,
    category,
    onClose,
    onEdit,
    onDelete,
}) => {
    if (!isOpen || !category) return null;

    const hasChildren = category.children && category.children.length > 0;
    const productsCount = (category as any).productsCount || 0;

    // Build breadcrumb path
    const getBreadcrumb = () => {
        // This would normally come from the API or be calculated based on parentId
        return 'Auto Parts > Engine';
    };

    return (
        <div className="fixed inset-0 z-[90] overflow-y-auto">
            <div className=" flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed z-[90] inset-0 transition-opacity bg-opacity-50 backdrop-blur-sm"
                    onClick={onClose}
                />

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                <div className="z-[100] relative inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                    {/* Header with Image */}
                    <div className="relative h-48 bg-gradient-to-br from-red-500 to-red-600">
                        {category.image ? (
                            <img
                                src={category.image.url}
                                alt={category.name}
                                className="w-full h-full object-cover opacity-90"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                {hasChildren ? (
                                    <FolderOpen className="w-24 h-24 text-white/30" />
                                ) : (
                                    <Package className="w-24 h-24 text-white/30" />
                                )}
                            </div>
                        )}

                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 backdrop-blur-sm rounded-full p-2"
                        >
                            <X size={20} />
                        </button>

                        {/* Category Name */}
                        <div className="absolute bottom-4 left-6 right-6">
                            <h2 className="text-2xl font-bold text-white">{category.name}</h2>
                            <div className="flex items-center text-white/80 text-sm mt-1">
                                <ChevronRight className="w-4 h-4" />
                                <span>{getBreadcrumb()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6">
                        {/* Description */}
                        {category.description && (
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                                    Description
                                </h3>
                                <p className="text-sm text-gray-600">{category.description}</p>
                            </div>
                        )}

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center space-x-2">
                                    <Package className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <p className="text-xs text-gray-500">Products</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {productsCount}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center space-x-2">
                                    <Folder className="w-5 h-5 text-yellow-600" />
                                    <div>
                                        <p className="text-xs text-gray-500">Subcategories</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {category.children?.length || 0}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="w-5 h-5 text-green-600" />
                                    <div>
                                        <p className="text-xs text-gray-500">Created</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {formatDistanceToNow(new Date(category.createdAt), {
                                                addSuffix: true,
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="w-5 h-5 text-purple-600" />
                                    <div>
                                        <p className="text-xs text-gray-500">Updated</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {formatDistanceToNow(new Date(category.updatedAt), {
                                                addSuffix: true,
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Subcategories */}
                        {hasChildren && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                    Subcategories
                                </h3>
                                <div className="space-y-2">
                                    {category.children.map((child) => (
                                        <div
                                            key={child.id}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center space-x-3">
                                                {child.image ? (
                                                    <img
                                                        src={child.image.url}
                                                        alt={child.name}
                                                        className="w-8 h-8 rounded object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                                                        <Package className="w-4 h-4 text-gray-500" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {child.name}
                                                    </p>
                                                    {child.description && (
                                                        <p className="text-xs text-gray-500 truncate max-w-xs">
                                                            {child.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                                                {(child as any).productsCount > 0 && (
                                                    <span>
                                                        {(child as any).productsCount} items
                                                    </span>
                                                )}
                                                {child.children && child.children.length > 0 && (
                                                    <span>{child.children.length} subs</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                            ID:{' '}
                            <span className="font-mono text-gray-700">
                                {category.id.slice(0, 8)}...
                            </span>
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                icon={<Edit2 size={16} />}
                                onClick={() => onEdit(category)}
                            >
                                Edit
                            </Button>
                            {!hasChildren && productsCount === 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                                    icon={<Trash2 size={16} />}
                                    onClick={() => onDelete(category)}
                                >
                                    Delete
                                </Button>
                            )}
                            <Button variant="ghost" size="sm" onClick={onClose}>
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
