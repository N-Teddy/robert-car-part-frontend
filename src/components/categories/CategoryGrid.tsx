// src/components/categories/CategoryGrid.tsx
import React from 'react';
import { CategoryCard } from './CategoryCard';
import type { CategoryWithChildren } from '../../types/request/category';

interface CategoryGridProps {
    categories: CategoryWithChildren[];
    onView: (category: CategoryWithChildren) => void;
    onEdit: (category: CategoryWithChildren) => void;
    onDelete: (category: CategoryWithChildren) => void;
    onAddSubcategory: (parentId: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
    categories,
    onView,
    onEdit,
    onDelete,
    onAddSubcategory,
}) => {
    const flattenCategories = (cats: CategoryWithChildren[], level = 0): Array<CategoryWithChildren & { level: number }> => {
        const result: Array<CategoryWithChildren & { level: number }> = [];

        cats.forEach(cat => {
            result.push({ ...cat, level });
            if (cat.children && cat.children.length > 0) {
                result.push(...flattenCategories(cat.children, level + 1));
            }
        });

        return result;
    };

    const flatCategories = flattenCategories(categories);

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {flatCategories.map((category) => (
                    <CategoryCard
                        key={category.id}
                        category={category}
                        level={category.level}
                        onView={onView}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onAddSubcategory={onAddSubcategory}
                    />
                ))}
            </div>
        </div>
    );
};
