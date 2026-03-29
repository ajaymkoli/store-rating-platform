import React, { useEffect, useState, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { AddUserForm, AddStoreForm } from '../components/AdminForms';
import { AdminTables } from '../components/AdminTables';

const AdminDashboard = () => {
    const { logout, user } = useContext(AuthContext);
    const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await api.get('/admin/dashboard');
            setStats(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load dashboard statistics.');
            setLoading(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Command Center...</div>;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' }}>
                <div>
                    <h1 style={{ margin: 0, color: '#1e293b' }}>Admin Command Center</h1>
                    <p style={{ margin: '5px 0 0 0', color: '#64748b' }}>Logged in as: {user?.role}</p>
                </div>
                <button 
                    onClick={logout} 
                    style={{ padding: '10px 20px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Logout
                </button>
            </div>

            {error && <div className="alert-error">{error}</div>}

            {/* Statistics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                
                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderLeft: '5px solid #3b82f6' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '16px' }}>Total Registered Users</h3>
                    <h2 style={{ margin: 0, fontSize: '36px', color: '#0f172a' }}>{stats.totalUsers}</h2>
                </div>

                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderLeft: '5px solid #10b981' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '16px' }}>Total Stores on Platform</h3>
                    <h2 style={{ margin: 0, fontSize: '36px', color: '#0f172a' }}>{stats.totalStores}</h2>
                </div>

                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderLeft: '5px solid #f59e0b' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '16px' }}>Total Ratings Submitted</h3>
                    <h2 style={{ margin: 0, fontSize: '36px', color: '#0f172a' }}>{stats.totalRatings}</h2>
                </div>

            </div>

            {/* Placeholder for the next sections */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <AddUserForm onUserAdded={fetchDashboardStats} />
                <AddStoreForm onStoreAdded={fetchDashboardStats} />
            </div>
            <AdminTables />
        </div>
    );
};

export default AdminDashboard;