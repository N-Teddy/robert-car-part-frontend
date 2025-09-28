// src/pages/categories/CategoriesPage.tsx
import React, { useState, useMemo } from 'react';
import {
    Plus,
    Search,
    Grid3x3,
    List,
    Download,
    FolderTree,
    Package,
    Layers,
    RefreshCw,
} from 'lucide-react';
import { CategoryTree } from '../../components/categories/CategoryTree';
import { CategoryGrid } from '../../components/categories/CategoryGrid';
import { CategoryFormModal } from '../../components/categories/CategoryFormModal';
import { CategoryViewModal } from '../../components/categories/CategoryViewModal';
import { CategoryDeleteModal } from '../../components/categories/CategoryDeleteModal';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import type { CategoryWithChildren } from '../../types/request/category';
import { useCategory } from '../../hooks/categoryHook';

type ViewMode = 'tree' | 'grid';

export const CategoriesPage: React.FC = () => {
    const { useGetCategoryTree, useDeleteCategory } = useCategory();
    const [viewMode, setViewMode] = useState<ViewMode>('tree');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<CategoryWithChildren | null>(null);
    const [expandedNodes, setExpandedNodes] = useState<string[]>([]);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Modal states
    const [formModal, setFormModal] = useState<{
        isOpen: boolean;
        mode: 'create' | 'edit';
        category?: CategoryWithChildren | null;
        parentId?: string | null;
    }>({
        isOpen: false,
        mode: 'create',
        category: null,
        parentId: null,
    });

    const [viewModal, setViewModal] = useState<{
        isOpen: boolean;
        category: CategoryWithChildren | null;
    }>({
        isOpen: false,
        category: null,
    });

    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        category: CategoryWithChildren | null;
    }>({
        isOpen: false,
        category: null,
    });

    const { data, isLoading, refetch, isFetching, error } = useGetCategoryTree({
        search: searchTerm || undefined,
    });

    const categories = data?.items || [];
    const deleteMutation = useDeleteCategory();

    // Calculate statistics
    const stats = useMemo(() => {
        const countCategories = (
            cats: CategoryWithChildren[]
        ): { total: number; withChildren: number; products: number } => {
            let total = 0;
            let withChildren = 0;
            let products = 0;

            const traverse = (items: CategoryWithChildren[]) => {
                items.forEach((item) => {
                    total++;
                    if (item.children && item.children.length > 0) {
                        withChildren++;
                        traverse(item.children);
                    }
                    // Assuming we have a products count in metadata
                    products += (item as any).productsCount || 0;
                });
            };

            traverse(cats);
            return { total, withChildren, products };
        };

        return countCategories(categories);
    }, [categories]);

    // Handle manual refresh
    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await refetch();
            setToast({ message: 'Categories refreshed successfully', type: 'success' });
        } catch (error) {
            setToast({ message: 'Failed to refresh categories', type: 'error' });
        } finally {
            setIsRefreshing(false);
        }
    };

    // Filter categories based on search
    const filteredCategories = useMemo(() => {
        if (!searchTerm) return categories;

        const filterRecursive = (items: CategoryWithChildren[]): CategoryWithChildren[] => {
            return items.reduce((acc: CategoryWithChildren[], item) => {
                const matchesSearch =
                    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.description?.toLowerCase().includes(searchTerm.toLowerCase());

                const filteredChildren = item.children ? filterRecursive(item.children) : [];

                if (matchesSearch || filteredChildren.length > 0) {
                    acc.push({
                        ...item,
                        children: filteredChildren,
                    });
                    // Auto-expand parent if children match
                    if (filteredChildren.length > 0 && !expandedNodes.includes(item.id)) {
                        setExpandedNodes((prev) => [...prev, item.id]);
                    }
                }

                return acc;
            }, []);
        };

        return filterRecursive(categories);
    }, [categories, searchTerm, expandedNodes]);

    const handleCreate = (parentId?: string) => {
        setFormModal({
            isOpen: true,
            mode: 'create',
            category: null,
            parentId: parentId || null,
        });
    };

    const handleEdit = (category: CategoryWithChildren) => {
        setFormModal({
            isOpen: true,
            mode: 'edit',
            category,
            parentId: null,
        });
    };

    const handleView = (category: CategoryWithChildren) => {
        setViewModal({
            isOpen: true,
            category,
        });
    };

    const handleDelete = (category: CategoryWithChildren) => {
        setDeleteModal({
            isOpen: true,
            category,
        });
    };

    const confirmDelete = async () => {
        if (!deleteModal.category) return;

        try {
            await deleteMutation.mutateAsync(deleteModal.category.id);
            setToast({ message: 'Category deleted successfully', type: 'success' });
            await refetch(); // Ensure data is refreshed after deletion
            setDeleteModal({ isOpen: false, category: null });
        } catch (error) {
            setToast({ message: 'Failed to delete category', type: 'error' });
        }
    };

    const handleExport = () => {
        // Export logic here
        const csvContent = generateCSV(categories);
        downloadCSV(csvContent, 'categories.csv');
        setToast({ message: 'Categories exported successfully', type: 'success' });
    };

    const generateCSV = (cats: CategoryWithChildren[]): string => {
        const rows = ['Name,Description,Parent,Products Count'];

        const traverse = (items: CategoryWithChildren[], parent = '') => {
            items.forEach((item) => {
                rows.push(
                    `"${item.name}","${item.description || ''}","${parent}","${(item as any).productsCount || 0}"`
                );
                if (item.children && item.children.length > 0) {
                    traverse(item.children, item.name);
                }
            });
        };

        traverse(cats);
        return rows.join('\n');
    };

    const downloadCSV = (content: string, filename: string) => {
        const blob = new Blob([content], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const expandAll = () => {
        const allIds: string[] = [];
        const traverse = (items: CategoryWithChildren[]) => {
            items.forEach((item) => {
                if (item.children && item.children.length > 0) {
                    allIds.push(item.id);
                    traverse(item.children);
                }
            });
        };
        traverse(categories);
        setExpandedNodes(allIds);
    };

    const collapseAll = () => {
        setExpandedNodes([]);
    };

    return (
        <>
            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}

            <CategoryFormModal
                isOpen={formModal.isOpen}
                mode={formModal.mode}
                category={formModal.category}
                parentId={formModal.parentId}
                onClose={() => setFormModal({ isOpen: false, mode: 'create', category: null })}
                onSuccess={async () => {
                    await refetch(); // Refresh data after successful form submission
                    setFormModal({ isOpen: false, mode: 'create', category: null });
                    setToast({
                        message:
                            formModal.mode === 'create'
                                ? 'Category created successfully'
                                : 'Category updated successfully',
                        type: 'success',
                    });
                }}
            />

            <CategoryViewModal
                isOpen={viewModal.isOpen}
                category={viewModal.category}
                onClose={() => setViewModal({ isOpen: false, category: null })}
                onEdit={(cat) => {
                    setViewModal({ isOpen: false, category: null });
                    handleEdit(cat);
                }}
                onDelete={(cat) => {
                    setViewModal({ isOpen: false, category: null });
                    handleDelete(cat);
                }}
            />

            <CategoryDeleteModal
                isOpen={deleteModal.isOpen}
                category={deleteModal.category}
                onClose={() => setDeleteModal({ isOpen: false, category: null })}
                onConfirm={confirmDelete}
            />

            <div className="px-4 py-8 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Organize your inventory with categories
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Button
                                variant="outline"
                                size="sm"
                                icon={
                                    <RefreshCw
                                        size={16}
                                        className={isRefreshing ? 'animate-spin' : ''}
                                    />
                                }
                                onClick={handleRefresh}
                                disabled={isRefreshing || isFetching}
                            >
                                {isRefreshing ? 'Refreshing...' : 'Refresh'}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                icon={<Download size={16} />}
                                onClick={handleExport}
                            >
                                Export
                            </Button>
                            <Button
                                variant="primary"
                                icon={<Plus size={20} />}
                                onClick={() => handleCreate()}
                            >
                                Add Category
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-3">
                    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Total Categories
                                </p>
                                <p className="mt-1 text-2xl font-bold text-gray-900">
                                    {stats.total}
                                </p>
                            </div>
                            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                                <FolderTree className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Parent Categories
                                </p>
                                <p className="mt-1 text-2xl font-bold text-gray-900">
                                    {stats.withChildren}
                                </p>
                            </div>
                            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                                <Layers className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Products</p>
                                <p className="mt-1 text-2xl font-bold text-gray-900">
                                    {stats.products}
                                </p>
                            </div>
                            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                                <Package className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and View Toggle */}
                <div className="p-4 mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search categories..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            {viewMode === 'tree' && (
                                <>
                                    <Button variant="ghost" size="sm" onClick={expandAll}>
                                        Expand All
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={collapseAll}>
                                        Collapse All
                                    </Button>
                                </>
                            )}

                            <div className="flex items-center p-1 bg-gray-100 rounded-lg">
                                <button
                                    onClick={() => setViewMode('tree')}
                                    className={`p-2 rounded transition-colors ${
                                        viewMode === 'tree'
                                            ? 'bg-white text-red-600 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                    title="Tree View"
                                >
                                    <List size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded transition-colors ${
                                        viewMode === 'grid'
                                            ? 'bg-white text-red-600 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                    title="Grid View"
                                >
                                    <Grid3x3 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {(isLoading || isRefreshing) && (
                    <div className="p-8 mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="flex items-center justify-center space-x-2">
                            <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
                            <span className="text-sm text-gray-600">
                                {isRefreshing
                                    ? 'Refreshing categories...'
                                    : 'Loading categories...'}
                            </span>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <div className="p-4 mb-6 border border-red-200 rounded-lg bg-red-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-red-800">
                                    Failed to load categories
                                </p>
                                <p className="mt-1 text-sm text-red-600">
                                    {error.message || 'Please try refreshing the page'}
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                icon={<RefreshCw size={14} />}
                                onClick={handleRefresh}
                            >
                                Retry
                            </Button>
                        </div>
                    </div>
                )}

                {/* Content Area */}
                {!isLoading && !error && (
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                        {filteredCategories.length === 0 ? (
                            <div className="p-12 text-center">
                                <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <h3 className="mb-1 text-lg font-medium text-gray-900">
                                    No categories found
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {searchTerm
                                        ? 'Try adjusting your search'
                                        : 'Get started by creating your first category'}
                                </p>
                                {!searchTerm && (
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        icon={<Plus size={16} />}
                                        onClick={() => handleCreate()}
                                        className="mt-4"
                                    >
                                        Create Category
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <>
                                {viewMode === 'tree' ? (
                                    <CategoryTree
                                        categories={filteredCategories}
                                        expandedNodes={expandedNodes}
                                        onToggleExpand={(nodeId) => {
                                            setExpandedNodes((prev) =>
                                                prev.includes(nodeId)
                                                    ? prev.filter((id) => id !== nodeId)
                                                    : [...prev, nodeId]
                                            );
                                        }}
                                        onView={handleView}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onAddSubcategory={handleCreate}
                                    />
                                ) : (
                                    <CategoryGrid
                                        categories={filteredCategories}
                                        onView={handleView}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onAddSubcategory={handleCreate}
                                    />
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};
