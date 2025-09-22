// src/hooks/useToast.tsx
import { useState, useCallback } from 'react';
import { type ToastType } from '../components/ui/Toast';

interface ToastState {
    message: string;
    type: ToastType;
}

export const useToast = () => {
    const [toast, setToast] = useState<ToastState | null>(null);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        setToast({ message, type });
    }, []);

    const hideToast = useCallback(() => {
        setToast(null);
    }, []);

    return {
        toast,
        showToast,
        hideToast,
    };
};
