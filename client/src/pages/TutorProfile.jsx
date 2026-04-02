import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTutorById } from '../services/tutorService';
import { MapPin, BookOpen, IndianRupee, Phone } from 'lucide-react';

export default function TutorProfile() {
    const { id } = useParams();
    const [tutor, setTutor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');

    useEffect(() => {
        getTutorById(id).then(res => setTutor(res.data)).catch(() => setErr('Tutor not found.')).finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}><div className="skeleton" style={{ width: 64, height: 64, borderRadius: '50%' }} /></div>;
    if (err || !tutor) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}><p style={{ color: '#64748B', fontSize: 18 }}>{err || 'Tutor not found.'}</p></div>;

    const BASE_URL = 'http://localhost:5000'; // Define base or relative

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', padding: '100px 24px 80px' }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>

                <div className="card" style={{ padding: '40px', borderRadius: 24, boxShadow: '0 12px 32px rgba(37,99,235,0.06)', border: '1px solid #E2E8F0', background: '#fff' }}>

                    {/* Header: Photo & Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
                        {tutor.profileImage ? (
                            <img src={`${BASE_URL}${tutor.profileImage}`} alt={tutor.userId?.name} style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '4px solid #fff', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }} />
                        ) : (
                            <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 40, boxShadow: '0 8px 20px rgba(37,99,235,0.2)' }}>
                                {tutor.userId?.name?.[0] || 'T'}
                            </div>
                        )}
                        <div>
                            <h1 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 32, color: '#0F172A', marginBottom: 6 }}>{tutor.userId?.name}</h1>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                                <span style={{ padding: '4px 12px', background: '#F1F5F9', color: '#475569', borderRadius: 20, fontSize: 13, fontWeight: 600, border: '1px solid #E2E8F0' }}>{tutor.gender}</span>
                                {tutor.status === 'APPROVED' && (
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                        <span style={{ padding: '4px 12px', background: '#DCFCE7', color: '#166534', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>✓ Verified Tutor</span>
                                        {tutor.trustedTutor && <span style={{ padding: '4px 12px', background: '#FEF9C3', color: '#854d0e', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>⭐ Trusted</span>}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Academic Badge */}
                    <div style={{ padding: '16px 24px', background: 'linear-gradient(to right, #EFF6FF, #fff)', borderRadius: 16, borderLeft: '4px solid #2563EB', marginBottom: 32 }}>
                        <div style={{ fontSize: 11, color: '#2563EB', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4, letterSpacing: 0.5 }}>Qualifications</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#1E293B' }}>{tutor.degree} from {tutor.college}</div>
                        {tutor.graduationYear && <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>Class of {tutor.graduationYear}</div>}
                    </div>

                    {/* Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
                        <ProfileStat icon={<BookOpen size={18} color="#2563EB" />} label="Subjects" value={tutor.subjects?.join(', ')} color="#EFF6FF" />
                        <ProfileStat icon={<MapPin size={18} color="#10B981" />} label="Teaching Area" value={`${tutor.area} (${tutor.teachingRadius}km Radius)`} color="#ECFDF5" />
                        <ProfileStat icon={<Briefcase size={18} color="#6366F1" />} label="Experience" value={tutor.experience > 0 ? `${tutor.experience} Years` : 'New Tutor'} color="#EEF2FF" />
                        <ProfileStat icon={<IndianRupee size={18} color="#F59E0B" />} label="Expected Fees" value={`₹${tutor.expectedFeesMin?.toLocaleString()} - ₹${tutor.expectedFeesMax?.toLocaleString()} / month`} color="#FFFBEB" />
                    </div>

                    {/* About Section */}
                    <div style={{ marginBottom: 32 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 12 }}>About {tutor.userId?.name?.split(' ')[0]}</h3>
                        <p style={{ fontSize: 16, color: '#475569', lineHeight: 1.7, background: '#F8FAFC', padding: 24, borderRadius: 16 }}>{tutor.bio}</p>
                    </div>

                    {/* Mode & Availability */}
                    <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
                        <div style={{ flex: 1, padding: 16, border: '1.5px solid #E2E8F0', borderRadius: 12, textAlign: 'center' }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>Teaching Mode</div>
                            <div style={{ fontWeight: 700, color: '#334155' }}>{tutor.teachingMode}</div>
                        </div>
                        <div style={{ flex: 1, padding: 16, border: '1.5px solid #E2E8F0', borderRadius: 12, textAlign: 'center' }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>Fee Negotiation</div>
                            <div style={{ fontWeight: 700, color: '#334155' }}>{tutor.isNegotiable ? 'Negotiable' : 'Fixed Price'}</div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div style={{ display: 'flex', gap: 12 }}>
                        <a href={`tel:${tutor.userId?.phone}`} style={{ flex: 2, background: '#2563EB', color: '#fff', textDecoration: 'none', padding: '18px 0', borderRadius: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: 16, boxShadow: '0 8px 20px rgba(37,99,235,0.25)' }}>
                            <Phone size={20} /> Call Tutor Now
                        </a>
                        <button style={{ flex: 1, background: '#F1F5F9', color: '#475569', border: 'none', padding: '18px 0', borderRadius: 16, fontWeight: 700, fontSize: 15 }}>Message</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Utility Component
function ProfileStat({ icon, label, value, color }) {
    return (
        <div style={{ background: color, padding: '20px', borderRadius: 16, display: 'flex', gap: 12 }}>
            <div style={{ background: '#fff', padding: 10, borderRadius: 10, alignSelf: 'start', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>{icon}</div>
            <div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', whiteSpace: 'pre-wrap' }}>{value}</div>
            </div>
        </div>
    );
}

