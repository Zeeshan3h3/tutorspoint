import { Link } from 'react-router-dom';
import { GraduationCap, MapPin, Phone, Mail, Clock } from 'lucide-react';

const icons = {
    Facebook: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>,
    Instagram: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
    Linkedin: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>,
    Twitter: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
};

export default function Footer() {
    return (
        <footer style={{ background: '#0F172A', color: '#CBD5E1', paddingTop: 64, paddingBottom: 24 }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
                {/* Main 4-Column Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 40, marginBottom: 48 }}>

                    {/* Column 1 - Brand Block */}
                    <div>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 20 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #3B4DE8, #4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <GraduationCap size={22} color="#fff" />
                            </div>
                            <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 20, color: '#fff', lineHeight: 1 }}>
                                TutorsPoint
                            </div>
                        </Link>
                        <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 24, color: '#94A3B8' }}>
                            Connecting students with the right tutors across Kolkata. Your destination for quality education.
                        </p>

                        {/* Social Links */}
                        <div style={{ display: 'flex', gap: 12 }}>
                            {Object.values(icons).map((Icon, idx) => (
                                <a key={idx} href="#" style={{
                                    width: 36, height: 36, borderRadius: '50%', background: '#1E293B',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CBD5E1',
                                    transition: 'all 0.2s', textDecoration: 'none'
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#3B4DE8'; e.currentTarget.style.color = '#fff'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = '#1E293B'; e.currentTarget.style.color = '#CBD5E1'; }}
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2 - Quick Links */}
                    <div>
                        <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Platform</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {['Home', 'Find Tutors', 'Post a Requirement', 'How It Works', 'Pricing', 'Blog'].map(link => (
                                <Link key={link} to={link === 'Home' ? '/' : link === 'How It Works' ? '/how-it-works' : '#'} style={{ color: '#CBD5E1', fontSize: 14, textDecoration: 'none', transition: 'color 0.2s' }}
                                    onMouseEnter={e => e.target.style.color = '#fff'}
                                    onMouseLeave={e => e.target.style.color = '#CBD5E1'}>
                                    {link}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Column 3 - Support */}
                    <div>
                        <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Support</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {[
                                { name: 'Help Center & FAQs', path: '/help' },
                                { name: 'Contact Us & Report', path: '/contact' },
                                { name: 'Safety Guidelines', path: '/safety' },
                                { name: 'Terms & Privacy Policy', path: '/terms' }
                            ].map(link => (
                                <Link key={link.name} to={link.path} style={{ color: '#CBD5E1', fontSize: 14, textDecoration: 'none', transition: 'color 0.2s' }}
                                    onMouseEnter={e => e.target.style.color = '#fff'}
                                    onMouseLeave={e => e.target.style.color = '#CBD5E1'}>
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Column 4 - Contact & Location */}
                    <div>
                        <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Get In Touch</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                <MapPin size={18} color="#94A3B8" style={{ marginTop: 2 }} />
                                <span style={{ fontSize: 14, color: '#CBD5E1', lineHeight: 1.5 }}>Kolkata, West Bengal,<br />India</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <Phone size={18} color="#94A3B8" />
                                <span style={{ fontSize: 14, color: '#CBD5E1' }}>+91 9088260058</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <Mail size={18} color="#94A3B8" />
                                <a href="mailto:mdzeeshan08886@gmail.com" style={{ fontSize: 14, color: '#CBD5E1', textDecoration: 'none' }}
                                    onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = '#CBD5E1'}>
                                    mdzeeshan08886@gmail.com
                                </a>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                <Clock size={18} color="#94A3B8" style={{ marginTop: 2 }} />
                                <span style={{ fontSize: 14, color: '#CBD5E1', lineHeight: 1.5 }}>Support hours:<br />Mon–Sat, 9 AM – 7 PM</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{ borderTop: '1px solid #334155', paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', justifyContent: 'space-between' }} className="md:flex-row">
                    <p style={{ fontSize: 13, color: '#94A3B8', margin: 0 }}>
                        © 2026 TutorsPoint. All rights reserved.
                    </p>
                    <div style={{ display: 'flex', gap: 24 }}>
                        {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(link => (
                            <Link key={link} to="#" style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }}
                                onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = '#94A3B8'}>
                                {link}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

