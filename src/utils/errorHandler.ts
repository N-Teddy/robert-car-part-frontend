// src/utils/errorHandler.ts
export const getErrorMessage = (error: any): string => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }

    if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        if (Array.isArray(errors)) {
            return errors[0].message || 'An error occurred';
        }
        if (typeof errors === 'object') {
            return Object.values(errors)[0] as string;
        }
    }

    if (error.message) {
        return error.message;
    }

    return 'An unexpected error occurred. Please try again.';
};
