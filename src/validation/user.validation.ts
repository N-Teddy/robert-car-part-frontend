// src/validation/user.validation.ts
import { z } from 'zod';

// Schema for file upload validation
const imageSchema = z.instanceof(File).optional()
    .refine((file) => {
        if (!file) return true; // Optional, so no file is acceptable
        return file.size <= 5 * 1024 * 1024; // 5MB max
    }, 'File size must be less than 5MB')
    .refine((file) => {
        if (!file) return true;
        return ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(file.type);
    }, 'File must be a valid image (JPEG, PNG, GIF, WebP)');

// Alternative schema for when image is a string (URL) from existing data
const imageUrlSchema = z.string().url().optional().nullable();

export const updateProfileSchema = z.object({
    fullName: z
        .string()
        .min(3, 'Full name must be at least 3 characters')
        .max(100, 'Full name must be less than 100 characters')
        .optional(),
    email: z
        .string()
        .email('Invalid email address')
        .optional(),
    phoneNumber: z
        .string()
        .regex(/^\+?[\d\s-()]+$/, 'Invalid phone number format')
        .min(9, 'Phone number must be at least 9 digits')
        .optional(),
    image: imageSchema.or(imageUrlSchema).optional(), // Use 'image' instead of 'avatar'
});

export const assignRoleSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
    role: z.enum(['ADMIN', 'MANAGER', 'DEV', 'SALES', 'STAFF', 'CUSTOMER', 'UNKNOWN'] as const),
});

export const updateUserSchema = z.object({
    fullName: z
        .string()
        .min(3, 'Full name must be at least 3 characters')
        .max(100, 'Full name must be less than 100 characters')
        .optional(),
    email: z
        .string()
        .email('Invalid email address')
        .optional(),
    phoneNumber: z
        .string()
        .regex(/^\+?[\d\s-()]+$/, 'Invalid phone number format')
        .min(9, 'Phone number must be at least 9 digits')
        .optional(),
    role: z.enum(['ADMIN', 'MANAGER', 'DEV', 'SALES', 'STAFF', 'CUSTOMER', 'UNKNOWN'] as const).optional(),
    isActive: z.boolean().optional(),
    image: imageSchema.or(imageUrlSchema).optional(), // Use 'image' instead of 'avatar'
});

export const createUserSchema = z.object({
    fullName: z
        .string()
        .min(1, 'Full name is required')
        .min(3, 'Full name must be at least 3 characters')
        .max(100, 'Full name must be less than 100 characters'),
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address'),
    phoneNumber: z
        .string()
        .min(1, 'Phone number is required')
        .regex(/^\+?[\d\s-()]+$/, 'Invalid phone number format')
        .min(9, 'Phone number must be at least 9 digits'),
    role: z.enum(['ADMIN', 'MANAGER', 'DEV', 'SALES', 'STAFF', 'CUSTOMER', 'UNKNOWN'] as const),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(8, 'Password must be at least 8 characters'),
    image: imageSchema.optional(), // Use 'image' instead of 'avatar'
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type AssignRoleFormData = z.infer<typeof assignRoleSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type CreateUserFormData = z.infer<typeof createUserSchema>;

// Separate file validation function
export const validateImageFile = (file: File | null) => {
    if (!file) return null; // No file is acceptable

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        return 'Please select a valid image (JPEG, PNG, GIF, WebP)';
    }

    if (file.size > 5 * 1024 * 1024) {
        return 'Image size must be less than 5MB';
    }

    return null; // No error
};