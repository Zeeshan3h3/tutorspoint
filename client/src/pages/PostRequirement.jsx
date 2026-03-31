import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, MapPin, Clock, Phone, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const STEPS = [
    { id: 1, label: 'Class & Subject', icon: BookOpen },
    { id: 2, label: 'Budget & Area', icon: MapPin },
    { id: 3, label: 'Contact & Timing', icon: Phone },
];

const CLASSES = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Science', 'History', 'Bengali', 'Hindi', 'Computer Science', 'Geography'];
const AREAS = ['Salt Lake', 'New Town', 'Dum Dum', 'Behala', 'Tollygunge', 'Park Street', 'Howrah', 'Ballygunge', 'Gariahat', 'Barasat', 'Topsia', 'Tiljala', 'Science City', 'Other'];

const BOARDS = ['CBSE', 'ICSE', 'State Board', 'IGCSE', 'Any Board'];
const MEDIUMS = ['English', 'Bengali', 'Hindi', 'Any Medium'];
const DAYS = [1, 2, 3, 4, 5, 6];

export default function PostRequirement() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Auth guard immediately
    if (!user) {
        navigate('/login?redirect=/post-requirement&message=Please+login+to+post+a+requirement');
        return null;
    }

    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        classLevel: '',
        board: '',
        medium: '',
        subjects: [],
        budgetMin: '',
        budgetMax: '',
        daysPerWeek: '',
        sessionsPerMonth: '12',
        area: '',
        pinCode: '',
        classMode: '',
        genderPreference: 'No Preference',
        startTiming: 'Flexible',
        contactType: 'Parent',
        phone: '',
        message: ''
    });

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const toggleSubject = (s) => {
        setForm(prev => ({
            ...prev,
            subjects: prev.subjects.includes(s)
                ? prev.subjects.filter(x => x !== s)
                : [...prev.subjects, s],
        }));
    };

    const canNext = () => {
        if (step === 1) return form.classLevel && form.board && form.medium && form.subjects.length > 0;
        if (step === 2) return form.budgetMin && form.budgetMax && form.area && form.classMode && form.daysPerWeek;
        if (step === 3) return form.phone;
        return true;
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            await api.post('/requirement', {
                ...form,
                budgetMin: Number(form.budgetMin),
                budgetMax: Number(form.budgetMax),
                sessionsPerMonth: Number(form.sessionsPerMonth),
            });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', padding: 24 }}>
            <div style={{ textAlign: 'center', maxWidth: 480 }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#059669,#10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 8px 24px rgba(16,185,129,0.3)' }}>
                    <CheckCircle size={40} color="#fff" />
                </div>
                <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 28, color: '#0F172A', marginBottom: 12 }}>Requirement Submitted!</h2>
                <p style={{ color: '#64748B', fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
                    Your tuition requirement is going live. Tutors in <strong>{form.area}</strong> will be able to see it and apply directly.
                </p>
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                    <button onClick={() => navigate('/requirements')} className="btn-primary" style={{ padding: '12px 24px' }}>View Requirements Board</button>
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', padding: '100px 24px 60px' }}>
            <div style={{ maxWidth: 640, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div className="section-label">Post Requirement</div>
                    <h1 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 32, color: '#0F172A', marginBottom: 8 }}>Find the Right Tutor</h1>
                    <p style={{ color: '#64748B', fontSize: 15 }}>Fill in a few details and we'll match you with the perfect tutor in your area.</p>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: 40 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                        <div style={{
                            position: 'absolute', top: 20, left: '10%', right: '10%', height: 2,
                            background: '#E2E8F0', borderRadius: 2, zIndex: 0
                        }}>
                            <div style={{ height: '100%', width: `${((step - 1) / (STEPS.length - 1)) * 100}%`, background: 'linear-gradient(90deg,#2563EB,#4F46E5)', borderRadius: 2, transition: 'width 0.4s ease' }} />
                        </div>
                        {STEPS.map(({ id, label, icon: Icon }) => (
                            <div key={id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative', zIndex: 1 }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: '50%', marginBottom: 8,
                                    background: id <= step ? 'linear-gradient(135deg,#2563EB,#4F46E5)' : '#fff',
                                    border: `2px solid ${id <= step ? '#2563EB' : '#E2E8F0'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.3s', boxShadow: id === step ? '0 4px 12px rgba(37,99,235,0.3)' : 'none'
                                }}>
                                    <Icon size={18} color={id <= step ? '#fff' : '#94A3B8'} />
                                </div>
                                <span style={{ fontSize: 11, fontWeight: 600, color: id === step ? '#2563EB' : '#94A3B8', textAlign: 'center' }}>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass" style={{ borderRadius: 24, padding: 36, boxShadow: '0 8px 32px rgba(37,99,235,0.08)' }}>

                    {/* STEP 1 */}
                    {step === 1 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <h3 style={{ fontWeight: 700, fontSize: 20, color: '#0F172A' }}>📚 Class & Subject</h3>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>Class / Level *</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {CLASSES.map(c => (
                                        <button key={c} type="button" onClick={() => update('classLevel', c)} style={{
                                            padding: '8px 16px', borderRadius: 999, border: '1.5px solid', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
                                            borderColor: form.classLevel === c ? '#2563EB' : '#E2E8F0',
                                            background: form.classLevel === c ? '#EFF6FF' : '#fff',
                                            color: form.classLevel === c ? '#2563EB' : '#374151',
                                        }}>{c}</button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>Board / Curriculum *</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {BOARDS.map(b => (
                                        <button key={b} type="button" onClick={() => update('board', b)} style={{
                                            padding: '8px 16px', borderRadius: 999, border: '1.5px solid', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
                                            borderColor: form.board === b ? '#2563EB' : '#E2E8F0',
                                            background: form.board === b ? '#EFF6FF' : '#fff',
                                            color: form.board === b ? '#2563EB' : '#374151',
                                        }}>{b}</button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>Medium of Instruction *</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {MEDIUMS.map(m => (
                                        <button key={m} type="button" onClick={() => update('medium', m)} style={{
                                            padding: '8px 16px', borderRadius: 999, border: '1.5px solid', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
                                            borderColor: form.medium === m ? '#2563EB' : '#E2E8F0',
                                            background: form.medium === m ? '#EFF6FF' : '#fff',
                                            color: form.medium === m ? '#2563EB' : '#374151',
                                        }}>{m}</button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>
                                    Subjects Required * <span style={{ color: '#9A3A3A', fontWeight: 'normal' }}>(Select multiple if needed)</span>
                                </label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {SUBJECTS.map(s => (
                                        <button key={s} type="button" onClick={() => toggleSubject(s)} style={{
                                            padding: '8px 16px', borderRadius: 999, border: '1.5px solid', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
                                            borderColor: form.subjects.includes(s) ? '#2563EB' : '#E2E8F0',
                                            background: form.subjects.includes(s) ? '#EFF6FF' : '#fff',
                                            color: form.subjects.includes(s) ? '#2563EB' : '#374151',
                                        }}>{form.subjects.includes(s) ? '✓ ' : ''}{s}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <h3 style={{ fontWeight: 700, fontSize: 20, color: '#0F172A' }}>💰 Budget & Location</h3>

                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>Monthly Budget Range (₹) *</label>
                                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                                    <input type="number" className="input-field" placeholder="Min (e.g. 2000)" value={form.budgetMin} onChange={e => update('budgetMin', e.target.value)} />
                                    <span>to</span>
                                    <input type="number" className="input-field" placeholder="Max (e.g. 5000)" value={form.budgetMax} onChange={e => update('budgetMax', e.target.value)} />
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>Days Per Week *</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {DAYS.map(d => (
                                        <button key={d} type="button" onClick={() => update('daysPerWeek', d)} style={{
                                            padding: '8px 16px', borderRadius: 12, border: '1.5px solid', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
                                            borderColor: form.daysPerWeek === d ? '#2563EB' : '#E2E8F0',
                                            background: form.daysPerWeek === d ? '#EFF6FF' : '#fff',
                                            color: form.daysPerWeek === d ? '#2563EB' : '#374151',
                                        }}>{d} Day{d > 1 ? 's' : ''}</button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>Class Mode *</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {['Home Tuition', "Tutor's Place", 'Online'].map(m => (
                                        <button key={m} type="button" onClick={() => update('classMode', m)} style={{
                                            padding: '10px 16px', borderRadius: 12, border: '1.5px solid', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
                                            borderColor: form.classMode === m ? '#2563EB' : '#E2E8F0',
                                            background: form.classMode === m ? '#EFF6FF' : '#fff',
                                            color: form.classMode === m ? '#2563EB' : '#374151',
                                        }}>{m}</button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 16 }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>Your Area *</label>
                                    <select className="input-field" value={form.area} onChange={e => update('area', e.target.value)}>
                                        <option value="">Select area</option>
                                        {AREAS.map(a => <option key={a}>{a}</option>)}
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>PIN Code</label>
                                    <input type="text" className="input-field" placeholder="e.g. 700091" maxLength={6} value={form.pinCode} onChange={e => update('pinCode', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <h3 style={{ fontWeight: 700, fontSize: 20, color: '#0F172A' }}>📞 Contact & Preferences</h3>

                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>Contact Number * <span style={{ color: '#94A3B8', fontWeight: 'normal' }}>(Masked publicly)</span></label>
                                <div style={{ position: 'relative' }}>
                                    <Phone size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                    <input type="tel" className="input-field" style={{ paddingLeft: 44 }} placeholder="+91 98000 00000"
                                        value={form.phone} onChange={e => update('phone', e.target.value)} required />
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>Preferred Tutor Gender</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {['No Preference', 'Male', 'Female'].map(g => (
                                        <button key={g} type="button" onClick={() => update('genderPreference', g)} style={{
                                            padding: '8px 16px', borderRadius: 12, border: '1.5px solid', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
                                            borderColor: form.genderPreference === g ? '#2563EB' : '#E2E8F0',
                                            background: form.genderPreference === g ? '#EFF6FF' : '#fff',
                                            color: form.genderPreference === g ? '#2563EB' : '#374151',
                                        }}>{g}</button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>Additional Message <span style={{ color: '#94A3B8', fontWeight: 'normal' }}>(Optional)</span></label>
                                <textarea className="input-field" rows={3} placeholder="e.g. Preparing for boards, need female tutor only..."
                                    value={form.message} onChange={e => update('message', e.target.value)} />
                            </div>

                            {error && <div style={{ color: '#DC2626', fontSize: 13, background: '#FEF2F2', padding: '10px 14px', borderRadius: 8 }}>{error}</div>}
                        </div>
                    )}

                    {/* Nav Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, gap: 12 }}>
                        <button onClick={() => step > 1 && setStep(s => s - 1)} disabled={step === 1} className="btn-outline" style={{ padding: '12px 24px', opacity: step === 1 ? 0 : 1, pointerEvents: step === 1 ? 'none' : 'auto' }}>
                            <ArrowLeft size={18} /> Back
                        </button>

                        {step < STEPS.length ? (
                            <button onClick={() => canNext() && setStep(s => s + 1)}
                                disabled={!canNext()}
                                className="btn-primary" style={{ padding: '12px 28px', opacity: canNext() ? 1 : 0.5 }}>
                                Continue <ArrowRight size={18} />
                            </button>
                        ) : (
                            <button onClick={handleSubmit} disabled={!canNext() || loading} className="btn-primary" style={{ padding: '12px 28px', opacity: (canNext() && !loading) ? 1 : 0.5 }}>
                                {loading ? 'Submitting...' : '🚀 Submit Requirement'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
