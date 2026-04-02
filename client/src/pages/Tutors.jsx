import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getAllTutors } from '../services/tutorService';
import { MapPin, BookOpen, IndianRupee, Star, Search, Filter, PhoneCall, MessageCircle } from 'lucide-react';

const SUBJECTS = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Science', 'History', 'Computer Science', 'Bengali', 'Hindi'];
const CLASSES = ['All', 'Class 1-5', 'Class 6-8', 'Class 9-10', 'Class 11-12'];
const AREAS = ['All Areas', 'Salt Lake', 'New Town', 'Dum Dum', 'Behala', 'Tollygunge', 'Park Street', 'Howrah', 'Ballygunge', 'Gariahat', 'Barasat', 'Topsia', 'Tiljala', 'Science City'];

function TutorSkeleton() {
    return (
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E2E8F0', padding: 24, overflow: 'hidden' }}>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                <div className="skeleton" style={{ width: 56, height: 56, borderRadius: '50%' }} />
                <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ height: 16, width: '60%', marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 12, width: '40%' }} />
                </div>
            </div>
            <div className="skeleton" style={{ height: 12, marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 12, width: '80%', marginBottom: 16 }} />
            <div style={{ display: 'flex', gap: 8 }}>
                <div className="skeleton" style={{ height: 38, flex: 1, borderRadius: 10 }} />
                <div className="skeleton" style={{ height: 38, flex: 1, borderRadius: 10 }} />
            </div>
        </div>
    );
}

