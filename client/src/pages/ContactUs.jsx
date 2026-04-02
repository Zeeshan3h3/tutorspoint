import React, { useState } from 'react';

export default function ContactUs() {
    const [status, setStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('Thanks for reaching out! I will get back to you within 24 hours.');
        e.target.reset();
    };

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '120px 24px 48px' }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: '40px 32px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: 40 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', marginBottom: 12 }}>Need Help? Let's Talk! 👋</h1>
                <p style={{ color: '#475569', fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
                    Hi! TutorsPoint is built and run by a local student in Kolkata, not a big corporation. I check every message personally. Replies might take between 12 to 24 hours, but I promise to get back to you and fix things!
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                        <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 8 }}>Name</label>
                        <input required type="text" placeholder="Your Name" style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #E2E8F0', outline: 'none' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 8 }}>Email or Phone</label>
                        <input required type="text" placeholder="How can I reach you?" style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #E2E8F0', outline: 'none' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 8 }}>How can I help?</label>
                        <textarea required placeholder="Describe your issue..." rows={4} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #E2E8F0', outline: 'none', resize: 'vertical' }}></textarea>
                    </div>
                    <button type="submit" style={{ background: '#2563EB', color: '#fff', padding: '14px', borderRadius: 8, fontWeight: 600, border: 'none', cursor: 'pointer', marginTop: 8 }}>
                        Send Message
                    </button>
                    {status && <div style={{ marginTop: 16, padding: 16, background: '#ECFDF5', color: '#065F46', borderRadius: 8, fontSize: 14, fontWeight: 500 }}>{status}</div>}
                </form>
            </div>

            <div style={{ background: '#FFF1F2', borderRadius: 16, padding: '40px 32px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: '#BE123C', marginBottom: 12 }}>Report a Bad Lead / Spam</h2>
                <p style={{ color: '#881337', fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
                    Sometimes things slip through. If a tuition lead looks sketchy, let us know so we can keep the community clean and refund your unlock fee.
                </p>

                <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #FECDD3' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#4C0519', marginBottom: 8 }}>Reason for Reporting:</div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: '#4C0519', cursor: 'pointer' }}>
                            <input type="radio" name="reason" value="invalid" required style={{ width: 18, height: 18, accentColor: '#E11D48' }} />
                            The phone number is invalid / doesn't exist.
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: '#4C0519', cursor: 'pointer' }}>
                            <input type="radio" name="reason" value="fulfilled" required style={{ width: 18, height: 18, accentColor: '#E11D48' }} />
                            The parent already found a tutor before my unlock.
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: '#4C0519', cursor: 'pointer' }}>
                            <input type="radio" name="reason" value="spam" required style={{ width: 18, height: 18, accentColor: '#E11D48' }} />
                            The post looks like spam or fraud.
                        </label>

                        <textarea placeholder="Any specific details? (Optional)" rows={2} style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #FECDD3', outline: 'none', resize: 'vertical', marginTop: 8 }}></textarea>

                        <button type="submit" style={{ background: '#E11D48', color: '#fff', padding: '12px', borderRadius: 8, fontWeight: 600, border: 'none', cursor: 'pointer', marginTop: 8 }}>
                            Submit Report
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
