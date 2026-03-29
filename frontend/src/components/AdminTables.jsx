import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export const AdminTables = () => {
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [userFilter, setUserFilter] = useState('');
    const [storeFilter, setStoreFilter] = useState('');

    // Sort states
    const [userSort, setUserSort] = useState({ key: 'name', direction: 'asc' });
    const [storeSort, setStoreSort] = useState({ key: 'name', direction: 'asc' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersRes, storesRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/stores')
            ]);
            setUsers(usersRes.data);
            setStores(storesRes.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data", error);
            setLoading(false);
        }
    };

    // Generic Sort Function
    const handleSort = (config, setConfig, key) => {
        let direction = 'asc';
        if (config.key === key && config.direction === 'asc') {
            direction = 'desc';
        }
        setConfig({ key, direction });
    };

    const sortData = (data, sortConfig) => {
        return [...data].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    };

    // Filter Logic applying to Name, Email, Address, and Role
    const filteredUsers = sortData(users.filter(u => 
        u.name.toLowerCase().includes(userFilter.toLowerCase()) ||
        u.email.toLowerCase().includes(userFilter.toLowerCase()) ||
        u.address.toLowerCase().includes(userFilter.toLowerCase()) ||
        u.role.toLowerCase().includes(userFilter.toLowerCase())
    ), userSort);

    const filteredStores = sortData(stores.filter(s => 
        s.name.toLowerCase().includes(storeFilter.toLowerCase()) ||
        s.email.toLowerCase().includes(storeFilter.toLowerCase()) ||
        s.address.toLowerCase().includes(storeFilter.toLowerCase())
    ), storeSort);

    if (loading) return <div>Loading tables...</div>;

    const thStyle = { padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', cursor: 'pointer', backgroundColor: '#f8fafc', userSelect: 'none' };
    const tdStyle = { padding: '12px', borderBottom: '1px solid #e2e8f0' };

    return (
        <div style={{ marginTop: '40px' }}>
            {/* USERS TABLE */}
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0 }}>Users Directory</h2>
                    <input 
                        type="text" 
                        placeholder="Filter by Name, Email, Address, Role..." 
                        className="form-control" 
                        style={{ width: '300px' }}
                        value={userFilter}
                        onChange={(e) => setUserFilter(e.target.value)}
                    />
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={thStyle} onClick={() => handleSort(userSort, setUserSort, 'name')}>Name {userSort.key === 'name' ? (userSort.direction === 'asc' ? '↑' : '↓') : '↕'}</th>
                                <th style={thStyle} onClick={() => handleSort(userSort, setUserSort, 'email')}>Email {userSort.key === 'email' ? (userSort.direction === 'asc' ? '↑' : '↓') : '↕'}</th>
                                <th style={thStyle} onClick={() => handleSort(userSort, setUserSort, 'address')}>Address {userSort.key === 'address' ? (userSort.direction === 'asc' ? '↑' : '↓') : '↕'}</th>
                                <th style={thStyle} onClick={() => handleSort(userSort, setUserSort, 'role')}>Role {userSort.key === 'role' ? (userSort.direction === 'asc' ? '↑' : '↓') : '↕'}</th>
                                <th style={thStyle} onClick={() => handleSort(userSort, setUserSort, 'rating')}>Owner Rating {userSort.key === 'rating' ? (userSort.direction === 'asc' ? '↑' : '↓') : '↕'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id} style={{ transition: 'background-color 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f1f5f9'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    <td style={tdStyle}>{user.name}</td>
                                    <td style={tdStyle}>{user.email}</td>
                                    <td style={tdStyle}>{user.address}</td>
                                    <td style={tdStyle}><span style={{ padding: '4px 8px', backgroundColor: '#e2e8f0', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{user.role}</span></td>
                                    <td style={tdStyle}>{user.role === 'STORE_OWNER' ? (user.rating ? `★ ${user.rating}` : 'No ratings') : 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* STORES TABLE */}
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0 }}>Stores Directory</h2>
                    <input 
                        type="text" 
                        placeholder="Filter by Name, Email, or Address..." 
                        className="form-control" 
                        style={{ width: '300px' }}
                        value={storeFilter}
                        onChange={(e) => setStoreFilter(e.target.value)}
                    />
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={thStyle} onClick={() => handleSort(storeSort, setStoreSort, 'name')}>Name {storeSort.key === 'name' ? (storeSort.direction === 'asc' ? '↑' : '↓') : '↕'}</th>
                                <th style={thStyle} onClick={() => handleSort(storeSort, setStoreSort, 'email')}>Email {storeSort.key === 'email' ? (storeSort.direction === 'asc' ? '↑' : '↓') : '↕'}</th>
                                <th style={thStyle} onClick={() => handleSort(storeSort, setStoreSort, 'address')}>Address {storeSort.key === 'address' ? (storeSort.direction === 'asc' ? '↑' : '↓') : '↕'}</th>
                                <th style={thStyle} onClick={() => handleSort(storeSort, setStoreSort, 'rating')}>Rating {storeSort.key === 'rating' ? (storeSort.direction === 'asc' ? '↑' : '↓') : '↕'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStores.map(store => (
                                <tr key={store.id} style={{ transition: 'background-color 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f1f5f9'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    <td style={tdStyle}>{store.name}</td>
                                    <td style={tdStyle}>{store.email}</td>
                                    <td style={tdStyle}>{store.address}</td>
                                    <td style={tdStyle}><span style={{ color: '#f59e0b', fontWeight: 'bold' }}>★ {store.rating}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};