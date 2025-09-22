// src/layouts/DashboardLayout.tsx
import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    Menu,
    X,
    Home,
    Users,
    Package,
    ShoppingCart,
    FileText,
    Settings,
    LogOut,
    ChevronDown,
    Search,
    Wrench,
    BarChart3,
    Truck,
    UserCircle,
    Bell,
    FolderTree,
    Car,
    Bolt,
} from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import { NotificationBell } from '../components/notifications/NotificationBell';

export const DashboardLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthContext();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: Home },
        { name: 'Users', href: '/users', icon: Users },
        { name: 'Categories', href: '/categories', icon: FolderTree },
        { name: 'Vehicles', href: '/vehicles', icon: Car },
        { name: 'Parts', href: '/parts', icon: Bolt },
        { name: 'Orders', href: '/orders', icon: ShoppingCart },
        { name: 'Reports', href: '/reports', icon: BarChart3 },
        { name: 'Notifications', href: '/notifications', icon: Bell },
        { name: 'Settings', href: '/settings', icon: Settings },
    ];

    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Fixed position on desktop */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                                <Wrench className="w-5 h-5 text-white" />
                            </div>
                            <span className="ml-3 text-white font-semibold text-lg">AutoParts Pro</span>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-gray-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${active
                                            ? 'bg-red-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                        }`}
                                >
                                    <Icon className="w-5 h-5 mr-3" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User info */}
                    <div className="p-4 border-t border-gray-800">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold">
                                {user?.fullName ? getInitials(user.fullName) : 'U'}
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-white">{user?.fullName}</p>
                                <p className="text-xs text-gray-400">{user?.role}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content - Add margin-left for desktop */}
            <div className="flex-1 lg:ml-64">
                {/* Top bar */}
                <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Mobile menu button */}
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden text-gray-500 hover:text-gray-600"
                            >
                                <Menu size={24} />
                            </button>

                            {/* Search bar */}
                            <div className="flex-1 max-w-lg mx-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    />
                                </div>
                            </div>

                            {/* Right side buttons */}
                            <div className="flex items-center space-x-4">
                                {/* Notifications */}
                                <button className="relative text-gray-500 hover:text-gray-600">
                                    <NotificationBell />
                                </button>

                                {/* Profile dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                        className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                                            {user?.fullName ? getInitials(user.fullName) : 'U'}
                                        </div>
                                        <ChevronDown className="ml-2 w-4 h-4 text-gray-500" />
                                    </button>

                                    {profileDropdownOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setProfileDropdownOpen(false)}
                                            />
                                            <div className="absolute right-0 z-20 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200">
                                                <Link
                                                    to="/profile"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={() => setProfileDropdownOpen(false)}
                                                >
                                                    <UserCircle className="w-4 h-4 mr-2" />
                                                    Your Profile
                                                </Link>
                                                <Link
                                                    to="/settings"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={() => setProfileDropdownOpen(false)}
                                                >
                                                    <Settings className="w-4 h-4 mr-2" />
                                                    Settings
                                                </Link>
                                                <hr className="my-1 border-gray-200" />
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    <LogOut className="w-4 h-4 mr-2" />
                                                    Sign out
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
