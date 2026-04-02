import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Gift, TrendingUp, Award, PlusCircle, MinusCircle } from 'lucide-react';

export default function ReferralsTab() {
    const [referrers, setReferrers] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadReferrals = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/insights/referrals');
            setReferrers(data.data || []);
        } catch (err) {
            console.error("Failed to load referrals", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReferrals();
    }, []);

    const handleAdjustCredits = async (tutorId, actionType, amount) => {
        try {
            await api.patch(`/admin/tutors/${tutorId}/credits`, { actionType, amount });
            loadReferrals();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to adjust credits');
        }
    };

    if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>Loading referral data...</div>;

    const totalCreditsInSystem = referrers.reduce((acc, r) => acc + (r.referralCredits || 0), 0);

    return (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
            {/* Header Widgets */}
            <div style={{ padding: 24, borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 250, background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <div style={{ background: '#EFF6FF', padding: 10, borderRadius: 10 }}><Gift size={20} color="#2563EB" /></div>
                        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#334155' }}>Total Referral Credits Apportioned</h3>
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A' }}>{totalCreditsInSystem} pts</div>
                </div>

                <div style={{ flex: 1, minWidth: 250, background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <div style={{ background: '#ECFDF5', padding: 10, borderRadius: 10 }}><TrendingUp size={20} color="#10B981" /></div>
                        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#334155' }}>Top Referrers</h3>
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A' }}>{referrers.length} active</div>
                </div>
            </div>

            {/* Leaderboard Table */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#F1F5F9', color: '#475569', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>
                            <th style={{ padding: '16px 24px', fontWeight: 700, width: 80 }}>Rank</th>
                            <th style={{ padding: '16px 24px', fontWeight: 700 }}>Tutor Details</th>
                            <th style={{ padding: '16px 24px', fontWeight: 700 }}>Current Balance</th>
                            <th style={{ padding: '16px 24px', fontWeight: 700 }}>Quick Adjust</th>
                        </tr>
                    </thead>
                    <tbody>
                        {referrers.map((tutor, index) => (
                            <tr key={tutor._id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                                <td style={{ padding: '20px 24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, background: index === 0 ? '#FEF3C7' : index === 1 ? '#F1F5F9' : index === 2 ? '#FFEDD5' : '#F8FAFC', color: index === 0 ? '#D97706' : index === 1 ? '#64748B' : index === 2 ? '#C2410C' : '#94A3B8', fontWeight: 800 }}>
                                        #{index + 1}
                                    </div>
                                </td>
                                <td style={{ padding: '20px 24px' }}>
                                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
                                        {tutor.userId?.name || 'Unknown User'}
                                        {tutor.trustedTutor && <Award size={16} color="#D97706" title="Trusted Tutor" />}
                                    </div>
                                    <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>📞 {tutor.userId?.phone || 'No phone'}</div>
                                </td>
                                <td style={{ padding: '20px 24px' }}>
                                    <span style={{ background: '#EFF6FF', color: '#1D4ED8', padding: '6px 12px', borderRadius: 20, fontSize: 14, fontWeight: 800 }}>
                                        {tutor.referralCredits} pts
                                    </span>
                                </td>
                                <td style={{ padding: '20px 24px' }}>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={() => handleAdjustCredits(tutor._id, 'deduct', 50)} title="Deduct 50 points" style={{ background: '#FEF2F2', color: '#E11D48', border: 'none', padding: '6px 10px', borderRadius: 8, cursor: 'pointer', display: 'flex', gap: 4, alignItems: 'center', fontSize: 13, fontWeight: 700 }}>
                                            <MinusCircle size={16} /> 50
                                        </button>
                                        <button onClick={() => handleAdjustCredits(tutor._id, 'add', 50)} title="Add 50 points" style={{ background: '#ECFDF5', color: '#10B981', border: 'none', padding: '6px 10px', borderRadius: 8, cursor: 'pointer', display: 'flex', gap: 4, alignItems: 'center', fontSize: 13, fontWeight: 700 }}>
                                            <PlusCircle size={16} /> 50
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {referrers.length === 0 && !loading && (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
                                    No referral data found. Start a campaign to get tutors sharing your platform!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
