import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import OwnerDashboard from './pages/OwnerDashboard';


const NotFound = () => <div><h1>404 - Page Not Found</h1></div>;

// A wrapper to protect routes based on roles
const ProtectedRoute = ({ children, allowedRole }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;
    
    if (!user) return <Navigate to="/login" replace />;
    
    if (allowedRole && user.role !== allowedRole) {
        // Redirect to their specific dashboard if they try to access the wrong one
        if (user.role === 'SYSTEM_ADMIN') return <Navigate to="/admin" replace />;
        if (user.role === 'STORE_OWNER') return <Navigate to="/owner" replace />;
        return <Navigate to="/user" replace />;
    }

    return children;
};

const AppRoutes = () => {
    const { user } = useContext(AuthContext);

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.role === 'SYSTEM_ADMIN' ? 'admin' : user.role === 'STORE_OWNER' ? 'owner' : 'user'}`} />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/user" />} />

            {/* Protected Routes */}
            <Route path="/admin" element={
                <ProtectedRoute allowedRole="SYSTEM_ADMIN">
                    <AdminDashboard />
                </ProtectedRoute>
            } />
            <Route path="/user" element={
                <ProtectedRoute allowedRole="NORMAL_USER">
                    <UserDashboard />
                </ProtectedRoute>
            } />
            <Route path="/owner" element={
                <ProtectedRoute allowedRole="STORE_OWNER">
                    <OwnerDashboard />
                </ProtectedRoute>
            } />

            {/* Default Redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
};

export default App;