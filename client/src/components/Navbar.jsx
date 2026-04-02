import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { GraduationCap, LogOut, Menu, X, ChevronDown, MapPin, Mail, Bell, User, FileText, Settings, Bookmark, Wallet } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close mobile menu or dropdown when route changes
    useEffect(() => {
        setMenuOpen(false);
        setDropdownOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navLinks = [
        { to: '/requirements', label: 'Requirements' },
        { to: '/tutors', label: 'Find Tutors' },
        { to: '/post-requirement', label: 'Post Requirement' },
        { to: '/how-it-works', label: 'How It Works' },
        { to: '#', label: 'Blog' },
    ];

    return (
        <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
            {/* Top Bar */}
            <div style={{ background: '#3B4DE8', color: '#fff', fontSize: 12, display: 'flex', justifyContent: 'center' }}>
                <div style={{ maxWidth: 1200, width: '100%', padding: '8px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 300 }}>
                        <MapPin size={12} /> Serving Kolkata & nearby areas
                    </div>
                    <div className="hidden md:flex" style={{ display: 'flex', alignItems: 'center', gap: 16, fontWeight: 300 }}>
                        <span>+91 9088260058</span>
                        <a href="mailto:mdzeeshan08886@gmail.com" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Mail size={12} /> mdzeeshan08886@gmail.com
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Navigation Bar */}
            <nav style={{
                background: scrolled ? 'rgba(255,255,255,0.95)' : '#FFFFFF',
                backdropFilter: scrolled ? 'blur(16px)' : 'none',
                boxShadow: scrolled ? '0 2px 8px rgba(0,0,0,0.08)' : '0 1px 2px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                padding: '16px 0',
            }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Logo Block */}
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#3B4DE8,#4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <GraduationCap size={22} color="#fff" />
                        </div>
                        <div>
                            <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 18, color: '#0F172A', lineHeight: 1 }}>TutorsPoint</div>
                            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>Kolkata</div>
                        </div>
                    </Link>

                    {/* Desktop Center Nav Links */}
                    <div className="hidden md:flex" style={{ alignItems: 'center', gap: 24 }}>
                        {navLinks.map(({ to, label }) => {
                            const isActive = location.pathname === to;
                            return (
                                <Link key={label} to={to} style={{
                                    fontSize: 14, fontWeight: 500,
                                    color: isActive ? '#3B4DE8' : '#374151',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s ease',
                                    position: 'relative'
                                }}
                                    onMouseEnter={e => { e.target.style.color = '#3B4DE8'; }}
                                    onMouseLeave={e => { e.target.style.color = isActive ? '#3B4DE8' : '#374151'; }}
                                >
                                    {label}
                                    {isActive && (
                                        <div style={{ position: 'absolute', bottom: -4, left: 0, right: 0, height: 2, background: '#3B4DE8', borderRadius: 2 }} />
                                    )}
                                </Link>
                            )
                        })}
                    </div>

                    {/* Right Actions */}
                    <div className="hidden md:flex" style={{ alignItems: 'center', gap: 16 }}>
                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                                <button style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', color: '#64748B', transition: 'color 0.2s' }}
                                    onMouseEnter={e => e.target.style.color = '#3B4DE8'}
                                    onMouseLeave={e => e.target.style.color = '#64748B'}
                                >
                                    <Bell size={20} />
                                    <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: '#EF4444', borderRadius: '50%', border: '2px solid #fff' }} />
                                </button>

                                <div style={{ position: 'relative' }} ref={dropdownRef}>
                                    <button onClick={() => setDropdownOpen(!dropdownOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#3B4DE8,#4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>
                                            {user.name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <ChevronDown size={14} color="#64748B" />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {dropdownOpen && (
                                        <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 12, width: 220, background: '#fff', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0', overflow: 'hidden', padding: '8px 0', animation: 'fadeInUp 0.2s ease forwards' }}>
                                            <div style={{ padding: '12px 16px', borderBottom: '1px solid #E2E8F0', marginBottom: 8 }}>
                                                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{user.name || 'User'}</div>
                                                <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
                                                    <span style={{ background: '#EFF6FF', color: '#3B4DE8', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>{user.role}</span>
                                                </div>
                                            </div>

                                            <Link to={user.role === 'tutor' ? "/tutor-dashboard" : user.role === 'admin' ? "/admin" : "/requirements"} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: 14, color: '#334155', textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = '#F8FAFC'} onMouseLeave={e => e.target.style.background = 'transparent'}>
                                                <User size={16} color="#64748B" /> My Profile
                                            </Link>

                                            {user.role === 'tutor' && (
                                                <Link to="/wallet" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: 14, color: '#334155', textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = '#F8FAFC'} onMouseLeave={e => e.target.style.background = 'transparent'}>
                                                    <Wallet size={16} color="#64748B" /> My Wallet
                                                </Link>
                                            )}

                                            {user.role === 'parent' || user.role === 'student' ? (
                                                <Link to="/requirements" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: 14, color: '#334155', textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = '#F8FAFC'} onMouseLeave={e => e.target.style.background = 'transparent'}>
                                                    <FileText size={16} color="#64748B" /> My Requirements
                                                </Link>
                                            ) : (
                                                <Link to="/tutor-dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: 14, color: '#334155', textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = '#F8FAFC'} onMouseLeave={e => e.target.style.background = 'transparent'}>
                                                    <FileText size={16} color="#64748B" /> My Applications
                                                </Link>
                                            )}

                                            <Link to="#" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: 14, color: '#334155', textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = '#F8FAFC'} onMouseLeave={e => e.target.style.background = 'transparent'}>
                                                <Bookmark size={16} color="#64748B" /> Saved Requirements
                                            </Link>

                                            <Link to="#" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: 14, color: '#334155', textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = '#F8FAFC'} onMouseLeave={e => e.target.style.background = 'transparent'}>
                                                <Settings size={16} color="#64748B" /> Settings
                                            </Link>

                                            <div style={{ height: 1, background: '#E2E8F0', margin: '8px 0' }} />

                                            <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: 14, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = '#FEF2F2'} onMouseLeave={e => e.target.style.background = 'transparent'}>
                                                <LogOut size={16} color="#DC2626" /> Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <Link to="/login" style={{ padding: '8px 16px', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#3B4DE8', border: '1.5px solid #3B4DE8', textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = '#EFF6FF'} onMouseLeave={e => e.target.style.background = 'transparent'}>Login</Link>
                                <Link to="/signup" className="btn-primary" style={{ padding: '10px 20px', fontSize: 14, background: '#3B4DE8', border: 'none', color: '#fff' }}>Sign Up</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button className="md:hidden" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0F172A', display: 'flex', padding: 4 }} onClick={() => setMenuOpen(true)}>
                        <Menu size={24} />
                    </button>
                </div>
            </nav>

            {/* Mobile Hamburger Drawer */}
            <div style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, width: 280,
                background: '#fff', zIndex: 200, boxShadow: '-5px 0 25px rgba(0,0,0,0.1)',
                transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex', flexDirection: 'column'
            }}>
                <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#3B4DE8,#4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <GraduationCap size={18} color="#fff" />
                        </div>
                        <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 16, color: '#0F172A' }}>TutorsPoint</div>
                    </div>
                    <button onClick={() => setMenuOpen(false)} style={{ background: '#F1F5F9', border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}>
                        <X size={18} />
                    </button>
                </div>

                <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
                        {navLinks.map(({ to, label }) => (
                            <Link key={label} to={to} style={{ fontSize: 16, fontWeight: 500, color: location.pathname === to ? '#3B4DE8' : '#334155', textDecoration: 'none', padding: '8px 0' }}>{label}</Link>
                        ))}
                    </div>

                    {user ? (
                        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 24 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#3B4DE8,#4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16 }}>
                                    {user.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>{user.name || 'User'}</div>
                                    <div style={{ fontSize: 13, color: '#64748B', textTransform: 'capitalize' }}>{user.role}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <Link to={user.role === 'tutor' ? "/tutor-dashboard" : user.role === 'admin' ? "/admin" : "/requirements"} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: '#334155', textDecoration: 'none', padding: '10px 0' }}>
                                    <User size={18} color="#64748B" /> My Profile
                                </Link>

                                {user.role === 'tutor' && (
                                    <Link to="/wallet" style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: '#334155', textDecoration: 'none', padding: '10px 0' }}>
                                        <Wallet size={18} color="#64748B" /> My Wallet
                                    </Link>
                                )}
                                <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: '#DC2626', background: 'none', border: 'none', padding: '10px 0', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                                    <LogOut size={18} color="#DC2626" /> Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid #E2E8F0', paddingTop: 24 }}>
                            <Link to="/login" style={{ padding: '12px', borderRadius: 8, fontSize: 15, fontWeight: 600, color: '#3B4DE8', border: '1.5px solid #3B4DE8', textDecoration: 'none', textAlign: 'center' }}>Login</Link>
                            <Link to="/signup" className="btn-primary" style={{ padding: '12px', borderRadius: 8, fontSize: 15, background: '#3B4DE8', color: '#fff', border: 'none', textDecoration: 'none', textAlign: 'center' }}>Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Backdrop for mobile drawer */}
            {menuOpen && (
                <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.4)', zIndex: 190, backdropFilter: 'blur(4px)' }} />
            )}
        </header>
    );
}
