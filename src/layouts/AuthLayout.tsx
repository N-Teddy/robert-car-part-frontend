// src/layouts/AuthLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Wrench } from 'lucide-react';

export const AuthLayout: React.FC = () => {
    return (
        <div className="min-h-screen relative flex items-center justify-center p-4">
            {/* Background with overlay */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.6), rgba(17, 24, 39, 0.65)), url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            />

            {/* Animated gradient overlay */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900/50 via-transparent to-red-900/30" />

            {/* Content */}
            <div className="relative z-10 w-full max-w-md">
                {/* Logo Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl mb-4 shadow-2xl shadow-red-600/20 transform hover:scale-105 transition-transform">
                        <Wrench className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">AutoParts Pro</h1>
                    <p className="text-gray-300 text-sm">Inventory Management System</p>
                </div>

                {/* Dynamic Content */}
                <Outlet />

                {/* Footer */}
                <p className="text-center text-gray-400 text-xs mt-8">
                    © 2024 AutoParts Pro. All rights reserved.
                </p>
            </div>
        </div>
    );
};
