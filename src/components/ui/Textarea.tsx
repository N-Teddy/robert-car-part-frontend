// src/components/ui/Textarea.tsx
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className = '', ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                className={`w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
                {...props}
            />
        );
    }
);

Textarea.displayName = 'Textarea';
