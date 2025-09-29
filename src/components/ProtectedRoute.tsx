// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingScreen } from './ui/LoadingScreen';
import { useAuthContext } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, loading, user } = useAuthContext();
    const location = useLocation();

    if (loading) {
        return <LoadingScreen />;
    }

    if (user && user.role === 'UNKNOWN') {
        return <Navigate to="/unknown" replace />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
