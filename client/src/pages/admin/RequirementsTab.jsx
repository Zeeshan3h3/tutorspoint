import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';
import { Trash2, AlertTriangle, Eye, Flame } from 'lucide-react';

export default function RequirementsTab() {
    const [requirements, setRequirements] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadRequirements = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/requirements');
            setRequirements(data.data);
        } catch (err) {
            console.error('Failed to load requirements', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRequirements();
    }, [loadRequirements]);

    const handleStatus = async (id, newStatus) => {
        if (!window.confirm(`Mark this requirement as ${newStatus}?`)) return;

        try {
            await api.patch(`/admin/requirements/${id}/status`, { status: newStatus });
            loadRequirements();
        } catch (err) {
            alert(err.response?.data?.message || 'Operation failed');
        }
    };

    return (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#F1F5F9', color: '#475569', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>
                            <th style={{ padding: '16px 20px', fontWeight: 700 }}>Lead Details</th>
                            <th style={{ padding: '16px 20px', fontWeight: 700 }}>Academics</th>
                            <th style={{ padding: '16px 20px', fontWeight: 700 }}>Demand (Heat)</th>
                            <th style={{ padding: '16px 20px', fontWeight: 700 }}>Quick Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requirements.map(req => (
                            <tr key={req._id} style={{ borderBottom: '1px solid #E2E8F0', opacity: req.status === 'spam' ? 0.6 : 1 }}>
                                {/* Area & User */}
                                <td style={{ padding: '20px' }}>
                                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 15, marginBottom: 4 }}>
                                        📍 {req.area}
                                    </div>
                                    <div style={{ fontSize: 13, color: '#475569', display: 'flex', alignItems: 'center', gap: 6 }}>
                                        👤 {req.postedByName}
                                    </div>
                                    <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>
                                        📞 {req.phone}
                                    </div>
                                </td>

                                {/* Academics */}
                                <td style={{ padding: '20px', fontSize: 14 }}>
                                    <div style={{ fontWeight: 600, color: '#2563EB', marginBottom: 4 }}>
                                        {req.classLevel} ({req.board || 'Any'})
                                    </div>
                                    <div style={{ color: '#475569' }}>
                                        {req.subjects?.join(', ')}
                                    </div>
                                    <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>
                                        Budget: ₹{req.budgetMin} - ₹{req.budgetMax}/mo
                                    </div>
                                </td>

                                {/* Demand & Heat */}
                                <td style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                        {req.unlockCount > 0 ? (
                                            <div style={{ background: '#FFF1F2', color: '#E11D48', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <Flame size={14} fill="#E11D48" /> {req.unlockCount} Unlocks
                                            </div>
                                        ) : (
                                            <div style={{ background: '#F1F5F9', color: '#64748B', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                                                0 Unlocks
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ fontSize: 12, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <Eye size={14} /> {req.views} Views
                                    </div>
                                    <div style={{ fontSize: 12, color: '#10B981', fontWeight: 600, marginTop: 4 }}>
                                        ₹{req.unlockCount * 40} Revenue
                                    </div>
                                </td>

                                {/* Quick Actions */}
                                <td style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <span style={{
                                            background: req.status === 'open' ? '#ECFDF5' : req.status === 'spam' ? '#FEF2F2' : '#F1F5F9',
                                            color: req.status === 'open' ? '#10B981' : req.status === 'spam' ? '#EF4444' : '#64748B',
                                            padding: '8px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, textTransform: 'uppercase'
                                        }}>
                                            {req.status}
                                        </span>

                                        {req.status !== 'spam' && (
                                            <button
                                                title="Mark as Spam"
                                                onClick={() => handleStatus(req._id, 'spam')}
                                                style={{ background: '#FEF2F2', color: '#E11D48', border: 'none', padding: 8, borderRadius: 8, cursor: 'pointer' }}
                                            >
                                                <AlertTriangle size={18} />
                                            </button>
                                        )}

                                        {req.status !== 'closed' && req.status !== 'spam' && (
                                            <button
                                                title="Remove/Close"
                                                onClick={() => handleStatus(req._id, 'closed')}
                                                style={{ background: '#F1F5F9', color: '#64748B', border: 'none', padding: 8, borderRadius: 8, cursor: 'pointer' }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 8 }}>
                                        Posted: {new Date(req.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {requirements.length === 0 && !loading && (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
                                    No requirements have been posted yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
