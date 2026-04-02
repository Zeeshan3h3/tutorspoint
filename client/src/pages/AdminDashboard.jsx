import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Home, Users, FileText, BarChart3, Share2 } from 'lucide-react';
import TutorsTab from './admin/TutorsTab';
import RequirementsTab from './admin/RequirementsTab';
import AnalyticsTab from './admin/AnalyticsTab';
import ReferralsTab from './admin/ReferralsTab';

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('tutors');

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/admin-login');
        }
    }, [user, navigate]);

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingBottom: 60 }}>
            {/* Admin Navbar */}
            <div style={{ background: '#fff', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 50 }}>
                <div style={{ fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 10, fontSize: 18 }}>
                    <div style={{ padding: '4px 8px', background: '#0F172A', color: '#fff', borderRadius: 6, fontSize: 12, letterSpacing: 1 }}>ADMIN</div>
                    TutorsPoint
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F1F5F9', color: '#475569', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
                        <Home size={16} /> Main Site
                    </button>
                    <button onClick={() => { logout(); navigate('/login'); }} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FEF2F2', color: '#DC2626', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </div>

            {/* Header */}
            <div style={{ background: '#0F172A', padding: '40px 24px', marginBottom: -20 }}>
                <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                    <h1 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 28, color: '#fff', marginBottom: 6 }}>Command Center</h1>
                    <p style={{ color: '#94A3B8', fontSize: 15 }}>Manage quality, moderate requirements, and monitor platform growth.</p>
                </div>
            </div>

            <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
                {/* Tabs */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid #E2E8F0', paddingBottom: 16 }}>
                    <button onClick={() => setActiveTab('tutors')} className={`tab-btn ${activeTab === 'tutors' ? 'active' : ''}`} style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: activeTab === 'tutors' ? '#2563EB' : 'transparent', color: activeTab === 'tutors' ? '#fff' : '#64748B', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Users size={18} /> Tutor Fleet
                    </button>
                    <button onClick={() => setActiveTab('requirements')} className={`tab-btn ${activeTab === 'requirements' ? 'active' : ''}`} style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: activeTab === 'requirements' ? '#2563EB' : 'transparent', color: activeTab === 'requirements' ? '#fff' : '#64748B', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FileText size={18} /> Requirements
                    </button>
                    <button onClick={() => setActiveTab('analytics')} className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`} style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: activeTab === 'analytics' ? '#2563EB' : 'transparent', color: activeTab === 'analytics' ? '#fff' : '#64748B', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <BarChart3 size={18} /> Intelligence
                    </button>
                    <button onClick={() => setActiveTab('referrals')} className={`tab-btn ${activeTab === 'referrals' ? 'active' : ''}`} style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: activeTab === 'referrals' ? '#2563EB' : 'transparent', color: activeTab === 'referrals' ? '#fff' : '#64748B', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Share2 size={18} /> Growth
                    </button>
                </div>

                {/* Content */}
                <div>
                    {activeTab === 'tutors' && <TutorsTab />}
                    {activeTab === 'requirements' && <RequirementsTab />}
                    {activeTab === 'analytics' && <AnalyticsTab />}
                    {activeTab === 'referrals' && <ReferralsTab />}
                </div>
            </div>
        </div>
    );
}
