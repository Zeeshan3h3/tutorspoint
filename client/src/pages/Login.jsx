import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, GraduationCap, AlertCircle } from 'lucide-react';

export default function Login() {
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Check if there is a message or redirect param
    const message = searchParams.get('message');
    const redirect = searchParams.get('redirect') || '/tutors';

    const [form, setForm] = useState({ email: '', password: '', role: 'student' });
    const [error, setError] = useState('');
    const [showPass, setShowPass] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(form.email, form.password);
        if (result.success) {
            navigate(redirect);
        } else {
            setError(result.message);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            {/* Left — Brand Panel */}
            <div style={{
                background: 'linear-gradient(135deg, #1E40AF 0%, #4F46E5 50%, #7C3AED 100%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: 48, color: '#fff', position: 'relative', overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: '10%', right: '10%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                <div style={{ position: 'relative', textAlign: 'center', maxWidth: 380 }}>
                    <div style={{ fontSize: 64, marginBottom: 24 }}>🎓</div>
                    <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 32, marginBottom: 16, lineHeight: 1.2 }}>
                        Start Your Journey with Trusted Tutors
                    </h2>
                    <p style={{ fontSize: 16, opacity: 0.85, lineHeight: 1.7, marginBottom: 40 }}>
                        Join thousands of families in Kolkata who found the perfect home tutor through TutorsPoint.
                    </p>
                    {['500+ Happy Families', '100+ Verified Tutors', 'Zero Commission', '2hr Avg Response'].map(item => (
                        <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, justifyContent: 'center' }}>
                            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>✓</div>
                            <span style={{ fontSize: 15, opacity: 0.9 }}>{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right — Form */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, background: '#F8FAFC' }}>
                <div style={{ width: '100%', maxWidth: 400 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 36 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#2563EB,#4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <GraduationCap size={20} color="#fff" />
                        </div>
                        <span style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 18, color: '#0F172A' }}>TutorsPoint</span>
                    </div>

                    <h1 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 28, color: '#0F172A', marginBottom: 6 }}>Welcome back</h1>
                    <p style={{ color: '#64748B', fontSize: 14, marginBottom: 24 }}>Sign in to your account to continue</p>

                    {/* Information Banner */}
                    {message && (
                        <div style={{ background: '#FFFBEB', border: '1px solid #FEF3C7', borderRadius: 10, padding: '12px 16px', marginBottom: 24, color: '#D97706', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                            <AlertCircle size={18} /> {message}
                        </div>
                    )}

                    {error && (
                        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#DC2626', fontSize: 14 }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                <input type="email" className="input-field" style={{ paddingLeft: 44 }}
                                    placeholder="you@email.com" value={form.email}
                                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                <input type={showPass ? 'text' : 'password'} className="input-field" style={{ paddingLeft: 44, paddingRight: 44 }}
                                    placeholder="Your password" value={form.password}
                                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
                                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8'
                                }}>
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                                <Link to="/forgot-password" style={{ color: '#2563EB', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Forgot password?</Link>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: 8, padding: '14px', fontSize: 15 }}>
                            {loading ? <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}><span style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /> Signing in...</span> : 'Sign In'}
                        </button>
                    </form>

                    <p style={{ marginTop: 24, textAlign: 'center', fontSize: 14, color: '#64748B' }}>
                        Don't have an account?{' '}
                        <Link to={`/signup${message ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} style={{ color: '#2563EB', fontWeight: 700, textDecoration: 'none' }}>Create one free →</Link>
                    </p>
                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
