import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle, Clock, Users, FileText, TrendingUp } from 'lucide-react';

function StatCard({ icon: Icon, label, value, color, bg }) {
    return (
        <div style={{ background: '#fff', borderRadius: 16, padding: '24px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={24} color={color} />
            </div>
            <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', fontFamily: 'Poppins' }}>{value}</div>
                <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>{label}</div>
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [pendingTutors, setPendingTutors] = useState([]);
    const [requirements, setRequirements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('pending');

    useEffect(() => {
        if (!user || user.role !== 'admin') { navigate('/'); return; }
        Promise.all([api.get('/admin/tutors/pending'), api.get('/requirement')])
            .then(([t, r]) => { setPendingTutors(t.data); setRequirements(r.data); })
            .finally(() => setLoading(false));
    }, [user]);

    const approveTutor = async (id) => {
        await api.put(`/admin/tutor/approve/${id}`);
        setPendingTutors(prev => prev.filter(t => t._id !== id));
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid #E2E8F0', borderTopColor: '#2563EB', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                <p style={{ color: '#64748B' }}>Loading dashboard...</p>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: 80 }}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg,#1E40AF,#4F46E5)', padding: '40px 24px' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <h1 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 28, color: '#fff', marginBottom: 6 }}>Admin Dashboard</h1>
                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14 }}>Manage tutors, requirements, and platform operations</p>
                </div>
            </div>

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 36 }}>
                    <StatCard icon={Clock} label="Pending Approvals" value={pendingTutors.length} color="#F59E0B" bg="#FFFBEB" />
                    <StatCard icon={FileText} label="Open Requirements" value={requirements.length} color="#2563EB" bg="#EFF6FF" />
                    <StatCard icon={TrendingUp} label="Platform Status" value="Active" color="#10B981" bg="#ECFDF5" />
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: '#F1F5F9', borderRadius: 12, padding: 4, width: 'fit-content' }}>
                    {[['pending', `⏳ Pending (${pendingTutors.length})`], ['requirements', `📋 Requirements (${requirements.length})`]].map(([key, label]) => (
                        <button key={key} onClick={() => setTab(key)} style={{
                            padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                            background: tab === key ? '#fff' : 'transparent',
                            color: tab === key ? '#2563EB' : '#64748B',
                            boxShadow: tab === key ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                            transition: 'all 0.2s'
                        }}>{label}</button>
                    ))}
                </div>

                {/* Pending Tutors */}
                {tab === 'pending' && (
                    <>
                        {pendingTutors.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: 20, border: '1px dashed #CBD5E1' }}>
                                <CheckCircle size={48} color="#10B981" style={{ margin: '0 auto 16px' }} />
                                <h3 style={{ fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>All caught up!</h3>
                                <p style={{ color: '#64748B' }}>No pending tutor approvals at the moment.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {pendingTutors.map(t => (
                                    <div key={t._id} style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#2563EB,#4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18 }}>
                                                {t.userId?.name?.[0] || 'T'}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: 16, color: '#0F172A' }}>{t.userId?.name}</div>
                                                <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>
                                                    {t.subjects?.join(', ')} · {t.area} · {t.pricing}
                                                </div>
                                                <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>📞 {t.userId?.phone}</div>
                                            </div>
                                        </div>
                                        <button onClick={() => approveTutor(t._id)} className="btn-primary" style={{ padding: '10px 20px', fontSize: 14 }}>
                                            <CheckCircle size={16} /> Approve
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Requirements */}
                {tab === 'requirements' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                        {requirements.length === 0 ? (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', background: '#fff', borderRadius: 20, border: '1px dashed #CBD5E1' }}>
                                <p style={{ color: '#64748B' }}>No requirements posted yet.</p>
                            </div>
                        ) : requirements.map(r => (
                            <div key={r._id} style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #E2E8F0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 15, color: '#0F172A' }}>{r.subject} — {r.studentClass}</div>
                                        <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>{r.location} · {r.timing}</div>
                                    </div>
                                    <span className="badge badge-blue">{r.budget}</span>
                                </div>
                                {r.notes && <p style={{ fontSize: 13, color: '#64748B', marginBottom: 12, fontStyle: 'italic' }}>"{r.notes}"</p>}
                                <a href={`tel:${r.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: '#2563EB', textDecoration: 'none' }}>
                                    📞 {r.phone}
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
