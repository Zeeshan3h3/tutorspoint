import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Lock, Eye, EyeOff, GraduationCap } from 'lucide-react';

export default function Signup() {
    const { signup, loading } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'student' });
    const [error, setError] = useState('');
    const [showPass, setShowPass] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await signup(form);
        if (result.success) navigate(form.role === 'tutor' ? '/become-tutor' : '/tutors');
        else setError(result.message);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            {/* Left */}
            <div style={{
                background: 'linear-gradient(135deg, #064E3B 0%, #059669 50%, #10B981 100%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: 48, color: '#fff', position: 'relative', overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: '8%', right: '8%', width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ position: 'absolute', bottom: '12%', left: '5%', width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                <div style={{ position: 'relative', textAlign: 'center', maxWidth: 380 }}>
                    <div style={{ fontSize: 64, marginBottom: 24 }}>✨</div>
                    <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 30, marginBottom: 16, lineHeight: 1.2 }}>
                        Join Kolkata's Most Trusted Tutor Network
                    </h2>
                    <p style={{ fontSize: 16, opacity: 0.85, lineHeight: 1.7 }}>
                        Whether you're a parent seeking quality education or a tutor looking for students — TutorsPoint connects you both.
                    </p>
                </div>
            </div>

            {/* Right — Form */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px', background: '#F8FAFC', overflowY: 'auto' }}>
                <div style={{ width: '100%', maxWidth: 420 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 36 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#2563EB,#4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <GraduationCap size={20} color="#fff" />
                        </div>
                        <span style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 18, color: '#0F172A' }}>TutorsPoint</span>
                    </div>

                    <h1 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 28, color: '#0F172A', marginBottom: 6 }}>Create your account</h1>
                    <p style={{ color: '#64748B', fontSize: 14, marginBottom: 24 }}>Free forever. No credit card required.</p>

                    {/* Role toggle */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#F1F5F9', borderRadius: 12, padding: 4, marginBottom: 24 }}>
                        {[['student', '👨‍👩‍👧 Parent / Student'], ['tutor', '👨‍🏫 I am a Tutor']].map(([val, label]) => (
                            <button key={val} type="button" onClick={() => setForm(f => ({ ...f, role: val }))} style={{
                                padding: '10px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                                background: form.role === val ? '#fff' : 'transparent',
                                color: form.role === val ? '#2563EB' : '#64748B',
                                boxShadow: form.role === val ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                                transition: 'all 0.2s'
                            }}>{label}</button>
                        ))}
                    </div>

                    {error && (
                        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 16px', marginBottom: 16, color: '#DC2626', fontSize: 14 }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {[
                            { icon: User, name: 'name', placeholder: 'Full name', type: 'text', label: 'Full Name' },
                            { icon: Mail, name: 'email', placeholder: 'your@email.com', type: 'email', label: 'Email Address' },
                            { icon: Phone, name: 'phone', placeholder: '+91 98000 00000', type: 'tel', label: 'Phone Number' },
                        ].map(({ icon: Icon, name, placeholder, type, label }) => (
                            <div key={name}>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>{label}</label>
                                <div style={{ position: 'relative' }}>
                                    <Icon size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                    <input type={type} className="input-field" style={{ paddingLeft: 44 }}
                                        placeholder={placeholder} value={form[name]}
                                        onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))} required />
                                </div>
                            </div>
                        ))}

                        <div>
                            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                <input type={showPass ? 'text' : 'password'} className="input-field" style={{ paddingLeft: 44, paddingRight: 44 }}
                                    placeholder="Min 8 characters" value={form.password}
                                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
                                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8'
                                }}>
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: 8, padding: '14px', fontSize: 15 }}>
                            {loading ? 'Creating account...' : `Create ${form.role === 'tutor' ? 'Tutor' : ''} Account →`}
                        </button>
                    </form>

                    <p style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: '#64748B' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#2563EB', fontWeight: 700, textDecoration: 'none' }}>Sign in →</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
