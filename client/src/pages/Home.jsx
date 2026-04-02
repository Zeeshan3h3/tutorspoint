import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Search, MapPin, BookOpen, ArrowRight, Star, Shield, Clock, Award, Users, Zap } from 'lucide-react';

const TRUST_ITEMS = [
    { icon: Shield, label: 'Verified Tutors', desc: 'All tutors manually vetted', color: '#2563EB', bg: '#EFF6FF' },
    { icon: Zap, label: 'No Commission', desc: 'Contact directly, zero fees', color: '#4F46E5', bg: '#EEF2FF' },
    { icon: MapPin, label: 'Local Experts', desc: 'Tutors in your neighborhood', color: '#10B981', bg: '#ECFDF5' },
    { icon: Clock, label: '2hr Response', desc: 'Fast tutor matching', color: '#F59E0B', bg: '#FFFBEB' },
    { icon: Users, label: 'Community', desc: 'Trust us across Kolkata', color: '#8B5CF6', bg: '#F5F3FF' },
    { icon: Award, label: 'Free Demo', desc: 'First class at no cost', color: '#06B6D4', bg: '#ECFEFF' },
];

// Removed TESTIMONIALS array due to placeholder data

const AREAS = ['Salt Lake', 'New Town', 'Dum Dum', 'Behala', 'Tollygunge', 'Gariahat', 'Ballygunge', 'Park Street', 'Howrah', 'Barasat', 'Topsia', 'Tiljala', 'Science City'];

// Removed STATS array due to static numbers

