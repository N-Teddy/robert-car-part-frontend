// src/components/ui/Input.tsx
import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, type, className = '', ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const isPassword = type === 'password';

        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        type={isPassword && showPassword ? 'text' : type}
                        className={`
              w-full px-4 py-2.5
              ${icon ? 'pl-10' : ''}
              ${isPassword ? 'pr-10' : ''}
              border rounded-lg
              transition-all duration-200
              ${error
                                ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                                : 'border-gray-300 focus:border-red-600 focus:ring-2 focus:ring-red-100'
                            }
              focus:outline-none
              placeholder:text-gray-400
              ${className}
            `}
                        {...props}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    )}
                </div>
                {error && (
                    <div className="flex items-center gap-1 mt-1.5 text-red-500">
                        <AlertCircle size={14} />
                        <span className="text-sm">{error}</span>
                    </div>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
