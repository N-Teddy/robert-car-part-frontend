// src/App.tsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './routes';
import { NotificationProvider } from './context/NotificationContext';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <NotificationProvider>
                    <AppRoutes />
                </NotificationProvider>
            </Router>
        </AuthProvider>
    );
};

export default App;