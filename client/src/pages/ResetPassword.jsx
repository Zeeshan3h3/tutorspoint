import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Lock, Eye, EyeOff, CheckCircle, ShieldCheck } from 'lucide-react';

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }
        if (password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        setLoading(true);
        try {
            await api.post(`/auth/reset-password/${token}`, { password });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired reset token');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', padding: 24 }}>
            <div className="card" style={{ width: '100%', maxWidth: 440, padding: 40, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: 'linear-gradient(90deg, #10B981, #059669)' }} />

                {success ? (
                    <div style={{ textAlign: 'center', animation: 'fadeInUp 0.5s ease' }}>
                        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <CheckCircle size={32} color="#10B981" />
                        </div>
                        <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 24, color: '#0F172A', marginBottom: 12 }}>Password Reset!</h2>
                        <p style={{ color: '#64748B', fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
                            Your password has been successfully updated. You can now use your new password to log in.
                        </p>
                        <p style={{ fontSize: 13, color: '#94A3B8' }}>Redirecting to login...</p>
                    </div>
                ) : (
                    <div>
                        <div style={{ width: 56, height: 56, borderRadius: 16, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                            <ShieldCheck size={28} color="#10B981" />
                        </div>
                        <h1 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 26, color: '#0F172A', marginBottom: 8 }}>Set new password</h1>
                        <p style={{ color: '#64748B', fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>Must be at least 6 characters long.</p>

                        {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 16px', marginBottom: 24, color: '#DC2626', fontSize: 14 }}>{error}</div>}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>New Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                    <input type={showPass ? 'text' : 'password'} className="input-field" style={{ paddingLeft: 46, paddingRight: 46 }}
                                        placeholder="Min 6 characters" value={password}
                                        onChange={e => setPassword(e.target.value)} required />
                                    <button type="button" onClick={() => setShowPass(!showPass)} style={{
                                        position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                                        background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8'
                                    }}>
                                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>Confirm Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                    <input type={showPass ? 'text' : 'password'} className="input-field" style={{ paddingLeft: 46, paddingRight: 46 }}
                                        placeholder="Confirm new password" value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)} required />
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: 15, background: 'linear-gradient(135deg, #10B981, #059669)', boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }}>
                                {loading ? 'Resetting...' : 'Reset password'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
