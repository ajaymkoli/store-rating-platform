import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const UserDashboard = () => {
    const { logout, user } = useContext(AuthContext);
    const [stores, setStores] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        // Fetch all stores initially
        fetchStores();
    }, []);

    const fetchStores = async (query = '') => {
        try {
            setLoading(true);
            const response = await api.get(`/user/stores${query ? `?search=${query}` : ''}`);
            setStores(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching stores", error);
            setMessage({ text: 'Failed to load stores.', type: 'error' });
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchStores(searchQuery);
    };

    const submitRating = async (storeId, ratingValue) => {
        try {
            await api.post('/user/ratings', { store_id: storeId, rating: ratingValue });
            setMessage({ text: 'Rating saved successfully!', type: 'success' });
            fetchStores(searchQuery); // Refresh the list to show the new average and user's rating
            
            // Clear message after 3 seconds
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (error) {
            setMessage({ text: error.response?.data?.error || 'Failed to submit rating.', type: 'error' });
        }
    };

    // Helper component for Star Rating
    const StarRater = ({ storeId, currentRating }) => {
        return (
            <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => submitRating(storeId, star)}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: currentRating >= star ? '#f59e0b' : '#cbd5e1',
                            transition: 'color 0.2s'
                        }}
                        title={`Rate ${star} stars`}
                    >
                        ★
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' }}>
                <div>
                    <h1 style={{ margin: 0, color: '#1e293b' }}>Store Explorer</h1>
                    <p style={{ margin: '5px 0 0 0', color: '#64748b' }}>Discover and rate your favorite places.</p>
                </div>
                <button onClick={logout} className="btn-primary" style={{ width: 'auto', backgroundColor: '#ef4444' }}>
                    Logout
                </button>
            </div>

            {/* Notification Banner */}
            {message.text && (
                <div style={{ 
                    padding: '12px', 
                    marginBottom: '20px', 
                    borderRadius: '8px', 
                    textAlign: 'center',
                    backgroundColor: message.type === 'success' ? '#dcfce3' : '#fee2e2',
                    color: message.type === 'success' ? '#166534' : '#991b1b',
                    fontWeight: 'bold'
                }}>
                    {message.text}
                </div>
            )}

            {/* Search Bar */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Search by Store Name or Address..." 
                    value={searchQuery}
                    onChange={(e) => {
                    setSearchQuery(e.target.value);
                    //If user delete everything in search bar, instantly fetch all stores!
                    if (e.target.value === '') {
                        fetchStores('');
                    }
                    }}
                    style={{ flex: 1 }}
                />
                <button type="submit" className="btn-primary" style={{ width: '120px', marginTop: 0 }}>
                    Search
                </button>
                {searchQuery && (
                    <button type="button" onClick={() => { setSearchQuery(''); fetchStores(''); }} style={{ padding: '0 20px', background: '#e2e8f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Clear
                    </button>
                )}
            </form>

            {/* Stores Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading stores...</div>
            ) : stores.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '50px', color: '#64748b' }}>No stores found.</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    {stores.map(store => (
                        <div key={store.store_id} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderTop: '4px solid #3b82f6' }}>
                            <h2 style={{ margin: '0 0 10px 0', fontSize: '20px', color: '#0f172a' }}>{store.store_name}</h2>
                            <p style={{ margin: '0 0 15px 0', color: '#64748b', fontSize: '14px', lineHeight: '1.5' }}>📍 {store.address}</p>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '15px' }}>
                                <div>
                                    <span style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>OVERALL RATING</span>
                                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a' }}>★ {store.overall_rating}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>YOUR RATING</span>
                                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: store.user_submitted_rating ? '#3b82f6' : '#94a3b8' }}>
                                        {store.user_submitted_rating ? `${store.user_submitted_rating} / 5` : 'Not rated'}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#475569' }}>
                                    {store.user_submitted_rating ? 'Modify your rating:' : 'Submit a rating:'}
                                </span>
                                <StarRater storeId={store.store_id} currentRating={store.user_submitted_rating || 0} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;