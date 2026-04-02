import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Check, X, AlertOctagon, Clock, ShieldCheck, GraduationCap, MapPin, CheckSquare, AlertTriangle } from 'lucide-react';

const BASE_URL = 'http://localhost:5000';

// ─── Utility: safe string fallback ───────────────────────────────────────────
const val = (v, fallback = '—') => (v !== undefined && v !== null && v !== '') ? v : fallback;

export default function AdminTutorReview() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [checklist, setChecklist] = useState({ identity: false, academic: false, teaching: false, bio: false });

    useEffect(() => {
        api.get(`/admin/tutors/${id}/review`)
            .then(res => {
                setData(res.data.data);
                const cl = res.data.data?.tutor?.adminChecklist;
                if (cl) setChecklist({ identity: !!cl.identityChecked, academic: !!cl.academicChecked, teaching: !!cl.teachingChecked, bio: !!cl.qualityChecked });
            })
            .catch(err => console.error('Failed to load review data', err))
            .finally(() => setLoading(false));
    }, [id]);

    const handleAction = async (newStatus) => {
        setUpdating(true);
        try {
            await api.patch(`/admin/tutors/${id}/review`, {
                status: newStatus,
                verificationNote: `Admin ${newStatus} after review.`,
                adminChecklist: { identityChecked: checklist.identity, academicChecked: checklist.academic, teachingChecked: checklist.teaching, qualityChecked: checklist.bio }
            });
            navigate('/admin-dashboard');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
            <div style={{ textAlign: 'center', color: '#64748B' }}>Loading review data...</div>
        </div>
    );

    if (!data) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
            <p style={{ color: '#EF4444' }}>Tutor not found.</p>
        </div>
    );

    const { tutor } = data;
    const isReReview = !!tutor?.lastCriticalUpdateAt;
    const allChecked = Object.values(checklist).every(Boolean);
    const score = tutor?.completenessScore ?? 0;
    const tutorName = tutor?.userId?.name || 'Unknown';
    const tutorEmail = tutor?.userId?.email || '—';

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', padding: '32px 24px' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>

                {/* ── Page Header ─────────────────────────────────────────── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid #E2E8F0' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                            <h1 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 28, color: '#0F172A', margin: 0 }}>Tutor Verification</h1>
                            {isReReview && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FEE2E2', color: '#B91C1C', padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                    <AlertOctagon size={11} /> Re-Review
                                </span>
                            )}
                        </div>
                        <p style={{ color: '#64748B', fontSize: 14, margin: 0 }}>Reviewing <strong>{tutorName}</strong>'s profile and qualifications.</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Current Status</div>
                        <span style={{ padding: '6px 16px', borderRadius: 999, fontSize: 13, fontWeight: 700, background: tutor?.status === 'APPROVED' ? '#DCFCE7' : '#FEF9C3', color: tutor?.status === 'APPROVED' ? '#166534' : '#854d0e', border: `1px solid ${tutor?.status === 'APPROVED' ? '#BBF7D0' : '#FDE68A'}` }}>
                            {val(tutor?.status, 'UNKNOWN')}
                        </span>
                    </div>
                </div>

                {/* ── Main Grid ───────────────────────────────────────────── */}
                <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24 }}>

                    {/* LEFT COLUMN */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                        {/* Identity Card */}
                        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E2E8F0', padding: 28, textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                            {isReReview && (
                                <div style={{ position: 'absolute', top: 0, right: 0, background: '#EF4444', color: '#fff', padding: '6px 10px', borderBottomLeftRadius: 12, fontSize: 12 }}>
                                    <Clock size={14} />
                                </div>
                            )}
                            {tutor?.profileImage ? (
                                <img src={`${BASE_URL}${tutor.profileImage}`} alt={tutorName} style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: '3px solid #EFF6FF', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', margin: '0 auto 16px' }} />
                            ) : (
                                <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 36, margin: '0 auto 16px', boxShadow: '0 4px 12px rgba(37,99,235,0.25)' }}>
                                    {tutorName[0]}
                                </div>
                            )}
                            <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 18, color: '#0F172A', marginBottom: 4 }}>{tutorName}</div>
                            <div style={{ fontSize: 13, color: '#64748B', marginBottom: 20 }}>{tutorEmail}</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <MetricBox label="Completeness" value={`${score}%`} color="#2563EB" />
                                <MetricBox label="Credits" value={val(tutor?.credits, '0')} color="#10B981" />
                            </div>
                        </div>

                        {/* Assist Indicators */}
                        <div style={{ background: '#FFF5F5', borderRadius: 20, border: '1px solid #FED7D7', padding: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                <AlertTriangle size={15} style={{ color: '#C53030' }} />
                                <span style={{ fontSize: 11, fontWeight: 800, color: '#C53030', textTransform: 'uppercase', letterSpacing: 0.5 }}>Assist Indicators</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <Indicator label="Photo Provided" ok={!!tutor?.profileImage} />
                                <Indicator label="Bio Depth (100+ chars)" ok={(tutor?.bio?.length || 0) > 100} />
                                <Indicator label="Intro Video Added" ok={!!tutor?.introVideoUrl} />
                                <Indicator label="ID Proof Uploaded" ok={!!tutor?.idProofUrl} />
                            </div>
                        </div>

                        {/* Human Checklist */}
                        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E2E8F0', padding: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                <CheckSquare size={16} style={{ color: '#10B981' }} />
                                <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Human Review Checklist</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <CheckItem checked={checklist.identity} onChange={() => setChecklist(c => ({ ...c, identity: !c.identity }))} label="Photo is Professional" />
                                <CheckItem checked={checklist.academic} onChange={() => setChecklist(c => ({ ...c, academic: !c.academic }))} label="College Details Valid" />
                                <CheckItem checked={checklist.teaching} onChange={() => setChecklist(c => ({ ...c, teaching: !c.teaching }))} label="Subjects & Area are Local" />
                                <CheckItem checked={checklist.bio} onChange={() => setChecklist(c => ({ ...c, bio: !c.bio }))} label="Bio is Well-Written" />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                        {/* Profile Details */}
                        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E2E8F0', padding: 28, boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 24, margin: '0 0 24px' }}>Profile Details</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                                <InfoBlock icon={<GraduationCap size={18} color="#2563EB" />} bg="#EFF6FF" label="Academic" main={`${val(tutor?.degree)} from ${val(tutor?.college)}`} sub={tutor?.experience ? `${tutor.experience} year(s) experience` : 'Experience not provided'} />
                                <InfoBlock icon={<MapPin size={18} color="#10B981" />} bg="#ECFDF5" label="Location" main={val(tutor?.area)} sub={`${val(tutor?.teachingRadius, '?')}km radius | ${val(tutor?.teachingMode, 'Mode not set')}`} />
                            </div>

                            {/* Tags Row */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                                {(tutor?.subjects || []).map(s => (
                                    <span key={s} style={{ padding: '4px 12px', background: '#EFF6FF', color: '#1D4ED8', borderRadius: 999, fontSize: 12, fontWeight: 700, border: '1px solid #DBEAFE' }}>{s}</span>
                                ))}
                                {(tutor?.classesHandled || []).map(c => (
                                    <span key={c} style={{ padding: '4px 12px', background: '#F5F3FF', color: '#5B21B6', borderRadius: 999, fontSize: 12, fontWeight: 700, border: '1px solid #EDE9FE' }}>{c}</span>
                                ))}
                                {(!tutor?.subjects?.length && !tutor?.classesHandled?.length) && (
                                    <span style={{ color: '#94A3B8', fontSize: 13, fontStyle: 'italic' }}>No subjects or classes set.</span>
                                )}
                            </div>

                            {/* Bio */}
                            {tutor?.bio ? (
                                <div style={{ background: '#F8FAFC', borderRadius: 12, padding: 16, borderLeft: '3px solid #2563EB' }}>
                                    <div style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Self Introduction</div>
                                    <p style={{ color: '#334155', fontSize: 14, lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>"{tutor.bio}"</p>
                                </div>
                            ) : (
                                <div style={{ background: '#F8FAFC', borderRadius: 12, padding: 16, color: '#94A3B8', fontSize: 14, fontStyle: 'italic' }}>No bio provided.</div>
                            )}
                        </div>

                        {/* Audit Trail */}
                        {tutor?.changeLog?.length > 0 && (
                            <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E2E8F0', padding: 28, boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                                    <Clock size={16} style={{ color: '#2563EB' }} />
                                    <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: 0.5, margin: 0 }}>Audit Trail</h3>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 320, overflowY: 'auto' }}>
                                    {tutor.changeLog.slice().reverse().map((log, idx) => (
                                        <div key={idx} style={{ background: '#F8FAFC', borderRadius: 12, padding: 16, border: '1px solid #E2E8F0' }}>
                                            <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>{new Date(log.changedAt).toLocaleString()}</div>
                                            <div style={{ display: 'inline-block', background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, padding: '2px 10px', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 10 }}>{log.field}</div>
                                            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                                <div style={{ flex: 1, background: '#FEF2F2', color: '#B91C1C', padding: '8px 12px', borderRadius: 8, fontSize: 12, textDecoration: 'line-through', opacity: 0.7 }}>
                                                    {JSON.stringify(log.oldValue) || 'null'}
                                                </div>
                                                <span style={{ color: '#CBD5E1', fontSize: 16 }}>→</span>
                                                <div style={{ flex: 1, background: '#F0FDF4', color: '#166534', padding: '8px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
                                                    {JSON.stringify(log.newValue) || 'null'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Bar */}
                        <div style={{ background: '#0F172A', borderRadius: 20, padding: '24px 28px', display: 'flex', gap: 16, alignItems: 'center', boxShadow: '0 10px 30px rgba(15,23,42,0.2)' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
                                    {allChecked ? '✅ All checks cleared — ready to decide.' : '⚠️ Complete the checklist before approving.'}
                                </div>
                                <div style={{ color: '#64748B', fontSize: 13 }}>Approved tutors get immediate lead access.</div>
                            </div>
                            <button
                                onClick={() => handleAction('APPROVED')}
                                disabled={updating || !allChecked}
                                style={{ display: 'flex', alignItems: 'center', gap: 8, background: allChecked ? '#10B981' : '#334155', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 14, fontWeight: 800, fontSize: 14, cursor: allChecked && !updating ? 'pointer' : 'not-allowed', transition: 'background 0.2s', boxShadow: allChecked ? '0 4px 12px rgba(16,185,129,0.3)' : 'none' }}
                            >
                                <ShieldCheck size={18} /> {updating ? 'Saving...' : 'Approve'}
                            </button>
                            <button
                                onClick={() => handleAction('REJECTED')}
                                disabled={updating}
                                style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#EF4444', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 14, fontWeight: 800, fontSize: 14, cursor: !updating ? 'pointer' : 'not-allowed', boxShadow: '0 4px 12px rgba(239,68,68,0.3)' }}
                            >
                                <X size={18} /> Reject
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function MetricBox({ label, value, color }) {
    return (
        <div style={{ background: '#F8FAFC', borderRadius: 12, padding: '12px 8px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color }}>{value}</div>
        </div>
    );
}

function Indicator({ label, ok }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#4A5568' }}>{label}</span>
            {ok
                ? <Check size={15} style={{ color: '#10B981', flexShrink: 0 }} strokeWidth={2.5} />
                : <X size={15} style={{ color: '#FC8181', flexShrink: 0 }} strokeWidth={2.5} />
            }
        </div>
    );
}

function CheckItem({ checked, onChange, label }) {
    return (
        <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 12, border: `1.5px solid ${checked ? '#BBF7D0' : '#E2E8F0'}`, background: checked ? '#F0FDF4' : '#fff', cursor: 'pointer', transition: 'all 0.15s' }}>
            <input type="checkbox" style={{ display: 'none' }} checked={checked} onChange={onChange} />
            <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${checked ? '#10B981' : '#CBD5E1'}`, background: checked ? '#10B981' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                {checked && <Check size={12} style={{ color: '#fff' }} strokeWidth={3} />}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: checked ? '#166534' : '#475569' }}>{label}</span>
        </label>
    );
}

function InfoBlock({ icon, bg, label, main, sub }) {
    return (
        <div style={{ display: 'flex', gap: 14 }}>
            <div style={{ background: bg, padding: 10, borderRadius: 12, alignSelf: 'flex-start', flexShrink: 0 }}>{icon}</div>
            <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', marginBottom: 2 }}>{main}</div>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>{sub}</div>
            </div>
        </div>
    );
}
