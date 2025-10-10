// src/pages/NotFound.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, AlertCircle } from 'lucide-react';

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Main Content */}
            <main className="flex items-center justify-center flex-1 px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-2xl text-center">
                    {/* 404 Illustration */}
                    <div className="relative w-full max-w-md mx-auto mb-8">
                        <svg
                            className="w-full h-auto"
                            viewBox="0 0 400 350"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {/* Background Elements */}
                            <rect x="50" y="250" width="300" height="2" fill="#E5E7EB" />

                            {/* Lost Package Box */}
                            <g transform="translate(150, 120)">
                                {/* Box */}
                                <rect
                                    x="0"
                                    y="40"
                                    width="100"
                                    height="80"
                                    fill="#F3F4F6"
                                    stroke="#9CA3AF"
                                    strokeWidth="2"
                                />
                                <rect
                                    x="0"
                                    y="40"
                                    width="100"
                                    height="20"
                                    fill="#E5E7EB"
                                    stroke="#9CA3AF"
                                    strokeWidth="2"
                                />
                                <line
                                    x1="50"
                                    y1="40"
                                    x2="50"
                                    y2="60"
                                    stroke="#9CA3AF"
                                    strokeWidth="2"
                                />

                                {/* Question mark on box */}
                                <text
                                    x="50"
                                    y="95"
                                    fontSize="36"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                    fill="#9333EA"
                                >
                                    ?
                                </text>

                                {/* Tape */}
                                <rect
                                    x="40"
                                    y="30"
                                    width="20"
                                    height="40"
                                    fill="#FCD34D"
                                    opacity="0.8"
                                />
                                <rect
                                    x="40"
                                    y="110"
                                    width="20"
                                    height="20"
                                    fill="#FCD34D"
                                    opacity="0.8"
                                />
                            </g>

                            {/* 404 Numbers */}
                            <text
                                x="200"
                                y="100"
                                fontSize="72"
                                fontWeight="bold"
                                textAnchor="middle"
                                fill="#9333EA"
                                fontFamily="system-ui"
                            >
                                404
                            </text>

                            {/* Compass/Lost indicator */}
                            <g transform="translate(80, 150)">
                                <circle
                                    cx="0"
                                    cy="0"
                                    r="25"
                                    fill="none"
                                    stroke="#D1D5DB"
                                    strokeWidth="2"
                                />
                                <circle cx="0" cy="0" r="3" fill="#9333EA" />
                                <path d="M 0,-20 L 5,-5 L 0,0 L -5,-5 Z" fill="#EF4444" />
                                <path d="M 0,20 L 5,5 L 0,0 L -5,5 Z" fill="#6B7280" />
                                <text
                                    x="0"
                                    y="-30"
                                    fontSize="10"
                                    textAnchor="middle"
                                    fill="#6B7280"
                                >
                                    N
                                </text>
                            </g>

                            {/* Map/Path lines */}
                            <path
                                d="M 300,180 Q 320,160 300,140 T 280,100"
                                stroke="#E5E7EB"
                                strokeWidth="2"
                                fill="none"
                                strokeDasharray="5,5"
                            />
                            <path
                                d="M 100,200 Q 80,180 100,160 T 120,140"
                                stroke="#E5E7EB"
                                strokeWidth="2"
                                fill="none"
                                strokeDasharray="5,5"
                            />

                            {/* Location pins */}
                            <g transform="translate(320, 200)">
                                <path
                                    d="M 0,0 C -8,-8 -8,-20 0,-28 C 8,-20 8,-8 0,0 Z"
                                    fill="#EF4444"
                                    opacity="0.6"
                                />
                                <circle cx="0" cy="-14" r="4" fill="white" />
                            </g>

                            <g transform="translate(80, 220)">
                                <path
                                    d="M 0,0 C -8,-8 -8,-20 0,-28 C 8,-20 8,-8 0,0 Z"
                                    fill="#10B981"
                                    opacity="0.6"
                                />
                                <circle cx="0" cy="-14" r="4" fill="white" />
                            </g>

                            {/* Floating question marks */}
                            <text x="120" y="80" fontSize="20" fill="#D1D5DB" opacity="0.6">
                                ?
                            </text>
                            <text x="280" y="90" fontSize="16" fill="#D1D5DB" opacity="0.5">
                                ?
                            </text>
                            <text x="250" y="220" fontSize="18" fill="#D1D5DB" opacity="0.4">
                                ?
                            </text>
                            <text x="150" y="240" fontSize="14" fill="#D1D5DB" opacity="0.5">
                                ?
                            </text>

                            {/* Road/Path at bottom */}
                            <rect x="0" y="280" width="400" height="40" fill="#F3F4F6" />
                            <rect
                                x="0"
                                y="295"
                                width="50"
                                height="10"
                                fill="#9CA3AF"
                                opacity="0.5"
                            />
                            <rect
                                x="70"
                                y="295"
                                width="50"
                                height="10"
                                fill="#9CA3AF"
                                opacity="0.5"
                            />
                            <rect
                                x="140"
                                y="295"
                                width="50"
                                height="10"
                                fill="#9CA3AF"
                                opacity="0.5"
                            />
                            <rect
                                x="210"
                                y="295"
                                width="50"
                                height="10"
                                fill="#9CA3AF"
                                opacity="0.5"
                            />
                            <rect
                                x="280"
                                y="295"
                                width="50"
                                height="10"
                                fill="#9CA3AF"
                                opacity="0.5"
                            />
                            <rect
                                x="350"
                                y="295"
                                width="50"
                                height="10"
                                fill="#9CA3AF"
                                opacity="0.5"
                            />
                        </svg>
                    </div>

                    {/* Error Message */}
                    <h1 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl">
                        Page Not Found
                    </h1>
                    <p className="mb-2 text-lg text-gray-600">
                        Looks like you've ventured into uncharted territory!
                    </p>
                    <p className="max-w-lg mx-auto mb-8 text-base text-gray-500">
                        The page you're looking for doesn't exist or has been moved. Let's get you
                        back on track.
                    </p>

                    {/* Error Details */}
                    <div className="max-w-md p-4 mx-auto mb-8 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                            <div className="flex-1 text-left">
                                <p className="text-sm font-medium text-gray-900">What happened?</p>
                                <p className="mt-1 text-sm text-gray-500">
                                    The URL{' '}
                                    <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                                        {window.location.pathname}
                                    </code>{' '}
                                    was not found on this server.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center justify-center w-full px-6 py-3 font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg sm:w-auto hover:bg-gray-50"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Go Back
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center justify-center w-full px-6 py-3 font-medium text-white transition-colors bg-purple-600 rounded-lg sm:w-auto hover:bg-purple-700"
                        >
                            <Home className="w-5 h-5 mr-2" />
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default NotFoundPage;
