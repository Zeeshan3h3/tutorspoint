import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, Home } from 'lucide-react';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login, user } = useAuth();
    const navigate = useNavigate();

    // If already validated as admin, kick straight to dashboard
    useEffect(() => {
        if (user && user.role === 'admin') {
            navigate('/admin');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await login(email, password);
        if (!res.success) {
            setError(res.message);
        } else if (res.success && user?.role !== 'admin') {
            // In case a normal user tries to login here
            setError('This portal is restricted to administrators only.');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A', padding: 24 }}>
            <div style={{ width: '100%', maxWidth: 440, background: '#fff', borderRadius: 24, padding: 40, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{ width: 64, height: 64, background: '#EFF6FF', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                        <Shield size={32} color="#2563EB" />
                    </div>
                    <h1 style={{ fontFamily: 'Poppins', fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>System Access</h1>
                    <p style={{ color: '#64748B', fontSize: 15 }}>Restricted administrative portal.</p>
                </div>

                {error && (
                    <div style={{ background: '#FEF2F2', borderLeft: '4px solid #EF4444', padding: '12px 16px', borderRadius: 8, marginBottom: 24, color: '#9F1239', fontSize: 14 }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                        <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 8 }}>Admin Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} color="#94A3B8" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
                            <input type="email" required style={{ width: '100%', padding: '12px 16px 12px 44px', borderRadius: 10, border: '1px solid #CBD5E1', outline: 'none', fontSize: 15 }} placeholder="admin@domain.com" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 8 }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
                            <input type="password" required style={{ width: '100%', padding: '12px 16px 12px 44px', borderRadius: 10, border: '1px solid #CBD5E1', outline: 'none', fontSize: 15 }} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '14px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 }}>
                        Authenticate <ArrowRight size={18} />
                    </button>
                </form>

                <div style={{ marginTop: 32, textAlign: 'center' }}>
                    <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#64748B', display: 'flex', alignItems: 'center', gap: 6, margin: '0 auto', fontSize: 14, cursor: 'pointer', fontWeight: 500 }}>
                        <Home size={16} /> Return to Main Site
                    </button>
                </div>
            </div>
        </div>
    );
}
