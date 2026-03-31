import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Mail, CheckCircle, ArrowLeft, KeyRound } from 'lucide-react';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [devToken, setDevToken] = useState(''); // Only for local testing

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            const res = await api.post('/auth/forgot-password', { email });
            setSuccess(true);
            if (res.data.resetToken) setDevToken(res.data.resetToken); // Capture token for testing
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', padding: 24 }}>
            <div className="card" style={{ width: '100%', maxWidth: 440, padding: 40, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: 'linear-gradient(90deg, #2563EB, #4F46E5)' }} />

                <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#64748B', fontSize: 14, fontWeight: 600, textDecoration: 'none', marginBottom: 32, transition: 'color 0.2s' }}>
                    <ArrowLeft size={16} /> Back to Login
                </Link>

                {success ? (
                    <div style={{ textAlign: 'center', animation: 'fadeInUp 0.5s ease' }}>
                        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <CheckCircle size={32} color="#10B981" />
                        </div>
                        <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 24, color: '#0F172A', marginBottom: 12 }}>Check your email</h2>
                        <p style={{ color: '#64748B', fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
                            We've sent a password reset link to <strong>{email}</strong>.
                        </p>

                        <p style={{ fontSize: 13, color: '#94A3B8' }}>Didn't receive the email? <button onClick={() => setSuccess(false)} style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: 600, cursor: 'pointer' }}>Try again</button></p>
                    </div>
                ) : (
                    <div>
                        <div style={{ width: 56, height: 56, borderRadius: 16, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                            <KeyRound size={28} color="#2563EB" />
                        </div>
                        <h1 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 26, color: '#0F172A', marginBottom: 8 }}>Forgot password?</h1>
                        <p style={{ color: '#64748B', fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>No worries, we'll send you reset instructions.</p>

                        {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 16px', marginBottom: 24, color: '#DC2626', fontSize: 14 }}>{error}</div>}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                    <input type="email" className="input-field" style={{ paddingLeft: 46 }}
                                        placeholder="Enter your email" value={email}
                                        onChange={e => setEmail(e.target.value)} required />
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: 15 }}>
                                {loading ? 'Sending...' : 'Send reset link'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
