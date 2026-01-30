// src/utils/errorHandler.ts
import type { AxiosError } from 'axios';

type ErrorLike = AxiosError | { message?: string; response?: unknown };

const isAxiosErrorLike = (err: unknown): err is AxiosError => {
    return typeof err === 'object' && err !== null && 'isAxiosError' in err;
};

export const getErrorMessage = (error: ErrorLike): string => {
    if (isAxiosErrorLike(error)) {
        const data = (error.response as { data?: unknown } | undefined)?.data;
        if (data && typeof data === 'object') {
            const message = (data as { message?: unknown }).message;
            if (typeof message === 'string') return message;

            const errors = (data as { errors?: unknown }).errors;
            if (Array.isArray(errors) && errors.length > 0) {
                const first = errors[0] as { message?: unknown };
                if (typeof first?.message === 'string') return first.message;
            }
            if (errors && typeof errors === 'object') {
                const first = Object.values(errors as Record<string, unknown>)[0];
                if (typeof first === 'string') return first;
            }
        }
    }

    if (typeof error === 'object' && error && 'message' in error && typeof error.message === 'string') {
        return error.message;
    }

    return 'An unexpected error occurred. Please try again.';
};
