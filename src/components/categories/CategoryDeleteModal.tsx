// src/components/categories/CategoryDeleteModal.tsx
import React from 'react';
import { AlertTriangle, X, Trash2, Folder } from 'lucide-react';
import { Button } from '../ui/Button';
import type { CategoryWithChildren } from '../../types/request/category';

interface CategoryDeleteModalProps {
    isOpen: boolean;
    category: CategoryWithChildren | null;
    onClose: () => void;
    onConfirm: () => void;
}

export const CategoryDeleteModal: React.FC<CategoryDeleteModalProps> = ({
    isOpen,
    category,
    onClose,
    onConfirm,
}) => {
    if (!isOpen || !category) return null;

    const hasChildren = category.children && category.children.length > 0;
    const productsCount = (category as any).productsCount || 0;

    // This shouldn't happen based on our logic, but just in case
    if (hasChildren || productsCount > 0) {
        return (
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4">
                    <div
                        className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <div className="relative bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Cannot Delete Category
                        </h3>
                        <p className="text-gray-600 mb-4">
                            This category cannot be deleted because it:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-600 mb-6">
                            {hasChildren && (
                                <li>Contains {category.children.length} subcategories</li>
                            )}
                            {productsCount > 0 && <li>Has {productsCount} products</li>}
                        </ul>
                        <p className="text-sm text-gray-500 mb-6">
                            Please remove all subcategories and products before deleting this
                            category.
                        </p>
                        <Button variant="primary" onClick={onClose} className="w-full">
                            Understood
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                <div
                    className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm"
                    onClick={onClose}
                />

                <div className="relative bg-white rounded-xl max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                    {/* Header */}
                    <div className="bg-red-50 px-6 py-6">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                            <div className="ml-4 flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Delete Category
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
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <div className="flex items-center space-x-3">
                                {category.image ? (
                                    <img
                                        src={category.image.url}
                                        alt={category.name}
                                        className="w-12 h-12 rounded-lg object-cover"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                        <Folder className="w-6 h-6 text-gray-500" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        {category.name}
                                    </p>
                                    {category.description && (
                                        <p className="text-xs text-gray-500 truncate">
                                            {category.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                                </div>
                                <div className="ml-3">
                                    <h4 className="text-sm font-medium text-amber-800">
                                        Are you absolutely sure?
                                    </h4>
                                    <div className="mt-1 text-xs text-amber-700">
                                        <p>
                                            This will permanently delete the category "
                                            {category.name}".
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                        <Button variant="outline" size="sm" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                            icon={<Trash2 size={16} />}
                            onClick={onConfirm}
                        >
                            Delete Category
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
