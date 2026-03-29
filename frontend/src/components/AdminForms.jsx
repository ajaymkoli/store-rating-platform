import React, { useState } from 'react';
import api from '../utils/api';

// --- ADD USER FORM ---
export const AddUserForm = ({ onUserAdded }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); setError('');
        try {
            await api.post('/admin/users', formData);
            setMessage('User added successfully!');
            setFormData({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' });
            if (onUserAdded) onUserAdded(); // Refresh stats on the dashboard
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add user.');
        }
    };

    return (
        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ marginTop: 0 }}>Add New User</h3>
            {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="text" placeholder="Name (20-60 chars)" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required minLength={20} maxLength={60} />
                <input type="email" placeholder="Email" className="form-control" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                <input type="password" placeholder="Password (8-16 chars, 1 uppercase, 1 special)" className="form-control" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required minLength={8} maxLength={16} />
                <input type="text" placeholder="Address (Max 400 chars)" className="form-control" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required maxLength={400} />
                <select className="form-control" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                    <option value="NORMAL_USER">Normal User</option>
                    <option value="SYSTEM_ADMIN">System Admin</option>
                    <option value="STORE_OWNER">Store Owner</option>
                </select>
                <button type="submit" className="btn-primary" style={{ backgroundColor: '#10b981' }}>Create User</button>
            </form>
        </div>
    );
};

// --- ADD STORE FORM ---
export const AddStoreForm = ({ onStoreAdded }) => {
    const [formData, setFormData] = useState({ name: '', email: '', address: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); setError('');
        try {
            // We pass owner_id as null for now to keep it simple, as assigning owners can happen later
            await api.post('/admin/stores', { ...formData, owner_id: null });
            setMessage('Store added successfully!');
            setFormData({ name: '', email: '', address: '' });
            if (onStoreAdded) onStoreAdded(); // Refresh stats on the dashboard
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add store.');
        }
    };

    return (
        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ marginTop: 0 }}>Add New Store</h3>
            {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="text" placeholder="Store Name" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                <input type="email" placeholder="Store Email" className="form-control" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                <input type="text" placeholder="Store Address" className="form-control" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
                <button type="submit" className="btn-primary" style={{ backgroundColor: '#3b82f6' }}>Create Store</button>
            </form>
        </div>
    );
};