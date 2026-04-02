import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, BookOpen, Monitor, Home, User, Eye, Clock, IndianRupee, ChevronRight, Loader2, Lock, UserCheck, BadgeCheck, Coins, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const getRelativeTime = (dateString) => {
    if (!dateString) return '';
    const days = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Posted today';
    if (days === 1) return 'Posted yesterday';
    return `Posted ${days} days ago`;
};

const ModeIcon = ({ mode }) => {
    if (mode === 'Online') return <Monitor size={14} color="#3B82F6" />;
    if (mode === "Tutor's Place") return <UserCheck size={14} color="#8B5CF6" />;
    return <Home size={14} color="#F59E0B" />;
};

export default function RequirementCard({ req, onApplied }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [applying, setApplying] = useState(false);

    // Fallbacks if data is missing
    const appliedTutors = req.appliedTutors || [];
    // Only check user id if user exists
    const hasApplied = user && appliedTutors.some(id => id === user._id || id === user.id);
    const [applied, setApplied] = useState(hasApplied);
    const [phone, setPhone] = useState(req.phone || 'Phone hidden');

    // Scarcity & Locking Logic
    const slotsLeft = Math.max(0, (req.maxUnlocks || 5) - (req.unlockedBy?.length || 0));
    const isFull = req.isLocked || slotsLeft === 0;

    // Escrow Timer
    const [timeLeft, setTimeLeft] = useState(req.escrowRemainingMs || 0);

    useEffect(() => {
        if (!req.isEscrowed) return;
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1000) {
                    clearInterval(interval);
                    return 0; // Unlock mechanically on the front-end when it hits 0
                }
                return prev - 1000;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [req.isEscrowed]);

    const formatTime = (ms) => {
        const mins = Math.floor(ms / 60000);
        const secs = Math.floor((ms % 60000) / 1000);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const isCurrentlyEscrowed = req.isEscrowed && timeLeft > 0;

    // Only tutors can apply. Users have roles in our DB. Let's assume role is tutor.
    // If not tutor, we can disable or hide. We'll show apply to everyone, but block on click.
    const isTutor = user?.role === 'tutor';

    const handleApply = async () => {
        if (!user) {
            navigate('/login?redirect=/requirements&message=Please+login+to+continue');
            return;
        }
        if (!isTutor) {
            alert('Only tutors can apply to requirements.');
            return;
        }

        setApplying(true);
        try {
            const { data } = await api.post(`/requirement/${req._id}/apply`);
            setApplied(true);
            if (data.requirement?.phone) {
                setPhone(data.requirement.phone);
            }
            onApplied?.(req._id);
        } catch (err) {
            alert(err.response?.data?.message || 'Could not apply. Please try again.');
        } finally {
            setApplying(false);
        }
    };

    return (
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', transition: 'all 0.2s', filter: isFull ? 'grayscale(1)' : 'none', opacity: isFull ? 0.8 : 1, ':hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' } }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyItems: 'space-between', gap: 12, marginBottom: 16 }}>
                <div style={{ display: 'flex', flex: 1, gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #3B4DE8, #4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: 16, flexShrink: 0 }}>
                        {req.postedByName?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#0F172A', fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                            {req.postedByName || 'Student'}
                            {req.isVerified && <BadgeCheck size={16} color="#3B82F6" />}
                        </p>
                        <p style={{ fontSize: 12, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6, margin: '4px 0 0' }}>
                            {getRelativeTime(req.createdAt)}
                            <span>•</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} /> {req.area || 'Kolkata'}</span>
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    <span style={{ flexShrink: 0, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} /> Active
                    </span>
                    <span style={{ flexShrink: 0, fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: req.contactType === 'Parent' ? '#EFF6FF' : '#F1F5F9', color: req.contactType === 'Parent' ? '#1D4ED8' : '#475569', border: '1px solid #E2E8F0' }}>
                        {req.contactType === 'Parent' ? 'Parent' : 'Student'}
                    </span>
                </div>
            </div>

            {/* Academic Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <BookOpen size={16} color="#2563EB" />
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{req.classLevel || 'Not specified'}</span>
                    {req.board && <span style={{ fontSize: 11, color: '#475569', background: '#F1F5F9', padding: '2px 8px', borderRadius: 6, fontWeight: 500 }}>{req.board}</span>}
                    {req.medium && <span style={{ fontSize: 11, color: '#475569', background: '#F1F5F9', padding: '2px 8px', borderRadius: 6, fontWeight: 500 }}>{req.medium}</span>}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {(req.subjects || []).map(s => (
                        <span key={s} style={{ background: '#F8FAFC', color: '#2563EB', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999, border: '1px solid #E2E8F0' }}>{s}</span>
                    ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748B' }}>
                    <ModeIcon mode={req.classMode} /> {req.classMode || 'Any mode'}
                </div>
            </div>

            {/* Budget */}
            <div style={{ background: 'linear-gradient(to right, #FFFBEB, #FEF3C7)', borderRadius: 12, padding: '10px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <IndianRupee size={16} color="#D97706" />
                <div>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#111827' }}>
                        ₹{req.budgetMin?.toLocaleString('en-IN') || 0} – ₹{req.budgetMax?.toLocaleString('en-IN') || req.budget || 0}
                    </span>
                    <span style={{ fontSize: 11, color: '#6B7280', marginLeft: 4 }}>/ month</span>
                    <span style={{ fontSize: 11, color: '#9CA3AF', marginLeft: 4 }}>
                        ({req.daysPerWeek ? `${req.daysPerWeek} days/week` : `${req.sessionsPerMonth || 12} sessions`})
                    </span>
                </div>
            </div>

            {/* Prefs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, fontSize: 12, color: '#64748B' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>👥 {req.genderPreference || 'No Pref'}</span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {req.startTiming || 'Flexible'}</span>
            </div>

            {/* Message */}
            {req.message && (
                <p style={{ fontSize: 12, color: '#94A3B8', fontStyle: 'italic', background: '#F8FAFC', padding: '8px 12px', borderRadius: 8, marginBottom: 16, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    "{req.message}"
                </p>
            )}

            {/* Phone */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748B', marginBottom: 16 }}>
                <Lock size={12} />
                <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#334155', letterSpacing: 1 }}>{phone}</span>
                {!applied && <span style={{ color: '#94A3B8' }}>(visible after applying)</span>}
            </div>

            {/* Footer Stats */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, color: '#64748B', marginBottom: 16, borderTop: '1px solid #F1F5F9', paddingTop: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#F8FAFC', padding: '4px 10px', borderRadius: 8, fontWeight: 700, color: '#0F172A', border: '1px solid #E2E8F0' }}>
                        <Coins size={14} color="#F59E0B" /> {req.costToUnlock || 10} Credits
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600, color: isFull ? '#DC2626' : (slotsLeft <= 2 ? '#F59E0B' : '#10B981') }}>
                    <User size={14} /> {slotsLeft} {slotsLeft === 1 ? 'Slot' : 'Slots'} Left
                </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 8 }}>
                <Link to={`/requirements/${req._id}`} style={{ flex: 1, padding: '10px', borderRadius: 10, background: '#fff', border: '2px solid #E2E8F0', color: '#475569', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, textDecoration: 'none' }}>
                    Details <ChevronRight size={14} />
                </Link>

                {!user ? (
                    <button onClick={() => navigate('/login?redirect=/requirements&message=Please+login+to+continue')} style={{ flex: 1, padding: '10px', borderRadius: 10, background: 'linear-gradient(135deg, #2563EB, #4F46E5)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                        Unlock Lead
                    </button>
                ) : isTutor ? (
                    <button
                        onClick={handleApply}
                        disabled={applying || applied || isFull || isCurrentlyEscrowed}
                        style={{ flex: 1, padding: '10px', borderRadius: 10, background: applied ? '#DCFCE7' : isFull ? '#F1F5F9' : isCurrentlyEscrowed ? '#FFFBEB' : 'linear-gradient(135deg, #2563EB, #4F46E5)', border: applied ? '2px solid #BBF7D0' : isFull ? '1px solid #E2E8F0' : 'none', color: applied ? '#15803D' : (isFull ? '#64748B' : isCurrentlyEscrowed ? '#B45309' : '#fff'), fontSize: 13, fontWeight: 700, cursor: (applying || applied || isFull || isCurrentlyEscrowed) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                    >
                        {applying ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Unlocking...</>
                            : applied ? '✓ Unlocked'
                                : isFull ? '🔒 Lead Full'
                                    : isCurrentlyEscrowed ? `⭐ Pro Access (${formatTime(timeLeft)})`
                                        : `Unlock for ${req.costToUnlock || 10} Cr`}
                    </button>
                ) : null}
            </div>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
