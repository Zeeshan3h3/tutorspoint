import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
    User, BookOpen, MapPin, Briefcase, IndianRupee, ShieldCheck,
    Save, Loader2, AlertCircle, CheckCircle2, ChevronLeft, Video, Target
} from 'lucide-react';

const SUBJECTS_LIST = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Science', 'History', 'Bengali', 'Hindi', 'Computer Science', 'Geography'];
const CLASSES_LIST = ['Class 1-5', 'Class 6-8', 'Class 9-10', 'Class 11-12', 'JEE/NEET', 'College/Degree', 'Other'];
const AREAS_LIST = ['Salt Lake', 'New Town', 'Dum Dum', 'Behala', 'Tollygunge', 'Park Street', 'Howrah', 'Ballygunge', 'Gariahat', 'Barasat', 'Topsia', 'Tiljala', 'Science City', 'Other'];

export default function EditProfile() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({});

    // To check if critical fields are locked
    const [criticalLocked, setCriticalLocked] = useState(false);

    useEffect(() => {
        if (!user || user.role !== 'tutor') {
            navigate('/');
            return;
        }
        fetchProfile();
    }, [user]);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get('/tutor/profile/me');
            setProfile(data);
            setFormData({
                gender: data.gender || '',
                college: data.college || '',
                degree: data.degree || '',
                graduationYear: data.graduationYear || '',
                area: data.area || '',
                teachingRadius: data.teachingRadius || 5,
                teachingMode: data.teachingMode || 'Any',
                subjects: data.subjects || [],
                classesHandled: data.classesHandled || [],
                experience: data.experience || '',
                teachingStyle: data.teachingStyle || '',
                expectedFeesMin: data.expectedFeesMin || '',
                expectedFeesMax: data.expectedFeesMax || '',
                isNegotiable: data.isNegotiable !== undefined ? data.isNegotiable : true,
                bio: data.bio || '',
                whyChooseMe: data.whyChooseMe || '',
                introVideoUrl: data.introVideoUrl || ''
            });

            // Check 10-day lock for critical fields
            const tenDays = 10 * 24 * 60 * 60 * 1000;
            if (Date.now() - new Date(data.createdAt).getTime() < tenDays) {
                setCriticalLocked(true);
            }

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
        setSuccessMsg('');
    };

    const toggleArrayItem = (field, item) => {
        setFormData(prev => {
            const arr = prev[field] || [];
            if (arr.includes(item)) {
                return { ...prev, [field]: arr.filter(x => x !== item) };
            } else {
                return { ...prev, [field]: [...arr, item] };
            }
        });
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        setSuccessMsg('');

        try {
            const payload = { ...formData };
            // Ensure numbers
            if (payload.expectedFeesMin) payload.expectedFeesMin = Number(payload.expectedFeesMin);
            if (payload.expectedFeesMax) payload.expectedFeesMax = Number(payload.expectedFeesMax);
            if (payload.experience) payload.experience = Number(payload.experience);
            if (payload.teachingRadius) payload.teachingRadius = Number(payload.teachingRadius);

            const { data } = await api.patch('/tutor/profile', payload);

            setSuccessMsg(data.message || 'Profile updated successfully!');
            setProfile(data.data); // update local state with new completeness score

            // Scroll to top to show message
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save changes');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
    }

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', padding: '80px 24px 60px' }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>

                {/* Header & Back Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                    <button onClick={() => navigate('/tutor-dashboard')} style={{ background: '#fff', border: '1px solid #E2E8F0', padding: 10, borderRadius: 12, cursor: 'pointer' }}>
                        <ChevronLeft size={20} color="#475569" />
                    </button>
                    <div>
                        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: 0 }}>Edit Profile</h1>
                        <p style={{ color: '#64748B', fontSize: 14, margin: '4px 0 0' }}>Enhance your profile to attract more students</p>
                    </div>
                </div>

                {/* Completeness & Warning Banners */}
                {profile?.status === 'PENDING' && (
                    <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: 16, borderRadius: 12, marginBottom: 24, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <AlertCircle size={20} color="#D97706" style={{ flexShrink: 0, marginTop: 2 }} />
                        <div>
                            <h4 style={{ color: '#92400E', fontWeight: 700, margin: '0 0 4px', fontSize: 15 }}>Profile is Under Review</h4>
                            <p style={{ color: '#B45309', margin: 0, fontSize: 13, lineHeight: 1.5 }}>
                                Your profile is currently restricted from unlocking leads because it is pending Admin verification (often due to recent critical profile changes).
                                We will review it shortly.
                            </p>
                        </div>
                    </div>
                )}

                {/* Score Widget */}
                <div style={{ background: '#fff', border: '1px solid #E2E8F0', padding: 20, borderRadius: 16, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ position: 'relative', width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E2E8F0" strokeWidth="4" />
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={profile?.completenessScore >= 100 ? '#10B981' : '#3B82F6'} strokeWidth="4" strokeDasharray={`${profile?.completenessScore || 0}, 100`} style={{ transition: 'stroke-dasharray 1s ease' }} />
                            </svg>
                            <span style={{ position: 'absolute', fontSize: 13, fontWeight: 800, color: '#0F172A' }}>{profile?.completenessScore || 0}%</span>
                        </div>
                        <div>
                            <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Profile Strength</h3>
                            <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
                                {profile?.completenessScore >= 100 ? 'Excellent! Your profile is fully optimized.' : 'Complete all fields and add an intro video to reach 100%.'}
                            </p>
                        </div>
                    </div>
                </div>

                {error && <div style={{ background: '#FEF2F2', color: '#DC2626', padding: 16, borderRadius: 12, marginBottom: 24, border: '1px solid #FECACA', display: 'flex', gap: 8 }}><AlertCircle size={20} /> {error}</div>}
                {successMsg && <div style={{ background: '#DCFCE7', color: '#166534', padding: 16, borderRadius: 12, marginBottom: 24, border: '1px solid #BBF7D0', display: 'flex', gap: 8 }}><CheckCircle2 size={20} /> {successMsg}</div>}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>

                    {/* Basic Info */}
                    <div className="admin-card" style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #E2E8F0' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 700, marginBottom: 20, color: '#0F172A' }}>
                            <User size={20} color="#3B82F6" /> Basic Information
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6, display: 'block' }}>Full Name (Locked)</label>
                                <input type="text" className="input-field" value={profile.userId?.name || ''} disabled style={{ background: '#F1F5F9', color: '#94A3B8' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6, display: 'block' }}>Gender</label>
                                <select className="input-field" value={formData.gender} onChange={e => handleInputChange('gender', e.target.value)}>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Academic Details */}
                    <div className="admin-card" style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #E2E8F0' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 700, marginBottom: 20, color: '#0F172A' }}>
                            <BookOpen size={20} color="#8B5CF6" /> Academic Details
                        </h3>
                        {criticalLocked && <div style={{ fontSize: 12, background: '#F1F5F9', color: '#64748B', padding: '8px 12px', borderRadius: 6, marginBottom: 16 }}>🔒 Critical fields (College) are locked for 10 days after signup.</div>}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6, display: 'block' }}>College / University *</label>
                                <input type="text" className="input-field" value={formData.college} onChange={e => handleInputChange('college', e.target.value)} disabled={criticalLocked} style={{ background: criticalLocked ? '#F1F5F9' : '#fff' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6, display: 'block' }}>Course / Degree</label>
                                    <input type="text" className="input-field" placeholder="e.g. B.Tech Computer Science" value={formData.degree} onChange={e => handleInputChange('degree', e.target.value)} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6, display: 'block' }}>Current Year / Grad Year</label>
                                    <input type="text" className="input-field" placeholder="e.g. 3rd Year or 2023" value={formData.graduationYear} onChange={e => handleInputChange('graduationYear', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Teaching Preferences */}
                    <div className="admin-card" style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #E2E8F0' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 700, marginBottom: 20, color: '#0F172A' }}>
                            <Briefcase size={20} color="#F59E0B" /> Teaching Preferences
                        </h3>
                        {criticalLocked && <div style={{ fontSize: 12, background: '#F1F5F9', color: '#64748B', padding: '8px 12px', borderRadius: 6, marginBottom: 16 }}>🔒 Critical fields (Subjects, Classes Phase) are locked for 10 days after signup.</div>}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8, display: 'block' }}>Subjects You Teach *</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {SUBJECTS_LIST.map(s => {
                                        const isSelected = formData.subjects.includes(s);
                                        return (
                                            <button key={s} type="button" disabled={criticalLocked} onClick={() => toggleArrayItem('subjects', s)} style={{ padding: '6px 14px', borderRadius: 999, border: '1px solid', fontSize: 13, fontWeight: 600, cursor: criticalLocked ? 'not-allowed' : 'pointer', background: isSelected ? '#EFF6FF' : '#fff', borderColor: isSelected ? '#3B82F6' : '#E2E8F0', color: isSelected ? '#1D4ED8' : '#64748B', opacity: criticalLocked ? 0.7 : 1 }}>
                                                {isSelected ? '✓ ' : ''}{s}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8, display: 'block' }}>Classes Handled</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {CLASSES_LIST.map(c => {
                                        const isSelected = formData.classesHandled.includes(c);
                                        return (
                                            <button key={c} type="button" disabled={criticalLocked} onClick={() => toggleArrayItem('classesHandled', c)} style={{ padding: '6px 14px', borderRadius: 999, border: '1px solid', fontSize: 13, fontWeight: 600, cursor: criticalLocked ? 'not-allowed' : 'pointer', background: isSelected ? '#EEF2FF' : '#fff', borderColor: isSelected ? '#4F46E5' : '#E2E8F0', color: isSelected ? '#3730A3' : '#64748B', opacity: criticalLocked ? 0.7 : 1 }}>
                                                {isSelected ? '✓ ' : ''}{c}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6, display: 'block' }}>Experience (Years)</label>
                                    <input type="number" className="input-field" placeholder="e.g. 2" value={formData.experience} onChange={e => handleInputChange('experience', e.target.value)} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6, display: 'block' }}>Teaching Mode</label>
                                    <select className="input-field" value={formData.teachingMode} onChange={e => handleInputChange('teachingMode', e.target.value)}>
                                        <option value="Any">Any Mode</option>
                                        <option value="Home Tuition">Home Tuition (Student's Place)</option>
                                        <option value="Tutor's Place">Tutor's Place</option>
                                        <option value="Online">Online Only</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="admin-card" style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #E2E8F0' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 700, marginBottom: 20, color: '#0F172A' }}>
                            <MapPin size={20} color="#10B981" /> Location
                        </h3>
                        {criticalLocked && <div style={{ fontSize: 12, background: '#F1F5F9', color: '#64748B', padding: '8px 12px', borderRadius: 6, marginBottom: 16 }}>🔒 Critical fields (Area) are locked for 10 days after signup.</div>}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6, display: 'block' }}>Primary Area *</label>
                                <select className="input-field" value={formData.area} onChange={e => handleInputChange('area', e.target.value)} disabled={criticalLocked} style={{ background: criticalLocked ? '#F1F5F9' : '#fff' }}>
                                    <option value="">Select your area</option>
                                    {AREAS_LIST.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6, display: 'block' }}>Travel Radius (km)</label>
                                <input type="number" min="1" max="50" className="input-field" value={formData.teachingRadius} onChange={e => handleInputChange('teachingRadius', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="admin-card" style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #E2E8F0' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 700, marginBottom: 20, color: '#0F172A' }}>
                            <IndianRupee size={20} color="#059669" /> Expected Pricing (Monthly)
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6, display: 'block' }}>Minimum (₹)</label>
                                <input type="number" placeholder="e.g. 2000" className="input-field" value={formData.expectedFeesMin} onChange={e => handleInputChange('expectedFeesMin', e.target.value)} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6, display: 'block' }}>Maximum (₹)</label>
                                <input type="number" placeholder="e.g. 5000" className="input-field" value={formData.expectedFeesMax} onChange={e => handleInputChange('expectedFeesMax', e.target.value)} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'flex-end', paddingBottom: 10 }}>
                                <input type="checkbox" id="neg" checked={formData.isNegotiable} onChange={e => handleInputChange('isNegotiable', e.target.checked)} style={{ width: 16, height: 16, accentColor: '#3B82F6' }} />
                                <label htmlFor="neg" style={{ fontSize: 14, color: '#475569', fontWeight: 500, cursor: 'pointer' }}>Negotiable</label>
                            </div>
                        </div>
                    </div>

                    {/* Bio & Content */}
                    <div className="admin-card" style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #E2E8F0' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 700, marginBottom: 20, color: '#0F172A' }}>
                            <Target size={20} color="#EC4899" /> Pitch & Content
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6, display: 'block' }}>Short Bio (Max 500 chars)</label>
                                <textarea rows={3} className="input-field" placeholder="Briefly describe your background, passion for teaching, etc." value={formData.bio} onChange={e => handleInputChange('bio', e.target.value)} maxLength={500} />
                            </div>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6, display: 'block' }}>Why should parents choose you?</label>
                                <textarea rows={3} className="input-field" placeholder="List your unique strengths, past student achievements, or teaching methodology." value={formData.whyChooseMe} onChange={e => handleInputChange('whyChooseMe', e.target.value)} maxLength={500} />
                            </div>
                        </div>
                    </div>

                    {/* Trust Boosters */}
                    <div className="admin-card" style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #E2E8F0' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 700, marginBottom: 20, color: '#0F172A' }}>
                            <ShieldCheck size={20} color="#3B82F6" /> Trust Boosters (+15% Score)
                        </h3>
                        <div>
                            <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6, display: 'block' }}>Introduction Video URL (YouTube/Drive)</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <Video size={20} color="#94A3B8" />
                                <input type="url" className="input-field" placeholder="https://youtu.be/..." value={formData.introVideoUrl} onChange={e => handleInputChange('introVideoUrl', e.target.value)} />
                            </div>
                            <p style={{ margin: '8px 0 0 32px', fontSize: 12, color: '#64748B' }}>A 60-second video speaking strictly in English builds immense trust with parents.</p>
                        </div>
                    </div>

                </div>

                <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                    <button onClick={() => navigate('/tutor-dashboard')} className="btn-outline" style={{ padding: '12px 24px' }}>Cancel</button>
                    <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ padding: '12px 32px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Save Profile
                    </button>
                </div>
            </div>
        </div>
    );
}
