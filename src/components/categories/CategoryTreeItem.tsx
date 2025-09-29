// src/components/categories/CategoryTreeItem.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    ChevronRight,
    ChevronDown,
    Eye,
    Edit2,
    Trash2,
    Plus,
    GripVertical,
    Folder,
    FolderOpen,
    Package,
} from 'lucide-react';
import type { CategoryWithChildren } from '../../types/request/category';

interface CategoryTreeItemProps {
    category: CategoryWithChildren;
    level: number;
    isExpanded: boolean;
    expandedNodes: string[];
    onToggleExpand: (nodeId: string) => void;
    onView: (category: CategoryWithChildren) => void;
    onEdit: (category: CategoryWithChildren) => void;
    onDelete: (category: CategoryWithChildren) => void;
    onAddSubcategory: (parentId: string) => void;
}

export const CategoryTreeItem: React.FC<CategoryTreeItemProps> = ({
    category,
    level,
    isExpanded,
    expandedNodes,
    onToggleExpand,
    onView,
    onEdit,
    onDelete,
    onAddSubcategory,
}) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: category.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const hasChildren = category.children && category.children.length > 0;
    const productsCount = (category as any).productsCount || 0;

    const getCategoryIcon = () => {
        if (hasChildren) {
            return isExpanded ? (
                <FolderOpen className="w-5 h-5 text-yellow-600" />
            ) : (
                <Folder className="w-5 h-5 text-yellow-600" />
            );
        }
        return <Package className="w-5 h-5 text-blue-600" />;
    };

    return (
        <div ref={setNodeRef} style={style}>
            <div
                className={`group flex items-center py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors ${
                    isDragging ? 'bg-gray-100' : ''
                }`}
                style={{ paddingLeft: `${level * 24 + 12}px` }}
            >
                {/* Drag Handle */}
                <div
                    {...attributes}
                    {...listeners}
                    className="flex-shrink-0 cursor-move opacity-0 group-hover:opacity-100 transition-opacity mr-2"
                >
                    <GripVertical className="w-4 h-4 text-gray-400" />
                </div>

                {/* Expand/Collapse Arrow */}
                <button
                    onClick={() => onToggleExpand(category.id)}
                    className={`flex-shrink-0 p-1 hover:bg-gray-200 rounded transition-colors ${
                        !hasChildren ? 'invisible' : ''
                    }`}
                >
                    {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                </button>

                {/* Category Image/Icon */}
                <div className="flex-shrink-0 mx-2">
                    {category.image ? (
                        <img
                            src={category.image.url}
                            alt={category.name}
                            className="w-8 h-8 rounded object-cover"
                        />
                    ) : (
                        getCategoryIcon()
                    )}
                </div>

                {/* Category Name and Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 truncate">
                            {category.name}
                        </span>
                        {productsCount > 0 && (
                            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                {productsCount} items
                            </span>
                        )}
                        {hasChildren && (
                            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                                {category.children.length} subcategories
                            </span>
                        )}
                    </div>
                    {category.description && (
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                            {category.description}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onView(category)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        title="View Details"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={() => onEdit(category)}
                        className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => onAddSubcategory(category.id)}
                        className="p-1.5 text-green-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Add Subcategory"
                    >
                        <Plus size={16} />
                    </button>
                    {!hasChildren && productsCount === 0 && (
                        <button
                            onClick={() => onDelete(category)}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Children */}
            {isExpanded && hasChildren && (
                <div className="ml-4">
                    {category.children.map((child) => (
                        <CategoryTreeItem
                            key={child.id}
                            category={child}
                            level={level + 1}
                            isExpanded={expandedNodes.includes(child.id)}
                            expandedNodes={expandedNodes}
                            onToggleExpand={onToggleExpand}
                            onView={onView}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onAddSubcategory={onAddSubcategory}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
