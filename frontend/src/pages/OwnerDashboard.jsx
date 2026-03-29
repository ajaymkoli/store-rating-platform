import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const OwnerDashboard = () => {
    const { logout, user } = useContext(AuthContext);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await api.get('/owner/dashboard');
                setDashboardData(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load dashboard.');
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Store Analytics...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' }}>
                <div>
                    <h1 style={{ margin: 0, color: '#1e293b' }}>Store Analytics</h1>
                    <p style={{ margin: '5px 0 0 0', color: '#64748b' }}>Logged in as: {user?.role}</p>
                </div>
                <button onClick={logout} className="btn-primary" style={{ width: 'auto', backgroundColor: '#ef4444' }}>
                    Logout
                </button>
            </div>

            {error ? (
                <div className="alert-error" style={{ padding: '40px', fontSize: '18px' }}>
                    <strong>Notice:</strong> {error}
                </div>
            ) : (
                <>
                    {/* Store Info & Average Rating Card */}
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '5px solid #f59e0b' }}>
                        <div>
                            <h2 style={{ margin: '0 0 10px 0', fontSize: '24px', color: '#0f172a' }}>{dashboardData.storeName}</h2>
                            <p style={{ margin: 0, color: '#64748b' }}>Performance Overview</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ display: 'block', fontSize: '14px', color: '#64748b', fontWeight: 'bold', marginBottom: '5px' }}>AVERAGE RATING</span>
                            <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#f59e0b' }}>★ {dashboardData.averageRating}</span>
                        </div>
                    </div>

                    {/* Ratings History Table */}
                    <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px' }}>Recent Ratings</h3>
                        
                        {dashboardData.ratingHistory.length === 0 ? (
                            <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>No ratings submitted yet.</p>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', backgroundColor: '#f8fafc' }}>Reviewer Name</th>
                                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', backgroundColor: '#f8fafc' }}>Contact Email</th>
                                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', backgroundColor: '#f8fafc' }}>Rating Given</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboardData.ratingHistory.map((review, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                <td style={{ padding: '12px' }}>{review.name}</td>
                                                <td style={{ padding: '12px', color: '#64748b' }}>{review.email}</td>
                                                <td style={{ padding: '12px', fontWeight: 'bold', color: '#f59e0b' }}>★ {review.rating}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default OwnerDashboard;