export default function Home() {
    const [subject, setSubject] = useState('');
    const [location, setLocation] = useState('');

    return (
        <div style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* ── HERO ── */}
            <section style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #EFF6FF 0%, #EEF2FF 50%, #F0FDF4 100%)',
                display: 'flex',
                alignItems: 'center',
                padding: '120px 24px 80px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative blobs */}
                <div style={{ position: 'absolute', top: '15%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '10%', left: '2%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
                        {/* Left */}
                        <div style={{ animation: 'fadeInUp 0.7s ease' }}>
                            <div className="badge badge-blue" style={{ marginBottom: 20, fontSize: 13 }}>
                                🎓 Trusted by 500+ families in Kolkata
                            </div>
                            <h1 style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: 'clamp(36px, 4vw, 58px)',
                                fontWeight: 800,
                                color: '#0F172A',
                                lineHeight: 1.15,
                                marginBottom: 20,
                            }}>
                                Give Your Child the{' '}
                                <span className="grad-text">Right Teacher</span>{' '}
                                at Home
                            </h1>
                            <p style={{ fontSize: 18, color: '#475569', lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
                                Trusted home tutors in Kolkata — verified, experienced, and ready to help your child excel academically.
                            </p>

                            {/* Smart Search Bar */}
                            <div className="glass" style={{ borderRadius: 20, padding: 20, marginBottom: 32, boxShadow: '0 8px 32px rgba(37,99,235,0.1)' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'center' }}>
                                    <div style={{ position: 'relative' }}>
                                        <BookOpen size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                        <select className="input-field" style={{ paddingLeft: 44 }} value={subject} onChange={e => setSubject(e.target.value)}>
                                            <option value="">Select Subject</option>
                                            {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Science', 'Computer'].map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <MapPin size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                        <input className="input-field" style={{ paddingLeft: 44 }} placeholder="Your area..." value={location} onChange={e => setLocation(e.target.value)} />
                                    </div>
                                    <Link to={`/tutors?subject=${subject}&location=${location}`} className="btn-primary pulse-glow" style={{ whiteSpace: 'nowrap' }}>
                                        <Search size={18} /> Find Tutor
                                    </Link>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 16 }}>
                                <Link to="/tutors" className="btn-primary">
                                    Find a Tutor <ArrowRight size={18} />
                                </Link>
                                <Link to="/post-requirement" className="btn-outline">
                                    Post Requirement
                                </Link>
                            </div>
                        </div>

                        {/* Right — Visual */}
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{
                                width: 420, height: 420, borderRadius: '50%',
                                background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(79,70,229,0.12))',
                                border: '2px solid rgba(37,99,235,0.12)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                position: 'relative', animation: 'float 4s ease-in-out infinite',
                            }}>
                                <div style={{ fontSize: 120 }}>👩‍🏫</div>

                                {/* Floating stat badges removed */}
                            </div>
                        </div>
                    </div>

                    {/* Stats bar removed */}
                </div>
            </section>

            {/* ── REQUIREMENTS BOARD PROMO STRIP ── */}
            <section style={{ background: 'linear-gradient(90deg, #1E40AF, #4F46E5)', padding: '40px 24px' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: window.innerWidth < 640 ? 'column' : 'row', alignItems: 'center', justifyContent: 'space-between', gap: 24, textAlign: window.innerWidth < 640 ? 'center' : 'left' }}>
                    <div>
                        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 4 }}>📋 Live Tuition Requirements Board</h2>
                        <p style={{ color: '#DBEAFE', fontSize: 14 }}>Students &amp; parents are posting live requirements right now. Tutors — apply directly!</p>
                    </div>
                    <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
                        <Link to="/requirements" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#1D4ED8', fontWeight: 700, padding: '12px 20px', borderRadius: 12, boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textDecoration: 'none', fontSize: 14 }}>
                            👨‍🏫 Browse Requirements
                        </Link>
                        <Link to="/post-requirement" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(30,58,138,0.4)', backdropFilter: 'blur(8px)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', fontWeight: 700, padding: '12px 20px', borderRadius: 12, textDecoration: 'none', fontSize: 14 }}>
                            📝 Post a Requirement
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── TRUST SECTION ── */}
            <section style={{ padding: '96px 24px', background: '#fff' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div className="section-header">
                        <div className="section-label">Why TutorsPoint?</div>
                        <h2 className="section-title">The Safest Way to Find a Home Tutor</h2>
                        <p className="section-subtitle">We've designed every step to give parents peace of mind and tutors a fair platform to earn.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                        {TRUST_ITEMS.map(({ icon: Icon, label, desc, color, bg }) => (
                            <div key={label} className="card" style={{ padding: '32px 24px', textAlign: 'center' }}>
                                <div style={{
                                    width: 60, height: 60, borderRadius: 16,
                                    background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 16px',
                                }}>
                                    <Icon size={28} color={color} />
                                </div>
                                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>{label}</h3>
                                <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6 }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section style={{ padding: '80px 24px', background: 'linear-gradient(135deg, #F8FAFC, #EEF2FF)' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div className="section-header">
                        <div className="section-label">Simple Process</div>
                        <h2 className="section-title">Get a Tutor in 3 Easy Steps</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
                        {[
                            { step: '01', title: 'Post Your Requirement', desc: 'Tell us your subject, class, budget, and preferred area. It takes just 2 minutes.', icon: '📝' },
                            { step: '02', title: 'We Match You', desc: 'Our team reviews your requirement and connects you with the best available tutors.', icon: '🎯' },
                            { step: '03', title: 'Start Learning', desc: 'Meet your tutor, attend a free demo class, and start the learning journey!', icon: '🚀' },
                        ].map(({ step, title, desc, icon }) => (
                            <div key={step} style={{ textAlign: 'center', padding: 32 }}>
                                <div style={{
                                    width: 72, height: 72, borderRadius: '50%',
                                    background: 'linear-gradient(135deg,#2563EB,#4F46E5)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 20px', fontSize: 28, boxShadow: '0 8px 24px rgba(37,99,235,0.3)'
                                }}>
                                    {icon}
                                </div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: '#2563EB', letterSpacing: 2, marginBottom: 8 }}>STEP {step}</div>
                                <h3 style={{ fontSize: 19, fontWeight: 700, color: '#0F172A', marginBottom: 12 }}>{title}</h3>
                                <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7 }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: 40 }}>
                        <Link to="/post-requirement" className="btn-primary" style={{ fontSize: 16, padding: '16px 36px' }}>
                            Post Your Requirement Free <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS REMOVED ── */}            {/* ── LOCAL AREAS ── */}
            <section style={{ padding: '80px 24px', background: 'linear-gradient(135deg, #F8FAFC, #EFF6FF)' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
                    <div className="section-label">Coverage</div>
                    <h2 className="section-title" style={{ marginBottom: 16 }}>Serving All Areas in Kolkata</h2>
                    <p className="section-subtitle" style={{ marginBottom: 40 }}>Our network of tutors covers every major locality across the city.</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                        {AREAS.map(area => (
                            <Link key={area} to={`/tutors?location=${area}`} style={{
                                padding: '10px 20px', borderRadius: 999,
                                background: '#fff', border: '1.5px solid #E2E8F0',
                                fontSize: 14, fontWeight: 600, color: '#374151',
                                textDecoration: 'none', transition: 'all 0.2s',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                            }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.color = '#2563EB'; e.currentTarget.style.background = '#EFF6FF'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#374151'; e.currentTarget.style.background = '#fff'; }}>
                                📍 {area}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TUTOR CTA ── */}
            <section style={{ padding: '96px 24px', background: 'linear-gradient(135deg, #1E40AF, #4F46E5)' }}>
                <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>👨‍🏫</div>
                    <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 36, color: '#fff', marginBottom: 16 }}>Are You a Tutor?</h2>
                    <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', marginBottom: 36, lineHeight: 1.7 }}>
                        Join 100+ verified tutors earning steadily through TutorsPoint. Create your free profile and start getting students in your area today.
                    </p>
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/signup" style={{
                            background: '#fff', color: '#2563EB', padding: '16px 36px',
                            borderRadius: 12, fontWeight: 700, fontSize: 16, textDecoration: 'none',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.2)', transition: 'all 0.2s'
                        }}>
                            Join as a Tutor — It's Free
                        </Link>
                        <Link to="/tutors" style={{
                            border: '2px solid rgba(255,255,255,0.5)', color: '#fff',
                            padding: '16px 36px', borderRadius: 12, fontWeight: 700, fontSize: 15,
                            textDecoration: 'none', transition: 'all 0.2s'
                        }}>
                            Browse Tutors First
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer style={{ background: '#0F172A', color: '#94A3B8', padding: '48px 24px', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#2563EB,#4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#fff', fontSize: 14 }}>🎓</span>
                    </div>
                    <span style={{ fontFamily: 'Poppins', fontWeight: 700, color: '#fff', fontSize: 16 }}>TutorsPoint Kolkata</span>
                </div>
                <p style={{ fontSize: 14 }}>Connecting students with trusted home tutors across Kolkata.</p>
                <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
                    {[['/', 'Home'], ['/tutors', 'Find Tutors'], ['/post-requirement', 'Post Requirement'], ['/signup', 'Become a Tutor']].map(([to, label]) => (
                        <Link key={to} to={to} style={{ color: '#64748B', textDecoration: 'none', fontSize: 13, transition: 'color 0.2s' }}>{label}</Link>
                    ))}
                </div>
                <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #1E293B', fontSize: 12 }}>
                    © 2026 TutorsPoint Kolkata. All rights reserved.
                </div>
            </footer>

            {/* ── WHATSAPP FLOAT ── */}
            <a href="https://wa.me/919088260058?text=Hi%20TutorsPoint%2C%20I%20need%20a%20tutor" target="_blank" rel="noopener noreferrer" className="whatsapp-float">
                <span style={{ fontSize: 22 }}>💬</span>
                Chat with us
            </a>
        </div>
    );
}
