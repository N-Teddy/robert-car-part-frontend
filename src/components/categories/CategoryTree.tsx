// src/components/categories/CategoryTree.tsx
import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CategoryTreeItem } from './CategoryTreeItem';
import type { CategoryWithChildren } from '../../types/request/category';

interface CategoryTreeProps {
    categories: CategoryWithChildren[];
    expandedNodes: string[];
    onToggleExpand: (nodeId: string) => void;
    onView: (category: CategoryWithChildren) => void;
    onEdit: (category: CategoryWithChildren) => void;
    onDelete: (category: CategoryWithChildren) => void;
    onAddSubcategory: (parentId: string) => void;
}

export const CategoryTree: React.FC<CategoryTreeProps> = ({
    categories,
    expandedNodes,
    onToggleExpand,
    onView,
    onEdit,
    onDelete,
    onAddSubcategory,
}) => {
    const [items, setItems] = useState(categories);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
            // Here you would call an API to update the order
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div className="p-4">
                <SortableContext
                    items={items.map(item => item.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {items.map((category) => (
                        <CategoryTreeItem
                            key={category.id}
                            category={category}
                            level={0}
                            isExpanded={expandedNodes.includes(category.id)}
                            onToggleExpand={onToggleExpand}
                            onView={onView}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onAddSubcategory={onAddSubcategory}
                            expandedNodes={expandedNodes}
                        />
                    ))}
                </SortableContext>
            </div>
        </DndContext>
    );
};
