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
    const [form, setForm] = useState({
        subjects: [],
        experience: '',
        expectedFeesMin: '',
        expectedFeesMax: '',
        isNegotiable: true,
        area: '',
        bio: '',
        college: '',
        degree: '',
        graduationYear: '',
        gender: '',
        teachingMode: 'Home Tuition',
        profileImage: null
    });
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
                <div style={{ marginTop: 32 }}>
                    <a href="/tutor-dashboard" className="btn-primary">Go to Dashboard</a>
                </div>
            </div>
        </div>
    );

    const toggleSubject = (s) => setForm(f => ({
        ...f, subjects: f.subjects.includes(s) ? f.subjects.filter(x => x !== s) : [...f.subjects, s]
    }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (form.subjects.length === 0) {
            setError('Please select at least one subject');
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            // Data fields
            formData.append('gender', form.gender);
            formData.append('college', form.college);
            formData.append('degree', form.degree);
            formData.append('graduationYear', form.graduationYear);
            formData.append('area', form.area);
            formData.append('teachingMode', form.teachingMode);
            formData.append('experience', form.experience);
            formData.append('expectedFeesMin', form.expectedFeesMin);
            formData.append('expectedFeesMax', form.expectedFeesMax);
            formData.append('isNegotiable', form.isNegotiable);
            formData.append('bio', form.bio);
            formData.append('subjects', JSON.stringify(form.subjects));

            if (!form.profileImage) {
                setError('Profile photo is required');
                setLoading(false);
                return;
            }
            formData.append('profileImage', form.profileImage);

            await createTutorProfile(formData);
            setSuccess(true);
        }
        catch (err) {
            setError(err.response?.data?.message || 'Failed to create profile');
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', padding: '100px 24px 60px' }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div className="section-label">Tutor Onboarding</div>
                    <h1 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 32, color: '#0F172A', marginBottom: 8 }}>Setup Your Profile</h1>
                    <p style={{ color: '#64748B', fontSize: 15 }}>Approved tutors get access to high-quality student leads.</p>
                </div>

                <form onSubmit={handleSubmit}>

                    {/* Profile Photo */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
                        <div
                            onClick={() => fileInputRef.current.click()}
                            style={{
                                width: 120, height: 120, borderRadius: '50%', background: preview ? `url(${preview}) center/cover` : '#EFF6FF',
                                border: '2px dashed #2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 12px rgba(37,99,235,0.1)',
                                transition: 'all 0.2s'
                            }}
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
                        <p style={{ marginTop: 12, fontSize: 14, color: '#64748B', fontWeight: 600 }}>Professional Portrait Required</p>
                    </div>

                    {/* Basic & Academic */}
                    <div className="glass" style={{ borderRadius: 24, padding: 32, marginBottom: 24, boxShadow: '0 4px 24px rgba(37,99,235,0.07)' }}>
                        <h3 style={{ fontWeight: 700, fontSize: 16, color: '#0F172A', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <BookOpen size={18} color="#2563EB" /> Identity & Academic
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                            <div>
                                <label style={{ fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Gender</label>
                                <select className="input-field" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))} required>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>College Name</label>
                                <input type="text" className="input-field" placeholder="e.g. JU, CU, SXC" value={form.college} onChange={e => setForm(f => ({ ...f, college: e.target.value }))} required />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div>
                                <label style={{ fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Degree / Course</label>
                                <input type="text" className="input-field" placeholder="e.g. B.Sc Physics" value={form.degree} onChange={e => setForm(f => ({ ...f, degree: e.target.value }))} required />
                            </div>
                            <div>
                                <label style={{ fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Graduation Year</label>
                                <input type="text" className="input-field" placeholder="e.g. 2024" value={form.graduationYear} onChange={e => setForm(f => ({ ...f, graduationYear: e.target.value }))} required />
                            </div>
                        </div>
                    </div>

                    {/* Subjects */}
                    <div className="glass" style={{ borderRadius: 24, padding: 32, marginBottom: 24, boxShadow: '0 4px 24px rgba(37,99,235,0.07)' }}>
                        <h3 style={{ fontWeight: 700, fontSize: 16, color: '#0F172A', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <CheckCircle size={18} color="#10B981" /> Subjects You Specialize In
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                            {SUBJECTS.map(s => (
                                <button key={s} type="button" onClick={() => toggleSubject(s)} style={{
                                    padding: '8px 16px', borderRadius: 999, border: '1.5px solid', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                                    borderColor: form.subjects.includes(s) ? '#2563EB' : '#E2E8F0',
                                    background: form.subjects.includes(s) ? '#EFF6FF' : '#fff',
                                    color: form.subjects.includes(s) ? '#2563EB' : '#64748B',
                                }}>{s}</button>
                            ))}
                        </div>
                    </div>

                    {/* Preferences & Bio */}
                    <div className="glass" style={{ borderRadius: 24, padding: 32, marginBottom: 24, boxShadow: '0 4px 24px rgba(37,99,235,0.07)' }}>
                        <h3 style={{ fontWeight: 700, fontSize: 16, color: '#0F172A', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Briefcase size={18} color="#F59E0B" /> Teaching Preferences
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                            <div>
                                <label style={{ fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Primary Area</label>
                                <select className="input-field" value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} required>
                                    <option value="">Select Area</option>
                                    {AREAS.map(a => <option key={a}>{a}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Teaching Mode</label>
                                <select className="input-field" value={form.teachingMode} onChange={e => setForm(f => ({ ...f, teachingMode: e.target.value }))}>
                                    <option value="Home Tuition">Home Tuition</option>
                                    <option value="Online">Online</option>
                                    <option value="Both">Both</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                            <div>
                                <label style={{ fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Experience (Years)</label>
                                <input type="number" className="input-field" placeholder="e.g. 2" value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} required />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Min Fee (₹)</label>
                                    <input type="number" className="input-field" placeholder="2000" value={form.expectedFeesMin} onChange={e => setForm(f => ({ ...f, expectedFeesMin: e.target.value }))} required />
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Max Fee (₹)</label>
                                    <input type="number" className="input-field" placeholder="5000" value={form.expectedFeesMax} onChange={e => setForm(f => ({ ...f, expectedFeesMax: e.target.value }))} required />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Your Bio / Intro</label>
                            <textarea className="input-field" rows={4} placeholder="Describe your teaching style and why parents should hire you..."
                                value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} maxLength={500} required />
                        </div>
                    </div>

                    {error && <div style={{ color: '#DC2626', background: '#FEF2F2', padding: '16px', borderRadius: 12, marginBottom: 24, fontSize: 14, display: 'flex', gap: 8, border: '1px solid #FECACA' }}>⚠️ {error}</div>}

                    <button type="submit" disabled={loading || form.subjects.length === 0 || !form.profileImage || !form.college.trim()} className="btn-primary" style={{ width: '100%', padding: '18px', fontSize: 16, borderRadius: 16, boxShadow: '0 10px 20px rgba(37,99,235,0.2)' }}>
                        {loading ? 'Processing...' : '🚀 Submit Profile for Review'}
                    </button>
                    <p style={{ textAlign: 'center', marginTop: 16, color: '#64748B', fontSize: 13 }}>By submitting, you agree to our <a href="/terms" style={{ color: '#2563EB' }}>Terms of Service</a>.</p>
                </form>
            </div>
        </div>
    );
}
