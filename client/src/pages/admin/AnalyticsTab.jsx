import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { IndianRupee, Key, MapPin, TrendingUp } from 'lucide-react';

export default function AnalyticsTab() {
    const [revenueData, setRevenueData] = useState({ totalUnlocks: 0, totalRevenue: 0 });
    const [densityData, setDensityData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const [revRes, denRes] = await Promise.all([
                    api.get('/admin/insights/revenue'),
                    api.get('/admin/insights/area-density')
                ]);
                setRevenueData(revRes.data?.data || { totalUnlocks: 0, totalRevenue: 0 });
                setDensityData(denRes.data?.data || []);
            } catch (err) {
                console.error("Failed to fetch analytics", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInsights();
    }, []);

    if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>Loading intelligence...</div>;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 24 }}>
            {/* Revenue Widget */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <div style={{ background: '#EFF6FF', padding: 12, borderRadius: 12 }}>
                        <IndianRupee size={24} color="#2563EB" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#334155', margin: 0 }}>Total Platform Revenue</h2>
                        <p style={{ fontSize: 13, color: '#94A3B8', margin: 0, marginTop: 4 }}>Current pricing model: ₹40 per unlock</p>
                    </div>
                </div>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>
                    ₹{(revenueData.totalRevenue || 0).toLocaleString('en-IN')}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#10B981', fontWeight: 600 }}>
                    <TrendingUp size={16} /> 0% (MVP Baseline)
                </div>
            </div>

            {/* Unlocks Widget */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <div style={{ background: '#FFFBEB', padding: 12, borderRadius: 12 }}>
                        <Key size={24} color="#F59E0B" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#334155', margin: 0 }}>Total Lead Unlocks</h2>
                        <p style={{ fontSize: 13, color: '#94A3B8', margin: 0, marginTop: 4 }}>Across all verified tutors</p>
                    </div>
                </div>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>
                    {revenueData.totalUnlocks || 0}
                </div>
                <div style={{ fontSize: 14, color: '#64748B', fontWeight: 500 }}>
                    Unlocked leads successfully processed
                </div>
            </div>

            {/* Area Density Widget */}
            <div style={{ gridColumn: '1 / -1', background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <div style={{ marginBottom: 24 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
                        <MapPin size={20} color="#6366F1" /> Area Density Heatmap (Active Tutors)
                    </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {densityData.slice(0, 8).map((area, index) => {
                        const maxCount = densityData[0]?.count || 1;
                        const percentage = (area.count / maxCount) * 100;
                        return (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ width: 140, fontSize: 14, fontWeight: 600, color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {area.area}
                                </div>
                                <div style={{ flex: 1, background: '#F1F5F9', height: 12, borderRadius: 6, overflow: 'hidden' }}>
                                    <div style={{ width: `${percentage}%`, height: '100%', background: index === 0 ? '#6366F1' : '#A5B4FC', borderRadius: 6 }}></div>
                                </div>
                                <div style={{ width: 40, textAlign: 'right', fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                                    {area.count}
                                </div>
                            </div>
                        );
                    })}
                    {densityData.length === 0 && <p style={{ color: '#94A3B8', margin: 0 }}>No tutor area data yet.</p>}
                </div>
            </div>
        </div>
    );
}
