// src/components/categories/CategoryCard.tsx
import React from 'react';
import { Eye, Edit2, Trash2, Plus, Package, Folder } from 'lucide-react';
import type { CategoryWithChildren } from '../../types/request/category';

interface CategoryCardProps {
    category: CategoryWithChildren & { level: number };
    level: number;
    onView: (category: CategoryWithChildren) => void;
    onEdit: (category: CategoryWithChildren) => void;
    onDelete: (category: CategoryWithChildren) => void;
    onAddSubcategory: (parentId: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
    category,
    level,
    onView,
    onEdit,
    onDelete,
    onAddSubcategory,
}) => {
    const hasChildren = category.children && category.children.length > 0;
    const productsCount = (category as any).productsCount || 0;

    return (
        <div
            className={`group bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden ${level > 0 ? 'ml-' + (level * 4) : ''}`}
        >
            {/* Image Section */}
            <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200">
                {category.image ? (
                    <img
                        src={category.image.url}
                        alt={category.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        {hasChildren ? (
                            <Folder className="w-12 h-12 text-yellow-600" />
                        ) : (
                            <Package className="w-12 h-12 text-blue-600" />
                        )}
                    </div>
                )}

                {/* Level Indicator */}
                {level > 0 && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-xs text-white">
                        Subcategory
                    </div>
                )}

                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <button
                        onClick={() => onView(category)}
                        className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                        title="View"
                    >
                        <Eye size={18} />
                    </button>
                    <button
                        onClick={() => onEdit(category)}
                        className="p-2 bg-white rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit"
                    >
                        <Edit2 size={18} />
                    </button>
                    {!hasChildren && productsCount === 0 && (
                        <button
                            onClick={() => onDelete(category)}
                            className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 truncate">{category.name}</h3>
                {category.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {category.description}
                    </p>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                        {productsCount > 0 && (
                            <span className="flex items-center">
                                <Package className="w-3 h-3 mr-1" />
                                {productsCount} items
                            </span>
                        )}
                        {hasChildren && (
                            <span className="flex items-center">
                                <Folder className="w-3 h-3 mr-1" />
                                {category.children.length}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => onAddSubcategory(category.id)}
                        className="text-green-600 hover:text-green-700 transition-colors"
                        title="Add Subcategory"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
