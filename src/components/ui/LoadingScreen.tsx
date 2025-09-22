// src/components/ui/LoadingScreen.tsx
import React from 'react';
import { Loader2, Wrench } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 flex items-center justify-center">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-full mb-4 animate-pulse">
                    <Wrench className="w-10 h-10 text-white" />
                </div>
                <div className="flex items-center gap-3 text-white">
                    <Loader2 className="animate-spin" size={24} />
                    <span className="text-lg font-medium">Loading...</span>
                </div>
            </div>
        </div>
    );
};
