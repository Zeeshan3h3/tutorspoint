import React from 'react';
import { Search, UserCheck, MessageCircle, BookOpen, ShieldCheck, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: 100, paddingBottom: 100 }}>
            {/* Hero Section */}
            <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto 60px', padding: '0 24px' }}>
                <div className="section-label">Simple & Transparent</div>
                <h1 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 40, color: '#0F172A', marginBottom: 16 }}>
                    How TutorsPoint Works
                </h1>
                <p style={{ color: '#64748B', fontSize: 18, lineHeight: 1.6, maxWidth: 600, margin: '0 auto' }}>
                    Whether you're looking for the perfect tutor or hoping to find great students, our platform makes the connection seamless and secure.
                </p>
            </div>

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40 }}>

                {/* For Parents & Students */}
                <div className="card" style={{ padding: 40, borderRadius: 24, borderTop: '4px solid #2563EB', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: -20, left: 40, background: '#2563EB', color: '#fff', padding: '8px 16px', borderRadius: 999, fontWeight: 700, fontSize: 14 }}>
                        For Parents & Students
                    </div>

                    <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 32, marginTop: 10 }}>Find Your Perfect Tutor</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                        {/* Step 1 */}
                        <div style={{ display: 'flex', gap: 16 }}>
                            <div style={{ width: 48, height: 48, borderRadius: 16, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Search size={24} color="#2563EB" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>1. Post a Requirement</h3>
                                <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                                    Tell us what you need. Specify the subject, your area, budget, and timing. It takes less than 2 minutes and is completely free.
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div style={{ display: 'flex', gap: 16 }}>
                            <div style={{ width: 48, height: 48, borderRadius: 16, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <UserCheck size={24} color="#2563EB" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>2. Tutors Apply to You</h3>
                                <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                                    Verified tutors in your area will view your requirement and apply. You can also browse our tutor directory and contact them directly.
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div style={{ display: 'flex', gap: 16 }}>
                            <div style={{ width: 48, height: 48, borderRadius: 16, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <BookOpen size={24} color="#2563EB" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>3. Start Learning</h3>
                                <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                                    Interview the tutor, finalize the schedule, and begin the tuition classes. You pay the tutor directly—we take 0% commissions from your fees.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: 40 }}>
                        <Link to="/post-requirement" className="btn-primary" style={{ width: '100%', fontSize: 16, padding: '16px', display: 'flex', justifyContent: 'center' }}>
                            Post a Free Requirement
                        </Link>
                    </div>
                </div>

                {/* For Tutors */}
                <div className="card" style={{ padding: 40, borderRadius: 24, borderTop: '4px solid #10B981', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: -20, left: 40, background: '#10B981', color: '#fff', padding: '8px 16px', borderRadius: 999, fontWeight: 700, fontSize: 14 }}>
                        For Tutors
                    </div>

                    <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 32, marginTop: 10 }}>Grow Your Teaching Career</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                        {/* Step 1 */}
                        <div style={{ display: 'flex', gap: 16 }}>
                            <div style={{ width: 48, height: 48, borderRadius: 16, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <ShieldCheck size={24} color="#10B981" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>1. Create & Verify Profile</h3>
                                <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                                    Build a strong profile showcasing your skills, subjects, and college. Upload your documents to get the 'Verified' badge from our admins.
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div style={{ display: 'flex', gap: 16 }}>
                            <div style={{ width: 48, height: 48, borderRadius: 16, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <MessageCircle size={24} color="#10B981" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>2. Browse Requirements</h3>
                                <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                                    Search our live board for local tuition requirements. Filter by area and class level to find opportunities that perfectly match your expertise.
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div style={{ display: 'flex', gap: 16 }}>
                            <div style={{ width: 48, height: 48, borderRadius: 16, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Star size={24} color="#10B981" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>3. Contact & Teach</h3>
                                <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                                    Apply to leads to unlock the parent's phone number. Call them, schedule a demo class, and secure the tuition!
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: 40 }}>
                        <Link to="/become-tutor" className="btn-primary" style={{ width: '100%', fontSize: 16, padding: '16px', display: 'flex', gap: 8, background: '#10B981', justifyContent: 'center', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}>
                            Join as a Tutor
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
