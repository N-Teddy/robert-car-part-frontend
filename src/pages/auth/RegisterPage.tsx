// src/pages/auth/RegisterPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, UserPlus, CheckCircle, Circle, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import { registerSchema, type RegisterFormData } from '../../validation/auth.validation';
import { useAuthContext } from '../../context/AuthContext';

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { register: registerUser } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const password = watch('password');

    // Password validation checks
    const passwordChecks = {
        length: password?.length >= 8,
        uppercase: /[A-Z]/.test(password || ''),
        lowercase: /[a-z]/.test(password || ''),
        number: /[0-9]/.test(password || ''),
    };

    const allPasswordChecksPassed = Object.values(passwordChecks).every(Boolean);

    const onSubmit = async (data: RegisterFormData) => {
        if (!agreedToTerms) {
            setToast({ message: 'Please agree to the terms and conditions', type: 'error' });
            return;
        }

        setIsLoading(true);
        try {
            const { confirmPassword, ...registerData } = data;
            await registerUser(registerData);
            setToast({ message: 'Account created successfully!', type: 'success' });
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch (error: any) {
            setToast({
                message: error.response?.data?.message || 'Registration failed. Please try again.',
                type: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Wider card for register */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-3xl mx-auto">
                {/* Header with icon */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
                        <p className="text-sm text-gray-600">Join our inventory management system</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Two column layout for personal info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            {...register('fullName')}
                            label="Full Name"
                            type="text"
                            placeholder="John Doe"
                            icon={<User size={18} />}
                            error={errors.fullName?.message}
                        />

                        <Input
                            {...register('phoneNumber')}
                            label="Phone Number"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            icon={<Phone size={18} />}
                            error={errors.phoneNumber?.message}
                        />
                    </div>

                    {/* Email - full width */}
                    <Input
                        {...register('email')}
                        label="Email Address"
                        type="email"
                        placeholder="admin@autoparts.com"
                        icon={<Mail size={18} />}
                        error={errors.email?.message}
                    />

                    {/* Password fields in two columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            {...register('password')}
                            label="Password"
                            type="password"
                            placeholder="Create password"
                            icon={<Lock size={18} />}
                            error={errors.password?.message}
                        />

                        <Input
                            {...register('confirmPassword')}
                            label="Confirm Password"
                            type="password"
                            placeholder="Confirm password"
                            icon={<Lock size={18} />}
                            error={errors.confirmPassword?.message}
                        />
                    </div>

                    {/* Compact password requirements */}
                    {password && (
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-medium text-gray-700">Password Requirements</p>
                                {allPasswordChecksPassed && (
                                    <span className="text-xs text-green-600 font-medium">✓ All requirements met</span>
                                )}
                            </div>
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
                            </div>
                        </div>
                    )}

                    {/* Terms with better styling */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <label className="flex items-start cursor-pointer">
                            <input
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 mt-0.5"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                                I agree to the{' '}
                                <a href="#" className="text-red-600 hover:text-red-700 font-medium">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="#" className="text-red-600 hover:text-red-700 font-medium">
                                    Privacy Policy
                                </a>
                            </span>
                        </label>
                    </div>

                    {/* Submit button */}
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        size="lg"
                        isLoading={isLoading}
                        icon={!isLoading && <UserPlus size={20} />}
                        disabled={!agreedToTerms}
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                </form>

                {/* Sign in link */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="text-red-600 hover:text-red-700 font-medium transition-colors"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};
