// src/pages/auth/ForgotPasswordPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send, ArrowLeft, KeyRound, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import {
    forgotPasswordSchema,
    type ForgotPasswordFormData,
} from '../../validation/auth.validation';
import { useForgotPassword } from '../../hooks/authHook';
import NotificationToast from '../../components/notifications/NotificationToast';

export const ForgotPasswordPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [toast, setToast] = useState<{ message: string; title: string } | null>(null);
    const forgotPasswordMutation = useForgotPassword();

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);
        try {
            await forgotPasswordMutation.mutateAsync(data);
            setIsSuccess(true);
            setToast({
                message: 'Password reset instructions sent to your email!',
                title: 'Email Sent',
            });
        } catch (error: any) {
            setToast({
                message:
                    error.response?.data?.message ||
                    'Failed to send reset email. Please try again.',
                title: 'Email not Sent',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {toast && <NotificationToast notification={toast} onClose={() => setToast(null)} />}

            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                        <KeyRound className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
                        <p className="text-sm text-gray-600">We'll help you reset it</p>
                    </div>
                </div>

                {!isSuccess ? (
                    <>
                        <p className="text-gray-600 mb-6">
                            Enter your email address and we'll send you instructions to reset your
                            password.
                        </p>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <Input
                                {...register('email')}
                                label="Email Address"
                                type="email"
                                placeholder="admin@autoparts.com"
                                icon={<Mail size={18} />}
                                error={errors.email?.message}
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full"
                                size="lg"
                                isLoading={isLoading}
                                icon={!isLoading && <Send size={20} />}
                            >
                                {isLoading ? 'Sending...' : 'Send Reset Link'}
                            </Button>
                        </form>
                    </>
                ) : (
                    <div className="py-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-green-800">
                                        Check your email!
                                    </p>
                                    <p className="text-sm text-green-700 mt-1">
                                        We've sent password reset instructions to{' '}
                                        <span className="font-medium">{getValues('email')}</span>
                                    </p>
                                    <p className="text-sm text-green-700 mt-2">
                                        Didn't receive the email? Check your spam folder or{' '}
                                        <button
                                            onClick={() => {
                                                setIsSuccess(false);
                                                setToast(null);
                                            }}
                                            className="text-green-800 font-medium hover:underline"
                                        >
                                            try again
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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
