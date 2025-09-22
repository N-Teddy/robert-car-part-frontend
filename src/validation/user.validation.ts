// src/validation/user.validation.ts
import { z } from 'zod';

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
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type AssignRoleFormData = z.infer<typeof assignRoleSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type CreateUserFormData = z.infer<typeof createUserSchema>;
