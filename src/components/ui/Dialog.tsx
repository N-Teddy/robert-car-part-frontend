// src/components/ui/Dialog.tsx
import React, { useEffect } from 'react';

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && open) {
                onOpenChange(false);
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [open, onOpenChange]);

    if (!open) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => onOpenChange(false)}
        >
            <div
                className="bg-white rounded-lg shadow-lg max-w-full max-h-full overflow-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

export const DialogContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = '',
}) => <div className={`p-4 ${className}`}>{children}</div>;

export const DialogHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="border-b border-gray-200 px-4 py-2">{children}</div>
);

export const DialogTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-lg font-semibold">{children}</h2>
);

export const DialogFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = '',
}) => (
    <div className={`border-t border-gray-200 px-4 py-3 flex justify-end ${className}`}>
        {children}
    </div>
);
