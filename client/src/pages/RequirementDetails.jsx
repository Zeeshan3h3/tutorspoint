import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, MapPin, Phone, User, Clock, IndianRupee, Calendar, CheckCircle, Bookmark, Eye, BadgeCheck, Share2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const getRelativeTime = (dateString) => {
    if (!dateString) return '';
    const days = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Posted today';
    if (days === 1) return 'Posted yesterday';
    return `Posted ${days} days ago`;
};

export default function RequirementDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [req, setReq] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const { data } = await api.get(`/requirement/${id}`);
                setReq(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Requirement not found');
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const isTutor = user?.role === 'tutor';
    const hasApplied = user && req?.appliedTutors?.some(tId => tId === user._id || tId === user.id);

    const handleApply = async () => {
        if (!user) {
            navigate(`/login?redirect=/requirements/${id}&message=Please+login+to+apply`);
            return;
        }
        if (!isTutor) return alert('Only tutors can apply.');

        setApplying(true);
        try {
            const { data } = await api.post(`/requirement/${id}/apply`);
            setReq(prev => ({
                ...prev,
                appliedTutors: [...(prev.appliedTutors || []), user.id || user._id],
                phone: data.requirement?.phone || prev.phone // Reveal phone
            }));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to apply');
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ animation: 'spin 1s linear infinite', border: '3px solid #E2E8F0', borderTopColor: '#3B4DE8', borderRadius: '50%', width: 40, height: 40 }} />
                <style>{`@keyframes spin { 100% { transform: rotate(360deg) } }`}</style>
            </div>
        );
    }

    if (error || !req) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0F172A', marginBottom: 12 }}>{error || 'Requirement not found'}</h2>
                <Link to="/requirements" className="btn-primary" style={{ background: '#3B4DE8' }}>Browse Other Requirements</Link>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: 100, paddingBottom: 120 }}>

            {/* Breadcrumb Bar */}
            <div style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', padding: '12px 24px', marginBottom: 32 }}>
                <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 13, color: '#64748B', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Link to="/" style={{ color: '#64748B', textDecoration: 'none' }}>Home</Link>
                        <span>&gt;</span>
                        <Link to="/requirements" style={{ color: '#64748B', textDecoration: 'none' }}>Requirements</Link>
                        <span>&gt;</span>
                        <span style={{ color: '#0F172A', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 150 }}>
                            {req.postedByName}
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 6, color: '#64748B', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#3B4DE8'} onMouseLeave={e => e.target.style.color = '#64748B'}>
                            <Share2 size={14} /> Share
                        </button>
                        <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 6, color: '#64748B', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#3B4DE8'} onMouseLeave={e => e.target.style.color = '#64748B'}>
                            <Bookmark size={14} /> Save
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
                <Link to="/requirements" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    color: '#64748B', textDecoration: 'none', fontWeight: 600, fontSize: 14,
                    marginBottom: 24, padding: '8px 16px', borderRadius: 8,
                    transition: 'all 0.2s', background: 'transparent'
                }}
                    onMouseEnter={e => { e.target.style.background = '#E2E8F0'; e.target.style.color = '#0F172A'; }}
                    onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#64748B'; }}
                >
                    <ArrowLeft size={16} /> Back to Board
                </Link>

                <div className="glass" style={{ background: '#fff', borderRadius: 24, padding: 40, boxShadow: '0 10px 40px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>

                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24, marginBottom: 32 }}>
                        <div style={{ display: 'flex', gap: 16 }}>
                            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #3B4DE8, #4F46E5)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, flexShrink: 0 }}>
                                {req.postedByName?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h1 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 28, fontWeight: 800, color: '#0F172A', margin: 0, fontFamily: 'Poppins, sans-serif' }}>
                                    {req.postedByName}
                                    {req.isVerified && <BadgeCheck size={24} color="#3B82F6" style={{ marginTop: 2 }} />}
                                </h1>
                                <p style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: 6, fontSize: 15, marginTop: 6 }}>
                                    <MapPin size={16} /> {req.area}, {req.pinCode || 'Kolkata'}
                                </p>
                            </div>
                        </div>

                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#ECFDF5', color: '#059669', padding: '6px 16px', borderRadius: 999, fontSize: 13, fontWeight: 700 }}>
                                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                                    Active
                                </div>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: req.contactType === 'Parent' ? '#EFF6FF' : '#F8FAFC', color: req.contactType === 'Parent' ? '#1D4ED8' : '#475569', padding: '6px 16px', borderRadius: 999, fontSize: 13, fontWeight: 700, border: '1px solid #E2E8F0' }}>
                                    {req.contactType === 'Parent' ? '👨‍👩‍👦 Parent Account' : '🎓 Student Account'}
                                </div>
                            </div>
                            <p style={{ color: '#94A3B8', fontSize: 13, fontWeight: 500, margin: 0 }}>
                                {getRelativeTime(req.createdAt)}
                            </p>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
                        <div style={{ padding: '24px 20px', background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', transition: 'transform 0.2s', cursor: 'default' }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                            <div style={{ color: '#64748B', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                <IndianRupee size={20} color="#3B4DE8" /> Monthly Budget
                            </div>
                            <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>
                                ₹{req.budgetMin?.toLocaleString()} – ₹{req.budgetMax?.toLocaleString()}
                            </div>
                        </div>

                        <div style={{ padding: '24px 20px', background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', transition: 'transform 0.2s', cursor: 'default' }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                            <div style={{ color: '#64748B', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                <BookOpen size={20} color="#3B4DE8" /> Academic Level
                            </div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A' }}>{req.classLevel}</div>
                        </div>

                        <div style={{ padding: '24px 20px', background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', transition: 'transform 0.2s', cursor: 'default' }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                            <div style={{ color: '#64748B', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                <Calendar size={20} color="#3B4DE8" /> Frequency
                            </div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A' }}>
                                {req.daysPerWeek ? `${req.daysPerWeek} days/week` : `${req.sessionsPerMonth || 12} sessions/mo`}
                            </div>
                        </div>
                    </div>

                    {/* Subjects */}
                    <div style={{ marginBottom: 40 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 16 }}>Subjects Required</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                            {req.subjects?.map(s => (
                                <span key={s} style={{
                                    background: '#EFF6FF', color: '#3B4DE8', padding: '8px 16px',
                                    borderRadius: 999, fontSize: 14, fontWeight: 600, border: '1px solid #BFDBFE',
                                    transition: 'all 0.2s', cursor: 'default'
                                }}
                                    onMouseEnter={e => { e.target.style.background = '#3B4DE8'; e.target.style.color = '#fff'; }}
                                    onMouseLeave={e => { e.target.style.background = '#EFF6FF'; e.target.style.color = '#3B4DE8'; }}
                                >
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Preferences & Details Grid */}
                    <div style={{ marginBottom: 40 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 16 }}>Other Details</h3>
                        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                                {/* Row 1 */}
                                <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0' }}>
                                    <span style={{ color: '#64748B', fontSize: 13, display: 'block', marginBottom: 4 }}>Location / Area</span>
                                    <strong style={{ color: '#1E293B', fontSize: 15 }}>{req.area || 'Not specified'}</strong>
                                </div>
                                <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0' }}>
                                    <span style={{ color: '#64748B', fontSize: 13, display: 'block', marginBottom: 4 }}>Mode of Class</span>
                                    <strong style={{ color: '#1E293B', fontSize: 15 }}>{req.classMode || 'Any mode'}</strong>
                                </div>
                                {/* Row 2 */}
                                <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0' }}>
                                    <span style={{ color: '#64748B', fontSize: 13, display: 'block', marginBottom: 4 }}>Board</span>
                                    <strong style={{ color: '#1E293B', fontSize: 15 }}>{req.board || 'Any Board'}</strong>
                                </div>
                                <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0' }}>
                                    <span style={{ color: '#64748B', fontSize: 13, display: 'block', marginBottom: 4 }}>Medium of Instruction</span>
                                    <strong style={{ color: '#1E293B', fontSize: 15 }}>{req.medium || 'Any Medium'}</strong>
                                </div>
                                {/* Row 3 */}
                                <div style={{ padding: '16px 20px', borderRight: '1px solid #E2E8F0' }}>
                                    <span style={{ color: '#64748B', fontSize: 13, display: 'block', marginBottom: 4 }}>Tutor Gender Pref.</span>
                                    <strong style={{ color: '#1E293B', fontSize: 15 }}>{req.genderPreference || 'Any'}</strong>
                                </div>
                                <div style={{ padding: '16px 20px' }}>
                                    <span style={{ color: '#64748B', fontSize: 13, display: 'block', marginBottom: 4 }}>Preferred Timing</span>
                                    <strong style={{ color: '#1E293B', fontSize: 15 }}>{req.startTiming || 'Flexible'}</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Message */}
                    <div style={{ marginBottom: 40 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 12 }}>Additional Message</h3>
                        <div style={{ padding: 24, background: '#F8FAFC', borderRadius: 16, border: '1px solid #E2E8F0' }}>
                            {req.message && req.message.toLowerCase() !== 'no' && req.message.toLowerCase() !== 'none' ? (
                                <p style={{ color: '#334155', fontSize: 15, lineHeight: 1.6, margin: 0 }}>"{req.message}"</p>
                            ) : (
                                <p style={{ color: '#94A3B8', fontSize: 15, fontStyle: 'italic', margin: 0 }}>No additional message provided.</p>
                            )}
                        </div>
                    </div>

                    {/* Views & Simple Notice */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: 24 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94A3B8', fontSize: 13, fontWeight: 500 }}>
                            <Eye size={16} /> {req.views || 0} views
                        </span>

                        {hasApplied && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 16, fontWeight: 700, color: '#0F172A', background: '#F0FDF4', padding: '10px 20px', borderRadius: 12, border: '1px solid #BBF7D0' }}>
                                <Phone size={18} color="#10B981" />
                                <span style={{ letterSpacing: 1 }}>{req.phone}</span>
                                <CheckCircle size={18} color="#10B981" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Sticky CTA Bar */}
                <div style={{
                    position: 'fixed', bottom: 0, left: 0, right: 0,
                    background: '#fff', borderTop: '1px solid #E2E8F0',
                    padding: '16px 24px', boxShadow: '0 -4px 12px rgba(0,0,0,0.05)',
                    zIndex: 40, display: 'flex', justifyContent: 'center'
                }}>
                    <div style={{ width: '100%', maxWidth: 800, display: 'flex', gap: 16, alignItems: 'center' }}>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
                            {!user ? (
                                <Link to={`/login?redirect=/requirements/${id}&message=Please+login+to+apply`} className="btn-primary" style={{ flex: 1, background: '#3B4DE8', padding: '16px', fontSize: 16, borderRadius: 12 }}>
                                    Login to Apply
                                </Link>
                            ) : isTutor && !hasApplied ? (
                                <button onClick={handleApply} disabled={applying} className="btn-primary" style={{ flex: 1, background: '#3B4DE8', padding: '16px', fontSize: 16, borderRadius: 12, opacity: applying ? 0.7 : 1 }}>
                                    {applying ? 'Submitting...' : 'Apply as Tutor'}
                                </button>
                            ) : hasApplied ? (
                                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', color: '#15803D', background: '#DCFCE7', padding: '16px', borderRadius: 12, fontWeight: 700, fontSize: 16, border: '1px solid #BBF7D0' }}>
                                    <CheckCircle size={20} style={{ marginRight: 8 }} /> Application Successful
                                </div>
                            ) : (
                                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', color: '#DC2626', background: '#FEF2F2', padding: '16px', borderRadius: 12, fontWeight: 600, fontSize: 15, border: '1px solid #FECACA' }}>
                                    Only Tutor accounts can apply
                                </div>
                            )}
                        </div>

                        <button style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            padding: '14px 24px', background: '#fff', border: '2px solid #E2E8F0',
                            color: '#475569', fontSize: 15, fontWeight: 600, borderRadius: 12,
                            cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0
                        }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.borderColor = '#CBD5E1'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
                        >
                            <Bookmark size={18} /> Save Requirement
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
