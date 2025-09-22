// src/components/categories/CategoryFormModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Folder, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import type { CategoryWithChildren } from '../../types/request/category';
import { useCategory } from '../../hooks/categoryHook';

const categorySchema = z.object({
    name: z.string().min(1, 'Category name is required').max(50, 'Name must be less than 50 characters'),
    description: z.string().max(200, 'Description must be less than 200 characters').optional(),
    parentId: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormModalProps {
    isOpen: boolean;
    mode: 'create' | 'edit';
    category?: CategoryWithChildren | null;
    parentId?: string | null;
    onClose: () => void;
    onSuccess: () => void;
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
    isOpen,
    mode,
    category,
    parentId,
    onClose,
    onSuccess,
}) => {
    const { useCreateCategory, useUpdateCategory, useGetAllCategories } = useCategory();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [isImageRemoved, setIsImageRemoved] = useState(false);

    const createMutation = useCreateCategory();
    const updateMutation = useUpdateCategory();
    const { data: categoriesData } = useGetAllCategories();

    // Color configuration based on mode
    const colorConfig = {
        create: {
            gradient: 'from-green-500 to-green-600',
            focusRing: 'focus:ring-green-100',
            focusBorder: 'focus:border-green-500',
            bg: 'bg-green-50',
            text: 'text-green-600',
            border: 'border-green-500',
            ring: 'ring-green-200',
            button: 'bg-green-600 hover:bg-green-700'
        },
        edit: {
            gradient: 'from-blue-500 to-blue-600',
            focusRing: 'focus:ring-blue-100',
            focusBorder: 'focus:border-blue-500',
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            border: 'border-blue-500',
            ring: 'ring-blue-200',
            button: 'bg-blue-600 hover:bg-blue-700'
        }
    };

    const colors = colorConfig[mode];

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: '',
            description: '',
            parentId: parentId || '',
        },
    });

    useEffect(() => {
        if (mode === 'edit' && category) {
            setValue('name', category.name);
            setValue('description', category.description || '');
            setValue('parentId', (category as any).parentId || '');
            if (category.image) {
                setImagePreview(category.image.url);
            }
        } else if (parentId) {
            setValue('parentId', parentId);
        }

        // Reset image removal state when modal opens
        setIsImageRemoved(false);
    }, [category, mode, parentId, setValue, isOpen]);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert('Please upload a valid image file (JPEG, PNG, GIF, WebP)');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        setImageFile(file);
        setIsImageRemoved(false); // Reset removal flag if new file is added
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setIsImageRemoved(true);
    };

    const onSubmit = async (data: CategoryFormData) => {
        try {
            const formData = new FormData();

            // Append all form data
            formData.append('name', data.name);

            if (data.description) {
                formData.append('description', data.description);
            } else {
                formData.append('description', '');
            }

            if (data.parentId) {
                formData.append('parentId', data.parentId);
            } else {
                formData.append('parentId', '');
            }

            // Handle image based on mode and actions
            if (mode === 'create') {
                // For create, image is required
                if (!imageFile) {
                    alert('Please upload a category image');
                    return;
                }
                formData.append('image', imageFile);
            } else if (mode === 'edit') {
                // For edit, handle different scenarios
                if (imageFile) {
                    // New image uploaded
                    formData.append('image', imageFile);
                } else if (isImageRemoved) {
                    // Image was removed by user
                    formData.append('removeImage', 'true');
                }
                // If neither, keep the existing image
            }

            if (mode === 'create') {
                await createMutation.mutateAsync(formData as any);
            } else if (category) {
                await updateMutation.mutateAsync({
                    id: category.id,
                    data: formData as any
                });
            }

            onSuccess();
            handleClose();
        } catch (error) {
            console.error('Failed to save category:', error);
            alert('Failed to save category. Please try again.');
        }
    };

    const handleClose = () => {
        reset();
        setImageFile(null);
        setImagePreview(null);
        setIsImageRemoved(false);
        onClose();
    };

    if (!isOpen) return null;

    // Get available parent categories (exclude current category and its children in edit mode)
    const getAvailableParents = () => {
        if (!categoriesData?.items) return [];

        if (mode === 'edit' && category) {
            // Filter out current category and its children
            const excludeIds = new Set<string>([category.id]);
            const addChildrenIds = (cat: CategoryWithChildren) => {
                if (cat.children) {
                    cat.children.forEach(child => {
                        excludeIds.add(child.id);
                        addChildrenIds(child);
                    });
                }
            };
            addChildrenIds(category);

            return categoriesData.items.filter(cat => !excludeIds.has(cat.id));
        }

        return categoriesData.items;
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Background overlay with blur - lower z-index */}
            <div
                className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-40"
                onClick={handleClose}
                aria-hidden="true"
            />

            {/* Center modal - higher z-index */}
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0 z-50 relative">
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                    &#8203;
                </span>

                {/* Modal panel with animation */}
                <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-50">
                    {/* Header with dynamic gradient based on mode */}
                    <div className={`bg-gradient-to-r ${colors.gradient} px-6 py-4`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                    <Folder className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">
                                        {mode === 'create' ? 'Create Category' : 'Edit Category'}
                                    </h3>
                                    <p className="text-xs text-white/80">
                                        {mode === 'create' ? 'Add a new category to organize your inventory' : 'Update category information'}
                                    </p>
                                </div>
                            </div>
                            <button onClick={handleClose} className="text-white/80 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="px-6 py-6 space-y-6">
                            {/* Category Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Category Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    {...register('name')}
                                    type="text"
                                    placeholder="e.g., Engine Parts"
                                    className={`w-full px-4 py-2.5 border rounded-lg text-sm ${errors.name ? 'border-red-500 focus:ring-2 focus:ring-red-200' : `border-gray-300 ${colors.focusBorder} focus:ring-2 ${colors.focusRing}`} focus:outline-none`}
                                />
                                {errors.name && (
                                    <p className="mt-1 text-xs text-red-600 flex items-center">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Description
                                </label>
                                <textarea
                                    {...register('description')}
                                    rows={3}
                                    placeholder="Brief description of this category..."
                                    className={`w-full px-4 py-2.5 border rounded-lg text-sm ${errors.description ? 'border-red-500 focus:ring-2 focus:ring-red-200' : `border-gray-300 ${colors.focusBorder} focus:ring-2 ${colors.focusRing}`} focus:outline-none`}
                                />
                                {errors.description && (
                                    <p className="mt-1 text-xs text-red-600 flex items-center">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>

                            {/* Parent Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Parent Category
                                </label>
                                <select
                                    {...register('parentId')}
                                    className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm ${colors.focusBorder} focus:ring-2 ${colors.focusRing} focus:outline-none`}
                                >
                                    <option value="">No parent (Top level)</option>
                                    {getAvailableParents().map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Category Image {mode === 'create' && <span className="text-red-500">*</span>}
                                </label>
                                <div
                                    className={`relative border-2 border-dashed rounded-lg p-6 text-center ${dragActive ? `${colors.border} ${colors.bg}` : 'border-gray-300'}`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    {imagePreview ? (
                                        <div className="relative">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="mx-auto h-32 w-32 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="mt-2 text-sm text-gray-600">
                                                Drop image here or{' '}
                                                <label className={`${colors.text} hover:opacity-80 cursor-pointer`}>
                                                    browse
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                                        onChange={handleFileChange}
                                                    />
                                                </label>
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                JPEG, PNG, GIF, WebP up to 5MB
                                            </p>
                                            {mode === 'create' && !imagePreview && (
                                                <p className="text-xs text-red-500 mt-2">
                                                    Image is required for new categories
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>
                                {mode === 'edit' && isImageRemoved && (
                                    <p className="text-xs text-blue-500 mt-2">
                                        Image will be removed when you save changes
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleClose}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                size="sm"
                                isLoading={isSubmitting}
                                className={colors.button}
                                disabled={mode === 'create' && !imageFile}
                            >
                                {mode === 'create' ? 'Create Category' : 'Update Category'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};