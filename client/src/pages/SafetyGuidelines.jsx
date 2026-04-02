import React from 'react';

export default function SafetyGuidelines() {
    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '120px 24px 48px' }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>Safety Guidelines</h1>
            <p style={{ color: '#475569', fontSize: 16, marginBottom: 48, lineHeight: 1.6 }}>We want to ensure every connection on TutorsPoint is safe and professional. Please follow these hyper-local, practical guidelines for your peace of mind.</p>

            <section style={{ marginBottom: 48 }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: '#2563EB', marginBottom: 24, borderBottom: '2px solid #E2E8F0', paddingBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>For Tutors 🎓</h2>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <li style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', gap: 16 }}>
                        <div style={{ fontSize: 24 }}>📍</div>
                        <div>
                            <strong style={{ display: 'block', color: '#0F172A', marginBottom: 4 }}>Verify the Address First</strong>
                            <span style={{ color: '#475569', lineHeight: 1.5 }}>Ask for an exact Google Maps pin and let a friend or roommate know where you are going for the first class (especially in confusing local lanes).</span>
                        </div>
                    </li>
                    <li style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', gap: 16 }}>
                        <div style={{ fontSize: 24 }}>👔</div>
                        <div>
                            <strong style={{ display: 'block', color: '#0F172A', marginBottom: 4 }}>Keep It Professional</strong>
                            <span style={{ color: '#475569', lineHeight: 1.5 }}>Always have the first meeting in the presence of parents or guardians. Dress appropriately and carry your college ID.</span>
                        </div>
                    </li>
                    <li style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', gap: 16 }}>
                        <div style={{ fontSize: 24 }}>🤝</div>
                        <div>
                            <strong style={{ display: 'block', color: '#0F172A', marginBottom: 4 }}>Agree on Terms Upfront</strong>
                            <span style={{ color: '#475569', lineHeight: 1.5 }}>Clarify the monthly fee, number of days, and payment date (e.g., 5th of every month) clearly over WhatsApp before starting the engagement.</span>
                        </div>
                    </li>
                </ul>
            </section>

            <section style={{ marginBottom: 64 }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: '#10B981', marginBottom: 24, borderBottom: '2px solid #E2E8F0', paddingBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>For Parents 👨‍👩‍👧</h2>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <li style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', gap: 16 }}>
                        <div style={{ fontSize: 24 }}>🪪</div>
                        <div>
                            <strong style={{ display: 'block', color: '#0F172A', marginBottom: 4 }}>Check College IDs</strong>
                            <span style={{ color: '#475569', lineHeight: 1.5 }}>When the tutor arrives, politely ask to see their College ID card (e.g., JU or CU) or Aadhar card for your peace of mind.</span>
                        </div>
                    </li>
                    <li style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', gap: 16 }}>
                        <div style={{ fontSize: 24 }}>📝</div>
                        <div>
                            <strong style={{ display: 'block', color: '#0F172A', marginBottom: 4 }}>Request a Trial Class</strong>
                            <span style={{ color: '#475569', lineHeight: 1.5 }}>Take a 1-day trial class to see if the tutor's teaching style matches your child's learning pace before finalizing the agreement.</span>
                        </div>
                    </li>
                    <li style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', gap: 16 }}>
                        <div style={{ fontSize: 24 }}>🛡️</div>
                        <div>
                            <strong style={{ display: 'block', color: '#0F172A', marginBottom: 4 }}>Trust Your Instincts</strong>
                            <span style={{ color: '#475569', lineHeight: 1.5 }}>If a tutor behaves unprofessionally or demands full advance payment before the first class, politely decline and find another great match on TutorsPoint.</span>
                        </div>
                    </li>
                </ul>
            </section>

            <div style={{ background: '#F8FAFC', borderRadius: 16, padding: '40px 32px', border: '1px solid #E2E8F0' }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 24, textAlign: 'center' }}>Help Us Grow 📲</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

                    <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Message to share in College Groups (For Tutors)</div>
                        <div style={{ background: '#DCF8C6', color: '#0F172A', padding: 20, borderRadius: '0 16px 16px 16px', fontSize: 15, lineHeight: 1.6, position: 'relative' }}>
                            "Hey guys! 👋 I just found this local platform to get home tuitions around Kolkata without any agency commissions. It's called TutorsPoint. You only pay like ₹30 to unlock a number and keep 100% of your fees. Check it out here: https://tutorspoint.in 📚✨"
                        </div>
                        <a
                            href={`https://wa.me/?text=${encodeURIComponent("Hey guys! 👋 I just found this local platform to get home tuitions around Kolkata without any agency commissions. It's called TutorsPoint. You only pay like ₹30 to unlock a number and keep 100% of your fees. Check it out here: https://tutorspoint.in 📚✨")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#25D366', color: '#fff', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, marginTop: 16 }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            <span>Share on WhatsApp</span>
                        </a>
                    </div>

                    <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Message to share in Society Groups (For Parents)</div>
                        <div style={{ background: '#DCF8C6', color: '#0F172A', padding: 20, borderRadius: '0 16px 16px 16px', fontSize: 15, lineHeight: 1.6, position: 'relative' }}>
                            "Hello neighbors! 🏘️ If anyone is looking for home tutors, check out TutorsPoint. It's built by a local student, 100% free for us to post, and connects you directly to bright college students from places like JU for tuitions. Sharing the link: https://tutorspoint.in 📖💡"
                        </div>
                        <a
                            href={`https://wa.me/?text=${encodeURIComponent("Hello neighbors! 🏘️ If anyone is looking for home tutors, check out TutorsPoint. It's built by a local student, 100% free for us to post, and connects you directly to bright college students from places like JU for tuitions. Sharing the link: https://tutorspoint.in 📖💡")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#25D366', color: '#fff', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, marginTop: 16 }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            <span>Share on WhatsApp</span>
                        </a>
                    </div>

                </div>
            </div >
        </div >
    );
}
