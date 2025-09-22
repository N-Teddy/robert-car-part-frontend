// src/components/ui/PasswordStrengthIndicator.tsx
import React, { useMemo } from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
    password: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
    const requirements = useMemo(() => {
        return [
            { label: 'At least 8 characters', met: password.length >= 8 },
            { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
            { label: 'One lowercase letter', met: /[a-z]/.test(password) },
            { label: 'One number', met: /[0-9]/.test(password) },
            { label: 'One special character', met: /[^A-Za-z0-9]/.test(password) },
        ];
    }, [password]);

    const strength = useMemo(() => {
        const metCount = requirements.filter(req => req.met).length;
        if (metCount === 0) return { label: '', color: '', width: '0%' };
        if (metCount <= 2) return { label: 'Weak', color: 'bg-red-500', width: '33%' };
        if (metCount <= 4) return { label: 'Medium', color: 'bg-yellow-500', width: '66%' };
        return { label: 'Strong', color: 'bg-green-500', width: '100%' };
    }, [requirements]);

    if (!password) return null;

    return (
        <div className="space-y-3">
            {/* Strength Bar */}
            <div>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Password Strength</span>
                    {strength.label && (
                        <span className={`text-xs font-medium ${strength.color === 'bg-green-500' ? 'text-green-600' :
                                strength.color === 'bg-yellow-500' ? 'text-yellow-600' :
                                    'text-red-600'
                            }`}>
                            {strength.label}
                        </span>
                    )}
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-300 ${strength.color}`}
                        style={{ width: strength.width }}
                    />
                </div>
            </div>

            {/* Requirements List */}
            <div className="space-y-1">
                {requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2">
                        {req.met ? (
                            <Check className="w-4 h-4 text-green-500" />
                        ) : (
                            <X className="w-4 h-4 text-gray-300" />
                        )}
                        <span className={`text-xs ${req.met ? 'text-green-600' : 'text-gray-400'}`}>
                            {req.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
