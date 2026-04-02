import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';
import {
    CheckCircle, XCircle, Trash2, PauseCircle, ShieldAlert, ShieldCheck,
    Search, Filter, ChevronLeft, ChevronRight
} from 'lucide-react';

export default function TutorsTab() {
    const [tutors, setTutors] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [verifiedFilter, setVerifiedFilter] = useState(false);
    const [page, setPage] = useState(1);

    const loadTutors = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: 15 });
            if (search) params.append('search', search);
            if (statusFilter) params.append('status', statusFilter);
            if (verifiedFilter) params.append('isVerified', 'true');

            const { data } = await api.get(`/admin/tutors?${params.toString()}`);
            setTutors(data.data);
            setTotalItems(data.total);
            setTotalPages(data.pages);
        } catch (err) {
            console.error('Failed to load tutors', err);
        } finally {
            setLoading(false);
        }
    }, [page, search, statusFilter, verifiedFilter]);

    useEffect(() => {
        loadTutors();
    }, [loadTutors]);

    const handleStatus = async (id, newStatus) => {
        let reason = '';
        if (newStatus === 'REJECTED') {
            reason = prompt('Reason for rejection (optional):');
            if (reason === null) return;
        } else {
            if (!window.confirm(`Change status to ${newStatus}?`)) return;
        }

        try {
            if (newStatus === 'SUSPENDED') {
                await api.patch(`/admin/tutors/${id}/suspend`);
            } else {
                await api.patch(`/admin/tutors/${id}/status`, { status: newStatus, rejectedReason: reason });
            }
            loadTutors();
        } catch (err) {
            alert(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleVerify = async (id) => {
        try {
            await api.patch(`/admin/tutors/${id}/verify`);
            loadTutors();
        } catch (err) {
            alert('Failed to toggle verification');
        }
    };

    const handleTrust = async (id) => {
        try {
            await api.patch(`/admin/tutors/${id}/trust`);
            loadTutors();
        } catch (err) {
            alert('Failed to toggle trust badge');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'APPROVED': return { bg: '#ECFDF5', color: '#10B981' };
            case 'PENDING': return { bg: '#FFFBEB', color: '#F59E0B' };
            case 'SUSPENDED': return { bg: '#FEF2F2', color: '#E11D48' };
            case 'REMOVED': return { bg: '#F1F5F9', color: '#64748B' };
            case 'REJECTED': return { bg: '#FEF2F2', color: '#9F1239' };
            default: return { bg: '#F1F5F9', color: '#64748B' };
        }
    };

    return (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
            <div style={{ padding: 20, borderBottom: '1px solid #E2E8F0', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', background: '#F8FAFC' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 250 }}>
                    <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: 12, top: 11 }} />
                    <input
                        type="text"
                        placeholder="Search by name, phone, area..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        style={{ width: '100%', padding: '10px 16px 10px 40px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: 14 }}
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: 14, background: '#fff', minWidth: 160 }}
                >
                    <option value="">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="REMOVED">Removed</option>
                </select>

                <button
                    onClick={() => { setVerifiedFilter(!verifiedFilter); setPage(1); }}
                    style={{ padding: '10px 16px', borderRadius: 8, border: verifiedFilter ? '1px solid #10B981' : '1px solid #CBD5E1', background: verifiedFilter ? '#ECFDF5' : '#fff', color: verifiedFilter ? '#10B981' : '#475569', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                >
                    {verifiedFilter ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
                    Verified Only
                </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#F1F5F9', color: '#475569', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>
                            <th style={{ padding: '16px 20px', fontWeight: 700 }}>Tutor Details</th>
                            <th style={{ padding: '16px 20px', fontWeight: 700 }}>Area & Auth</th>
                            <th style={{ padding: '16px 20px', fontWeight: 700 }}>Status & Score</th>
                            <th style={{ padding: '16px 20px', fontWeight: 700 }}>Quick Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tutors.map(tutor => {
                            const { bg, color } = getStatusStyle(tutor.status);
                            return (
                                <tr key={tutor._id} style={{ borderBottom: '1px solid #E2E8F0', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    {/* Info */}
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{ position: 'relative' }}>
                                                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#475569' }}>
                                                    {tutor.userId?.name?.[0] || '?'}
                                                </div>
                                                {tutor.isVerified && (
                                                    <div style={{ position: 'absolute', bottom: -2, right: -2, background: '#fff', borderRadius: '50%', padding: 2 }}>
                                                        <ShieldCheck size={16} fill="#10B981" color="#fff" />
                                                    </div>
                                                )}
                                                {tutor.trustedTutor && (
                                                    <div style={{ position: 'absolute', top: -2, right: -2, background: '#fff', borderRadius: '50%', padding: 2, fontSize: 12 }} title="Trusted Tutor (God Badge)">
                                                        ⭐
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    {tutor.userId?.name || 'Unknown User'}
                                                </div>
                                                <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>📞 {tutor.userId?.phone || 'No phone'}</div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Area & Bio */}
                                    <td style={{ padding: '20px', fontSize: 14 }}>
                                        <div style={{ fontWeight: 600, color: '#334155' }}>
                                            📍 {tutor.area || 'Not specified'}
                                        </div>
                                        <div style={{ color: '#0F172A', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200, fontWeight: 500 }}>
                                            🎓 {tutor.college || 'No college listed'}
                                        </div>
                                        {tutor.fraudFlags && tutor.fraudFlags.length > 0 && (
                                            <div style={{ marginTop: 8, fontSize: 11, color: '#E11D48', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <ShieldAlert size={14} /> {tutor.fraudFlags.length} Fraud Flag(s)
                                            </div>
                                        )}
                                    </td>

                                    {/* Status & Score */}
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                            <span style={{ background: bg, color: color, padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, letterSpacing: 0.5, display: 'inline-block' }}>
                                                {tutor.status}
                                            </span>
                                            {tutor.lastCriticalUpdateAt && tutor.status === 'PENDING' && (
                                                <span title="Auto Re-Review Prompted" style={{ color: '#D97706', display: 'flex', alignItems: 'center' }}>
                                                    <ShieldAlert size={16} />
                                                </span>
                                            )}
                                        </div>
                                        {/* Profile Score Bar */}
                                        <div style={{ width: '100%', maxWidth: 120 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748B', marginBottom: 4, fontWeight: 600 }}>
                                                <span>Completeness</span>
                                                <span style={{ color: tutor.completenessScore >= 80 ? '#10B981' : tutor.completenessScore >= 40 ? '#F59E0B' : '#EF4444' }}>{tutor.completenessScore || 0}%</span>
                                            </div>
                                            <div style={{ height: 6, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${tutor.completenessScore || 0}%`, background: tutor.completenessScore >= 80 ? '#10B981' : tutor.completenessScore >= 40 ? '#F59E0B' : '#EF4444' }} />
                                            </div>
                                        </div>
                                    </td>

                                    {/* Quick Actions */}
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                            <button
                                                onClick={() => window.open(`/admin/tutors/${tutor._id}/review`, '_blank')}
                                                style={{ background: '#3B4DE8', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s', marginRight: 4 }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#4F46E5'}
                                                onMouseLeave={e => e.currentTarget.style.background = '#3B4DE8'}
                                            >
                                                Review
                                            </button>

                                            {['PENDING', 'SUSPENDED', 'REMOVED'].includes(tutor.status) && (
                                                <button title="Approve" onClick={() => handleStatus(tutor._id, 'APPROVED')} style={{ background: '#ECFDF5', color: '#10B981', border: 'none', padding: 8, borderRadius: 8, cursor: 'pointer' }}><CheckCircle size={18} /></button>
                                            )}

                                            {tutor.status === 'APPROVED' && (
                                                <button title="Suspend" onClick={() => handleStatus(tutor._id, 'SUSPENDED')} style={{ background: '#FEF2F2', color: '#E11D48', border: 'none', padding: 8, borderRadius: 8, cursor: 'pointer' }}><PauseCircle size={18} /></button>
                                            )}

                                            {['PENDING'].includes(tutor.status) && (
                                                <button title="Reject" onClick={() => handleStatus(tutor._id, 'REJECTED')} style={{ background: '#FEF2F2', color: '#9F1239', border: 'none', padding: 8, borderRadius: 8, cursor: 'pointer' }}><XCircle size={18} /></button>
                                            )}

                                            {['APPROVED', 'SUSPENDED'].includes(tutor.status) && (
                                                <button title="Remove" onClick={() => handleStatus(tutor._id, 'REMOVED')} style={{ background: '#F1F5F9', color: '#64748B', border: 'none', padding: 8, borderRadius: 8, cursor: 'pointer' }}><Trash2 size={18} /></button>
                                            )}

                                            <button title={tutor.isVerified ? "Revoke Verification" : "Verify Badge"} onClick={() => handleVerify(tutor._id)} style={{ background: tutor.isVerified ? '#FEF2F2' : '#EFF6FF', color: tutor.isVerified ? '#E11D48' : '#2563EB', border: 'none', padding: 8, borderRadius: 8, cursor: 'pointer', marginLeft: 8 }}>
                                                <ShieldCheck size={18} />
                                            </button>
                                            <button title={tutor.trustedTutor ? "Revoke Trust Badge" : "Grant Trust Badge"} onClick={() => handleTrust(tutor._id)} style={{ background: tutor.trustedTutor ? '#FEF3C7' : '#F8FAFC', color: tutor.trustedTutor ? '#D97706' : '#94A3B8', border: 'none', padding: 8, borderRadius: 8, cursor: 'pointer', marginLeft: 8 }}>
                                                ⭐
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {tutors.length === 0 && !loading && (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
                                    No tutors found matching your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalItems > 0 && (
                <div style={{ padding: 20, borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
                    <div style={{ fontSize: 14, color: '#64748B' }}>
                        Showing {((page - 1) * 15) + 1} to {Math.min(page * 15, totalItems)} of {totalItems} tutors
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #CBD5E1', background: '#fff', color: '#475569', cursor: page === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, opacity: page === 1 ? 0.5 : 1 }}>
                            <ChevronLeft size={16} /> Prev
                        </button>
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #CBD5E1', background: '#fff', color: '#475569', cursor: page >= totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, opacity: page >= totalPages ? 0.5 : 1 }}>
                            Next <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
