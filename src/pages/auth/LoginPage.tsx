// src/pages/auth/LoginPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, Shield } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { loginSchema, type LoginFormData } from '../../validation/auth.validation';
import { useAuthContext } from '../../context/AuthContext';
import NotificationToast from '../../components/notifications/NotificationToast';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; title: string } | null>(null);
    const [rememberMe, setRememberMe] = useState(false);

    const from = location.state?.from?.pathname || '/dashboard';

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        try {
            await login(data);
            setToast({ message: 'Login successful! Redirecting...', title: 'Login Successful' });
            setTimeout(() => {
                navigate(from, { replace: true });
            }, 1500);
        } catch (error: any) {
            setToast({
                message: error.response?.data?.message || 'Invalid email or password',
                title: 'Login Error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {toast && (
                <NotificationToast
                    notification={toast}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
                {/* Header with icon */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                        <p className="text-sm text-gray-600">Sign in to access your dashboard</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <Input
                        {...register('email')}
                        label="Email Address"
                        type="email"
                        placeholder="admin@autoparts.com"
                        icon={<Mail size={18} />}
                        error={errors.email?.message}
                    />

                    <Input
                        {...register('password')}
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        icon={<Lock size={18} />}
                        error={errors.password?.message}
                    />

                    <div className="flex items-center justify-between">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">Remember me</span>
                        </label>
                        <Link
                            to="/forgot-password"
                            className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        size="lg"
                        isLoading={isLoading}
                        icon={!isLoading && <LogIn size={20} />}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="text-red-600 hover:text-red-700 font-medium transition-colors"
                        >
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};
