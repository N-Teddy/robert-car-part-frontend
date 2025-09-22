// src/pages/auth/ResetPasswordPage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, RefreshCw, ArrowLeft, ShieldCheck, CheckCircle, Circle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import { resetPasswordSchema, type ResetPasswordFormData } from '../../validation/auth.validation';
import { useResetPassword } from '../../hooks/authHook';

export const ResetPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const resetPasswordMutation = useResetPassword();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const newPassword = watch('newPassword');

    // Password validation checks
    const passwordChecks = {
        length: newPassword?.length >= 8,
        uppercase: /[A-Z]/.test(newPassword || ''),
        lowercase: /[a-z]/.test(newPassword || ''),
        number: /[0-9]/.test(newPassword || ''),
        special: /[^A-Za-z0-9]/.test(newPassword || ''),
    };

    const allPasswordChecksPassed = Object.values(passwordChecks).every(Boolean);

    // Calculate password strength
    const getPasswordStrength = () => {
        const checks = Object.values(passwordChecks).filter(Boolean).length;
        if (checks <= 2) return { label: 'Weak', color: 'bg-red-500', width: '33%' };
        if (checks <= 4) return { label: 'Medium', color: 'bg-yellow-500', width: '66%' };
        return { label: 'Strong', color: 'bg-green-500', width: '100%' };
    };

    const passwordStrength = getPasswordStrength();

    useEffect(() => {
        if (!token) {
            setToast({ message: 'Invalid or missing reset token', type: 'error' });
            setTimeout(() => navigate('/forgot-password'), 3000);
        }
    }, [token, navigate]);

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!token) {
            setToast({ message: 'Reset token is missing', type: 'error' });
            return;
        }

        setIsLoading(true);
        try {
            await resetPasswordMutation.mutateAsync({
                token,
                newPassword: data.newPassword,
            });
            setToast({ message: 'Password reset successfully! Redirecting to login...', type: 'success' });
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error: any) {
            setToast({
                message: error.response?.data?.message || 'Failed to reset password. Please try again.',
                type: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return null;
    }

    return (
        <>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Set New Password</h2>
                        <p className="text-sm text-gray-600">Create a strong password for your account</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <Input
                        {...register('newPassword')}
                        label="New Password"
                        type="password"
                        placeholder="Enter new password"
                        icon={<Lock size={18} />}
                        error={errors.newPassword?.message}
                    />

                    <Input
                        {...register('confirmPassword')}
                        label="Confirm New Password"
                        type="password"
                        placeholder="Confirm new password"
                        icon={<Lock size={18} />}
                        error={errors.confirmPassword?.message}
                    />

                    {newPassword && (
                        <>
                            {/* Password Strength Bar */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-gray-700">Password Strength</span>
                                    <span className={`text-xs font-medium ${passwordStrength.label === 'Strong' ? 'text-green-600' :
                                            passwordStrength.label === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                                        }`}>
                                        {passwordStrength.label}
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${passwordStrength.color} rounded-full transition-all duration-300`}
                                        style={{ width: passwordStrength.width }}
                                    />
                                </div>
                            </div>

                            {/* Compact password requirements */}
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                    <label className="flex items-center text-xs text-gray-600">
                                        {passwordChecks.length ? (
                                            <CheckCircle size={12} className="mr-1.5 text-green-500 flex-shrink-0" />
                                        ) : (
                                            <Circle size={12} className="mr-1.5 text-gray-400 flex-shrink-0" />
                                        )}
                                        8+ characters
                                    </label>
                                    <label className="flex items-center text-xs text-gray-600">
                                        {passwordChecks.uppercase ? (
                                            <CheckCircle size={12} className="mr-1.5 text-green-500 flex-shrink-0" />
                                        ) : (
                                            <Circle size={12} className="mr-1.5 text-gray-400 flex-shrink-0" />
                                        )}
                                        Uppercase letter
                                    </label>
                                    <label className="flex items-center text-xs text-gray-600">
                                        {passwordChecks.number ? (
                                            <CheckCircle size={12} className="mr-1.5 text-green-500 flex-shrink-0" />
                                        ) : (
                                            <Circle size={12} className="mr-1.5 text-gray-400 flex-shrink-0" />
                                        )}
                                        Number
                                    </label>
                                    <label className="flex items-center text-xs text-gray-600">
                                        {passwordChecks.special ? (
                                            <CheckCircle size={12} className="mr-1.5 text-green-500 flex-shrink-0" />
                                        ) : (
                                            <Circle size={12} className="mr-1.5 text-gray-400 flex-shrink-0" />
                                        )}
                                        Special character
                                    </label>
                                </div>
                            </div>
                        </>
                    )}

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        size="lg"
                        isLoading={isLoading}
                        icon={!isLoading && <RefreshCw size={20} />}
                    >
                        {isLoading ? 'Resetting Password...' : 'Reset Password'}
                    </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-200">
                    <Link
                        to="/login"
                        className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Sign In
                    </Link>
                </div>
            </div>
        </>
    );
};
