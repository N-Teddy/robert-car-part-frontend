// src/App.tsx or src/routes/index.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
import { UsersListPage } from '../pages/users/UsersListPage';
import { ProfilePage } from '../pages/users/ProfilePage';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { NotificationsPage } from '../pages/notifications/NotificationPage';
import { CategoriesPage } from '../pages/categories/CategoriesPage';
import { VehiclesPage } from '../pages/vehicles/VehiclesPage';
import { PartsPage } from '../pages/parts/PartsPage';
import { OrdersPage } from '../pages/orders/OrdersPage';

export const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />
                <Route path="reset-password" element={<ResetPasswordPage />} />
            </Route>
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Add your protected routes here */}
            <Route
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/dashboard" element={<div className="p-8">Dashboard Content</div>} />
                <Route path="/users" element={<UsersListPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/vehicles" element={<VehiclesPage />} />
                <Route path="/parts" element={<PartsPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
            </Route>
        </Routes>
    );
};
