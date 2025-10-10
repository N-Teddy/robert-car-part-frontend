// src/pages/UnauthorizedRole.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogOut, Clock, AlertTriangle, Lock, UserX, Info, CheckCircle } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';

interface UnauthorizedRolePageProps {
    email?: string;
    fullName?: string;
    role?: string;
    createdAt?: string;
}

const UnauthorizedRolePage: React.FC<UnauthorizedRolePageProps> = ({
    email,
    fullName,
    role,
    createdAt,
}) => {
    const { user } = useAuthContext(); // Moved inside the component
    const navigate = useNavigate();

    // Use props if provided, otherwise use context user data
    const userEmail = email || user?.email || 'N/A';
    const userFullName = fullName || user?.fullName || 'N/A';
    const userRole = role || user?.role || 'UNKNOWN';
    const userCreatedAt = createdAt || user?.createdAt || new Date().toISOString();

    const handleLogout = () => {
        // Implement logout logic
        localStorage.clear();
        sessionStorage.clear();
        navigate('/login');
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    const getStatusInfo = () => {
        switch (userRole) {
            case 'UNKNOWN':
                return {
                    title: 'Account Pending Approval',
                    message: 'Your account is currently under review by our administrators.',
                    submessage:
                        "This usually takes 1-2 business days. You'll receive an email once your account is approved.",
                    icon: Clock,
                    iconColor: 'text-yellow-500',
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200',
                };
            case 'SUSPENDED':
                return {
                    title: 'Account Suspended',
                    message: 'Your account has been temporarily suspended.',
                    submessage:
                        'Please contact support for more information about your account status.',
                    icon: AlertTriangle,
                    iconColor: 'text-red-500',
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                };
            case 'INACTIVE':
                return {
                    title: 'Account Inactive',
                    message: 'Your account is currently inactive.',
                    submessage:
                        'Your account may have been deactivated due to inactivity or other reasons.',
                    icon: UserX,
                    iconColor: 'text-gray-500',
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200',
                };
            default:
                return {
                    title: 'Access Restricted',
                    message: "You don't have permission to access this system.",
                    submessage:
                        'Your role is not recognized in our system. Please contact an administrator.',
                    icon: Lock,
                    iconColor: 'text-purple-500',
                    bgColor: 'bg-purple-50',
                    borderColor: 'border-purple-200',
                };
        }
    };

    const statusInfo = getStatusInfo();
    const StatusIcon = statusInfo.icon;

    // Calculate time since registration
    const timeSinceRegistration = () => {
        const registered = new Date(userCreatedAt);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - registered.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Main Content */}
            <main className="max-w-4xl px-4 py-12 mx-auto sm:px-6 lg:px-8">
                <div className="text-center">
                    {/* Illustration */}
                    <div className="relative w-full max-w-md mx-auto mb-8">
                        <svg
                            className="w-full h-auto"
                            viewBox="0 0 400 350"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {/* Background Circle */}
                            <circle cx="200" cy="175" r="100" fill="#F9FAFB" />

                            {/* Shield Base */}
                            <path
                                d="M200 80 L260 110 L260 180 Q260 240 200 260 Q140 240 140 180 L140 110 Z"
                                fill="#EDE9FE"
                                stroke="#9333EA"
                                strokeWidth="3"
                            />

                            {/* Lock Icon in Shield */}
                            <g transform="translate(200, 160)">
                                <rect
                                    x="-20"
                                    y="-10"
                                    width="40"
                                    height="30"
                                    rx="4"
                                    fill="#9333EA"
                                />
                                <path
                                    d="M -15,-10 L -15,-20 Q -15,-35 0,-35 Q 15,-35 15,-20 L 15,-10"
                                    stroke="#9333EA"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <circle cx="0" cy="5" r="4" fill="white" />
                                <line x1="0" y1="7" x2="0" y2="15" stroke="white" strokeWidth="2" />
                            </g>

                            {/* User Icons Around Shield */}
                            <g transform="translate(120, 100)">
                                <circle cx="0" cy="0" r="20" fill="#F3F4F6" />
                                <circle cx="0" cy="-5" r="8" fill="#9CA3AF" />
                                <path d="M -12,10 Q -12,5 0,5 Q 12,5 12,10" fill="#9CA3AF" />
                                <line
                                    x1="20"
                                    y1="0"
                                    x2="40"
                                    y2="0"
                                    stroke="#E5E7EB"
                                    strokeWidth="2"
                                    strokeDasharray="4,4"
                                />
                            </g>

                            <g transform="translate(280, 100)">
                                <circle cx="0" cy="0" r="20" fill="#F3F4F6" />
                                <circle cx="0" cy="-5" r="8" fill="#9CA3AF" />
                                <path d="M -12,10 Q -12,5 0,5 Q 12,5 12,10" fill="#9CA3AF" />
                                <line
                                    x1="-20"
                                    y1="0"
                                    x2="-40"
                                    y2="0"
                                    stroke="#E5E7EB"
                                    strokeWidth="2"
                                    strokeDasharray="4,4"
                                />
                            </g>

                            <g transform="translate(200, 280)">
                                <circle cx="0" cy="0" r="20" fill="#F3F4F6" />
                                <circle cx="0" cy="-5" r="8" fill="#9CA3AF" />
                                <path d="M -12,10 Q -12,5 0,5 Q 12,5 12,10" fill="#9CA3AF" />
                                <line
                                    x1="0"
                                    y1="-20"
                                    x2="0"
                                    y2="-40"
                                    stroke="#E5E7EB"
                                    strokeWidth="2"
                                    strokeDasharray="4,4"
                                />
                            </g>

                            {/* Status Indicator */}
                            {userRole === 'UNKNOWN' && (
                                <g transform="translate(250, 130)">
                                    <circle cx="0" cy="0" r="15" fill="#FEF3C7" />
                                    <path
                                        d="M 0,-8 L 0,2"
                                        stroke="#F59E0B"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                    />
                                    <circle cx="0" cy="8" r="2" fill="#F59E0B" />
                                </g>
                            )}

                            {/* Decorative Elements */}
                            <circle cx="80" cy="80" r="3" fill="#E5E7EB" />
                            <circle cx="320" cy="80" r="3" fill="#E5E7EB" />
                            <circle cx="100" cy="250" r="3" fill="#E5E7EB" />
                            <circle cx="300" cy="250" r="3" fill="#E5E7EB" />

                            {/* Clock for pending */}
                            {userRole === 'UNKNOWN' && (
                                <g transform="translate(320, 200)">
                                    <circle
                                        cx="0"
                                        cy="0"
                                        r="25"
                                        fill="white"
                                        stroke="#E5E7EB"
                                        strokeWidth="2"
                                    />
                                    <circle cx="0" cy="0" r="2" fill="#6B7280" />
                                    <line
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="-10"
                                        stroke="#6B7280"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                    <line
                                        x1="0"
                                        y1="0"
                                        x2="8"
                                        y2="0"
                                        stroke="#6B7280"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                </g>
                            )}
                        </svg>
                    </div>

                    {/* Status Card */}
                    <div
                        className={`max-w-2xl mx-auto ${statusInfo.bgColor} ${statusInfo.borderColor} border-2 rounded-xl p-8 mb-8`}
                    >
                        <div className="flex justify-center mb-4">
                            <div className={`p-3 bg-white rounded-full shadow-sm`}>
                                <StatusIcon className={`w-8 h-8 ${statusInfo.iconColor}`} />
                            </div>
                        </div>

                        <h1 className="mb-3 text-3xl font-bold text-gray-900">
                            {statusInfo.title}
                        </h1>

                        <p className="mb-2 text-lg text-gray-700">{statusInfo.message}</p>

                        <p className="mb-6 text-base text-gray-600">{statusInfo.submessage}</p>

                        {/* User Info */}
                        <div className="max-w-md p-4 mx-auto space-y-3 text-left bg-white rounded-lg">
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <span className="text-sm text-gray-500">Account</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {userFullName}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <span className="text-sm text-gray-500">Email</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {userEmail}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <span className="text-sm text-gray-500">Current Status</span>
                                <span
                                    className={`text-sm font-medium px-2 py-1 rounded-full ${
                                        userRole === 'UNKNOWN'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : userRole === 'SUSPENDED'
                                              ? 'bg-red-100 text-red-700'
                                              : 'bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    {userRole.replace(/_/g, ' ')}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-sm text-gray-500">Registered</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {timeSinceRegistration()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* What to expect section for pending users */}
                    {userRole === 'UNKNOWN' && (
                        <div className="max-w-2xl p-6 mx-auto mb-8 bg-white border border-gray-200 rounded-xl">
                            <h2 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                                <Info className="w-5 h-5 mr-2 text-blue-500" />
                                What happens next?
                            </h2>
                            <div className="space-y-3 text-left">
                                <div className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            Admin Review
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            An administrator will review your account details
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            Role Assignment
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            You'll be assigned an appropriate role based on your
                                            profile
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            Email Notification
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            You'll receive an email once your account is activated
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col items-center justify-center gap-20 sm:flex-row">
                        <button
                            onClick={handleBackToLogin}
                            className="w-full px-6 py-3 font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg sm:w-auto hover:bg-gray-50"
                        >
                            Back to Login
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center w-full px-6 py-3 font-medium text-white transition-colors bg-purple-600 rounded-lg sm:w-auto hover:bg-purple-700"
                        >
                            <LogOut className="w-5 h-5 mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UnauthorizedRolePage;
