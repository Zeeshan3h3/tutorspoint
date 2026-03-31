import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createTutorProfile } from '../services/tutorService';
import { CheckCircle, BookOpen, MapPin, IndianRupee, Briefcase, Camera } from 'lucide-react';

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Science', 'History', 'Bengali', 'Hindi', 'Computer Science', 'Geography', 'EVS'];
const AREAS = ['Salt Lake', 'New Town', 'Dum Dum', 'Behala', 'Tollygunge', 'Park Street', 'Howrah', 'Ballygunge', 'Gariahat', 'Barasat', 'Topsia', 'Tiljala', 'Science City', 'Multiple Areas'];

export default function BecomeTutor() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [form, setForm] = useState({ subjects: [], experience: '', pricing: '', area: '', bio: '', profileImage: null });
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm(f => ({ ...f, profileImage: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    if (!user) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
                <p style={{ fontSize: 16, color: '#64748B' }}>Please <a href="/login" style={{ color: '#2563EB', fontWeight: 700 }}>login</a> to continue.</p>
            </div>
        </div>
    );

    if (user.role !== 'tutor') return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>👋</div>
                <p style={{ fontSize: 16, color: '#64748B' }}>This page is only for tutors. <a href="/tutors" style={{ color: '#2563EB', fontWeight: 700 }}>Browse tutors instead →</a></p>
            </div>
        </div>
    );

    if (success) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
            <div style={{ textAlign: 'center', maxWidth: 480 }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#2563EB,#4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 8px 24px rgba(37,99,235,0.3)' }}>
                    <CheckCircle size={40} color="#fff" />
                </div>
                <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 28, color: '#0F172A', marginBottom: 12 }}>Profile Submitted!</h2>
                <p style={{ color: '#64748B', fontSize: 16, lineHeight: 1.7 }}>
                    Your tutor profile is under review. Our team will verify and approve it within <strong>24 hours</strong>. You'll start receiving student enquiries soon!
                </p>
            </div>
        </div>
    );

    const toggleSubject = (s) => setForm(f => ({
        ...f, subjects: f.subjects.includes(s) ? f.subjects.filter(x => x !== s) : [...f.subjects, s]
    }));

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); setLoading(true);
        try {
            const formData = new FormData();
            formData.append('experience', form.experience);
            formData.append('pricing', form.pricing);
            formData.append('area', form.area);
            formData.append('bio', form.bio);
            formData.append('subjects', JSON.stringify(form.subjects));
            if (form.profileImage) {
                formData.append('profileImage', form.profileImage);
            }
            await createTutorProfile(formData);
            setSuccess(true);
        }
        catch (err) { setError(err.response?.data?.message || 'Failed to create profile'); }
        finally { setLoading(false); }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', padding: '100px 24px 60px' }}>
            <div style={{ maxWidth: 720, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div className="section-label">Become a Tutor</div>
                    <h1 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 32, color: '#0F172A', marginBottom: 8 }}>Set Up Your Tutor Profile</h1>
                    <p style={{ color: '#64748B', fontSize: 15 }}>Your profile will be reviewed and published within 24 hours. Start getting students today.</p>
                </div>

                <form onSubmit={handleSubmit}>

                    {/* Profile Photo */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
                        <div
                            onClick={() => fileInputRef.current.click()}
                            style={{
                                width: 110, height: 110, borderRadius: '50%', background: preview ? `url(${preview}) center/cover` : '#EFF6FF',
                                border: '2px dashed #2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 12px rgba(37,99,235,0.1)',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => { if (!preview) e.currentTarget.style.background = '#DBEAFE' }}
                            onMouseLeave={e => { if (!preview) e.currentTarget.style.background = '#EFF6FF' }}
                        >
                            {!preview && <Camera size={32} color="#2563EB" />}
                            {preview && (
                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                                    onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                                    <Camera color="#fff" size={24} />
                                </div>
                            )}
                        </div>
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
                        <p style={{ marginTop: 12, fontSize: 14, color: '#64748B', fontWeight: 600 }}>Upload Profile Photo</p>
                    </div>

                    <div className="glass" style={{ borderRadius: 24, padding: 36, marginBottom: 20, boxShadow: '0 4px 24px rgba(37,99,235,0.07)' }}>
                        <h3 style={{ fontWeight: 700, fontSize: 16, color: '#0F172A', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <BookOpen size={18} color="#2563EB" /> Subjects You Teach
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                            {SUBJECTS.map(s => (
                                <button key={s} type="button" onClick={() => toggleSubject(s)} style={{
                                    padding: '9px 18px', borderRadius: 999, border: '1.5px solid', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                                    borderColor: form.subjects.includes(s) ? '#2563EB' : '#E2E8F0',
                                    background: form.subjects.includes(s) ? 'linear-gradient(135deg,#2563EB,#4F46E5)' : '#fff',
                                    color: form.subjects.includes(s) ? '#fff' : '#374151',
                                    boxShadow: form.subjects.includes(s) ? '0 4px 12px rgba(37,99,235,0.25)' : 'none',
                                }}>{s}</button>
                            ))}
                        </div>
                    </div>

                    <div className="glass" style={{ borderRadius: 24, padding: 36, marginBottom: 20, boxShadow: '0 4px 24px rgba(37,99,235,0.07)' }}>
                        <h3 style={{ fontWeight: 700, fontSize: 16, color: '#0F172A', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Briefcase size={18} color="#4F46E5" /> Your Experience & Fees
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>Years of Experience</label>
                                <select className="input-field" value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} required>
                                    <option value="">Select experience</option>
                                    {['Less than 1 year', '1-2 years', '2-5 years', '5-10 years', '10+ years'].map(x => <option key={x}>{x}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>Monthly Fees</label>
                                <select className="input-field" value={form.pricing} onChange={e => setForm(f => ({ ...f, pricing: e.target.value }))} required>
                                    <option value="">Select fee range</option>
                                    {['₹500-1000/month', '₹1000-1500/month', '₹1500-2000/month', '₹2000-3000/month', '₹3000-5000/month', '₹5000+/month'].map(x => <option key={x}>{x}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="glass" style={{ borderRadius: 24, padding: 36, marginBottom: 20, boxShadow: '0 4px 24px rgba(37,99,235,0.07)' }}>
                        <h3 style={{ fontWeight: 700, fontSize: 16, color: '#0F172A', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <MapPin size={18} color="#10B981" /> Location & Bio
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>Area You Can Teach</label>
                                <select className="input-field" value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} required>
                                    <option value="">Select your area</option>
                                    {AREAS.map(a => <option key={a}>{a}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>About You (Bio)</label>
                                <textarea className="input-field" rows={4} placeholder="Tell parents and students about your teaching style, qualifications, and what makes you a great tutor..."
                                    value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
                            </div>
                        </div>
                    </div>

                    {error && <div style={{ color: '#DC2626', background: '#FEF2F2', padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontSize: 14 }}>{error}</div>}

                    <button type="submit" disabled={loading || form.subjects.length === 0} className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: 16 }}>
                        {loading ? 'Submitting...' : '🚀 Submit Profile for Review'}
                    </button>
                </form>
            </div>
        </div>
    );
}
