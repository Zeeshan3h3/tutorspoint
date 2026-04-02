import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { User, Activity, AlertCircle, CheckCircle, ExternalLink, RefreshCw, ShieldAlert, FileText, Video } from 'lucide-react';

export default function TutorDashboard() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/tutor/profile/me')
            .then(res => setProfile(res.data))
            .catch(() => setProfile(null))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>Loading...</div>;
    }

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', padding: '100px 24px 60px' }}>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
                    <div>
                        <h1 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 32, color: '#0F172A', marginBottom: 8 }}>Hello, {user?.name}!</h1>
                        <p style={{ color: '#64748B', fontSize: 15 }}>Welcome to your Tutor Dashboard.</p>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <Link to="/tutor-dashboard/profile/edit" className="btn-primary" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FileText size={16} /> Edit Profile
                        </Link>
                        {profile && profile.isApproved && (
                            <Link to={`/tutors/${profile._id}`} className="btn-outline">
                                <ExternalLink size={16} /> View Public Profile
                            </Link>
                        )}
                    </div>
                </div>

                {!profile ? (
                    <div className="glass" style={{ padding: 48, textAlign: 'center', borderRadius: 24 }}>
                        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                            <User size={40} color="#2563EB" />
                        </div>
                        <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 24, color: '#0F172A', marginBottom: 12 }}>Complete Your Profile</h2>
                        <p style={{ color: '#64748B', fontSize: 15, marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
                            You haven't set up your tutor profile yet. Complete your profile to start receiving tutoring requests from students.
                        </p>
                        <Link to="/become-tutor" className="btn-primary" style={{ fontSize: 16, padding: '16px 32px' }}>
                            Setup Profile Now →
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                        <div className="glass" style={{ padding: 32, borderRadius: 24 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                                <div style={{ width: 56, height: 56, borderRadius: 16, background: profile.isApproved ? '#ECFDF5' : '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {profile.isApproved ? <CheckCircle size={28} color="#10B981" /> : <RefreshCw size={28} color="#F59E0B" />}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: 15, fontWeight: 600, color: '#64748B', marginBottom: 4 }}>Profile Status</h3>
                                    <div style={{ fontSize: 20, fontWeight: 800, color: profile.isApproved ? '#10B981' : '#F59E0B' }}>
                                        {profile.isApproved ? 'Approved & Visible' : 'Pending Review'}
                                    </div>
                                </div>
                            </div>
                            {!profile.isApproved && (
                                <div style={{ background: '#FEF2F2', padding: 20, borderRadius: 16, marginTop: 16 }}>
                                    <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                                        <ShieldAlert size={20} color="#E11D48" style={{ flexShrink: 0 }} />
                                        <div>
                                            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#9F1239', marginBottom: 4 }}>Your Profile is Under Review</h4>
                                            <p style={{ fontSize: 13, color: '#BE123C', lineHeight: 1.5 }}>
                                                You cannot contact parents or apply to jobs until an Admin approves your profile.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Trust Signals & Completeness */}
                            <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #E2E8F0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                    <span style={{ fontSize: 14, fontWeight: 700, color: '#334155' }}>Profile Strength</span>
                                    <span style={{ fontSize: 14, fontWeight: 800, color: profile.completenessScore >= 80 ? '#10B981' : '#F59E0B' }}>
                                        {profile.completenessScore || 50}%
                                    </span>
                                </div>
                                <div style={{ height: 8, background: '#E2E8F0', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
                                    <div style={{ height: '100%', width: `${profile.completenessScore || 50}%`, background: profile.completenessScore >= 80 ? '#10B981' : '#F59E0B', transition: 'width 0.5s ease-out' }} />
                                </div>

                                {profile.completenessScore < 100 && (
                                    <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 12 }}>
                                        <p style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 12 }}>Boost your profile to get more students and faster approval:</p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            {!profile.idProofUrl && (
                                                <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, padding: '8px 12px' }}>
                                                    <FileText size={16} /> Upload ID / Student Proof (+25%)
                                                </button>
                                            )}
                                            {!profile.introVideoUrl && (
                                                <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, padding: '8px 12px' }}>
                                                    <Video size={16} /> Add Intro Video (+25%)
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="glass" style={{ padding: 32, borderRadius: 24 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                                <div style={{ width: 56, height: 56, borderRadius: 16, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Activity size={28} color="#2563EB" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: 15, fontWeight: 600, color: '#64748B', marginBottom: 4 }}>Account Type</h3>
                                    <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>
                                        Registered Tutor
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
