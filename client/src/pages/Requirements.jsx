import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Plus, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RequirementCard from '../components/RequirementCard';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Science', 'History', 'Bengali', 'Hindi', 'Computer Science', 'Geography'];
const CLASSES = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

export function RequirementCardSkeleton() {
    return (
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E2E8F0', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                    <div style={{ height: 14, background: '#E2E8F0', borderRadius: 4, width: '40%', marginBottom: 6 }} />
                    <div style={{ height: 10, background: '#F1F5F9', borderRadius: 4, width: '25%' }} />
                </div>
            </div>
            <div style={{ height: 12, background: '#E2E8F0', borderRadius: 4, width: '70%', marginBottom: 12 }} />
            <div style={{ height: 12, background: '#F1F5F9', borderRadius: 4, width: '50%', marginBottom: 20 }} />
            <div style={{ height: 40, background: '#F8FAFC', borderRadius: 12, marginBottom: 16 }} />
            <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ height: 38, background: '#E2E8F0', borderRadius: 10, flex: 1 }} />
                <div style={{ height: 38, background: '#F1F5F9', borderRadius: 10, flex: 1 }} />
            </div>
            <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }`}</style>
        </div>
    );
}

export default function Requirements() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [requirements, setRequirements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [searchArea, setSearchArea] = useState('');
    const [filterSubject, setFilterSubject] = useState('');
    const [filterClass, setFilterClass] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const loadData = async () => {
        setLoading(true);
        setError('');
        try {
            const params = new URLSearchParams();
            if (searchArea) params.append('area', searchArea);
            if (filterSubject) params.append('subject', filterSubject);
            if (filterClass) params.append('classLevel', filterClass);

            const { data } = await api.get(`/requirement?${params.toString()}`);
            setRequirements(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load requirements');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [searchArea, filterSubject, filterClass]);

    const handleApplySuccess = (id) => {
        setRequirements(prev => prev.map(r => r._id === id ? { ...r, appliedTutors: [...(r.appliedTutors || []), user.id || user._id] } : r));
    };

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: 80, paddingBottom: 80 }}>
            {/* Hero */}
            <div style={{ background: 'linear-gradient(135deg, #1E40AF, #2563EB, #4F46E5)', padding: '60px 24px', textAlign: 'center', color: '#fff' }}>
                <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '6px 16px', borderRadius: 999, fontSize: 11, fontWeight: 700, backdropFilter: 'blur(4px)', marginBottom: 16 }}>
                    📋 LIVE BOARD
                </span>
                <h1 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 36, marginBottom: 12 }}>Students Looking for Tutors</h1>
                <p style={{ fontSize: 16, opacity: 0.9, maxWidth: 600, margin: '0 auto 24px' }}>
                    Browse live tuition requirements posted by parents and students in Kolkata. Apply directly to matching needs.
                </p>
                <button onClick={() => navigate(user ? '/post-requirement' : '/login?redirect=/post-requirement&message=Please+login+to+post+a+requirement')} style={{ background: '#fff', color: '#1D4ED8', border: 'none', padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <Plus size={16} /> Post Your Requirement
                </button>
            </div>

            <div style={{ maxWidth: 1000, margin: '-24px auto 0', padding: '0 24px' }}>
                {/* Search Bar */}
                <div style={{ background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)', marginBottom: 32 }}>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, position: 'relative', minWidth: 200 }}>
                            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                            <input type="text" placeholder="Search by area (e.g. Salt Lake)..." value={searchArea} onChange={e => setSearchArea(e.target.value)} className="input-field" style={{ paddingLeft: 44 }} />
                        </div>
                        <button onClick={() => setShowFilters(!showFilters)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 20px', borderRadius: 10, background: showFilters ? '#EFF6FF' : '#fff', border: `2px solid ${showFilters ? '#2563EB' : '#E2E8F0'}`, color: showFilters ? '#1D4ED8' : '#475569', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                            <SlidersHorizontal size={14} /> Filters
                        </button>
                        {(searchArea || filterSubject || filterClass) && (
                            <button onClick={() => { setSearchArea(''); setFilterSubject(''); setFilterClass(''); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px', background: 'none', border: 'none', color: '#EF4444', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                                <XCircle size={14} /> Clear
                            </button>
                        )}
                    </div>

                    {showFilters && (
                        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #F1F5F9', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: 150 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 4 }}>Subject</label>
                                <select className="input-field" value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
                                    <option value="">All Subjects</option>
                                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div style={{ flex: 1, minWidth: 150 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 4 }}>Class Level</label>
                                <select className="input-field" value={filterClass} onChange={e => setFilterClass(e.target.value)}>
                                    <option value="">All Classes</option>
                                    {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {!loading && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <span style={{ fontSize: 14, color: '#64748B', fontWeight: 500 }}>{requirements.length} requirement{requirements.length !== 1 ? 's' : ''} found</span>
                        {user?.role === 'tutor' && (
                            <span style={{ fontSize: 11, background: '#DCFCE7', color: '#166534', padding: '4px 12px', borderRadius: 999, fontWeight: 700, border: '1px solid #BBF7D0' }}>
                                👨‍🏫 Tutor Mode Active
                            </span>
                        )}
                    </div>
                )}

                {error && <div style={{ background: '#FEF2F2', color: '#DC2626', padding: 16, borderRadius: 12, textAlign: 'center', fontSize: 14, fontWeight: 600, marginBottom: 24, border: '1px solid #FECACA' }}>{error}</div>}

                {/* Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => <RequirementCardSkeleton key={i} />)
                    ) : requirements.map(req => (
                        <RequirementCard key={req._id} req={req} onApplied={handleApplySuccess} />
                    ))}
                </div>

                {!loading && requirements.length === 0 && !error && (
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🔭</div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>No requirements found</h3>
                        <p style={{ color: '#64748B', fontSize: 14, marginBottom: 24 }}>Try adjusting your filters or search term.</p>
                        <button onClick={() => { setSearchArea(''); setFilterSubject(''); setFilterClass(''); }} className="btn-outline">Clear All Filters</button>
                    </div>
                )}
            </div>
        </div>
    );
}
