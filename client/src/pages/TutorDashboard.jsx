import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { User, Activity, AlertCircle, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react';

export default function TutorDashboard() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/tutor/me/profile')
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
                    {profile && profile.isApproved && (
                        <Link to={`/tutors/${profile._id}`} className="btn-outline">
                            <ExternalLink size={16} /> View Public Profile
                        </Link>
                    )}
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
                                <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6 }}>
                                    Your profile is currently under review by our admin team. Once approved, it will be visible to students in the marketplace.
                                </p>
                            )}
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