export default function Tutors() {
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const [filters, setFilters] = useState({
        subject: searchParams.get('subject') || 'All',
        area: searchParams.get('location') || 'All Areas',
        classGroup: 'All',
        search: '',
    });

    useEffect(() => {
        getAllTutors().then(res => setTutors(res.data)).finally(() => setLoading(false));
    }, []);

    const filtered = tutors.filter(t => {
        const subMatch = filters.subject === 'All' || t.subjects?.some(s => s.toLowerCase().includes(filters.subject.toLowerCase()));
        const areaMatch = filters.area === 'All Areas' || t.area?.toLowerCase().includes(filters.area.toLowerCase());
        const searchMatch = !filters.search ||
            t.userId?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
            t.subjects?.some(s => s.toLowerCase().includes(filters.search.toLowerCase())) ||
            t.area?.toLowerCase().includes(filters.search.toLowerCase());
        return subMatch && areaMatch && searchMatch;
    });

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: 80 }}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #EFF6FF, #EEF2FF)', padding: '48px 24px 0' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <h1 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 36, color: '#0F172A', marginBottom: 8 }}>Find Tutors in Kolkata</h1>
                    <p style={{ color: '#64748B', fontSize: 16, marginBottom: 32 }}>100+ verified tutors ready to teach in your area</p>

                    {/* Search */}
                    <div className="glass" style={{ borderRadius: 16, padding: '16px 20px', marginBottom: -24, display: 'flex', gap: 12, alignItems: 'center', boxShadow: '0 8px 32px rgba(37,99,235,0.1)' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                            <input className="input-field" style={{ paddingLeft: 44 }} placeholder="Search by name, subject or area..."
                                value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} />
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 32 }}>
                    {/* Sidebar Filters */}
                    <div>
                        <div className="glass" style={{ borderRadius: 20, padding: 24, position: 'sticky', top: 100 }}>
                            <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 20, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Filter size={18} color="#2563EB" /> Filters
                            </h3>

                            <div style={{ marginBottom: 24 }}>
                                <label style={{ fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 10 }}>Subject</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    {SUBJECTS.map(s => (
                                        <button key={s} onClick={() => setFilters(f => ({ ...f, subject: s }))} style={{
                                            padding: '8px 12px', borderRadius: 8, border: 'none', textAlign: 'left',
                                            background: filters.subject === s ? '#EFF6FF' : 'transparent',
                                            color: filters.subject === s ? '#2563EB' : '#374151',
                                            fontWeight: filters.subject === s ? 700 : 500,
                                            fontSize: 14, cursor: 'pointer', transition: 'all 0.15s'
                                        }}>{s}</button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginBottom: 24 }}>
                                <label style={{ fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 10 }}>Area</label>
                                <select className="input-field" value={filters.area} onChange={e => setFilters(f => ({ ...f, area: e.target.value }))}>
                                    {AREAS.map(a => <option key={a}>{a}</option>)}
                                </select>
                            </div>

                            <button onClick={() => setFilters({ subject: 'All', area: 'All Areas', classGroup: 'All', search: '' })}
                                style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1.5px solid #E2E8F0', background: '#fff', color: '#64748B', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                                Clear Filters
                            </button>
                        </div>
                    </div>

                    {/* Tutor Grid */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <p style={{ color: '#64748B', fontSize: 14 }}>
                                {loading ? 'Loading...' : <><strong style={{ color: '#0F172A' }}>{filtered.length}</strong> tutors found</>}
                            </p>
                        </div>

                        {loading ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
                                {[...Array(4)].map((_, i) => <TutorSkeleton key={i} />)}
                            </div>
                        ) : filtered.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '80px 32px', background: '#fff', borderRadius: 20, border: '1px dashed #CBD5E1' }}>
                                <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
                                <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 22, color: '#0F172A', marginBottom: 10 }}>
                                    We couldn't find the perfect match yet…
                                </h3>
                                <p style={{ color: '#64748B', marginBottom: 28, fontSize: 15 }}>Let us help you manually! Post your requirement and we'll connect you with the right tutor.</p>
                                <Link to="/post-requirement" className="btn-primary">Post Requirement →</Link>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
                                {filtered.map((tutor) => (
                                    <div key={tutor._id} className="tutor-card">
                                        <div style={{ padding: '24px 24px 16px' }}>
                                            <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
                                                {tutor.profileImage ? (
                                                    <img src={`http://localhost:5000${tutor.profileImage}`} alt={tutor.userId?.name} style={{
                                                        width: 56, height: 56, borderRadius: '50%', objectFit: 'cover',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)', flexShrink: 0
                                                    }} />
                                                ) : (
                                                    <div style={{
                                                        width: 56, height: 56, borderRadius: '50%',
                                                        background: 'linear-gradient(135deg, #2563EB, #4F46E5)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        color: '#fff', fontWeight: 800, fontSize: 20, flexShrink: 0
                                                    }}>
                                                        {tutor.userId?.name?.[0] || 'T'}
                                                    </div>
                                                )}
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 700, fontSize: 16, color: '#0F172A' }}>{tutor.userId?.name}</div>
                                                    {tutor.isVerified && (
                                                        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                                                            <span className="badge badge-green">✓ Verified</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#475569' }}>
                                                    <BookOpen size={14} color="#2563EB" />
                                                    <span style={{ fontWeight: 600, color: '#0F172A' }}>{tutor.subjects?.slice(0, 3).join(', ')}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#475569' }}>
                                                    <MapPin size={14} color="#10B981" />
                                                    <span>{tutor.area}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#475569' }}>
                                                    <span style={{ fontWeight: 700, color: '#059669' }}>{tutor.pricing}</span>
                                                    <span style={{ marginLeft: 'auto', fontSize: 12, color: '#64748B' }}>Exp: {tutor.experience}</span>
                                                </div>
                                            </div>

                                            {tutor.bio && (
                                                <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {tutor.bio}
                                                </p>
                                            )}
                                        </div>

                                        <div style={{ padding: '0 24px 20px', display: 'flex', gap: 8 }}>
                                            <a href={`https://wa.me/${tutor.userId?.phone}?text=Hi%2C%20I%20found%20your%20profile%20on%20TutorsPoint`}
                                                target="_blank" rel="noopener noreferrer" className="btn-whatsapp" style={{ flex: 1 }}>
                                                💬 WhatsApp
                                            </a>
                                            <a href={`tel:${tutor.userId?.phone}`} style={{
                                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                gap: 6, padding: '10px', borderRadius: 10,
                                                border: '1.5px solid #E2E8F0', background: '#fff', color: '#374151',
                                                fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s'
                                            }}>
                                                <PhoneCall size={14} /> Call
                                            </a>
                                            <Link to={`/tutors/${tutor._id}`} style={{
                                                padding: '10px 16px', borderRadius: 10,
                                                background: '#EFF6FF', color: '#2563EB',
                                                fontSize: 13, fontWeight: 600, textDecoration: 'none'
                                            }}>
                                                View →
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
