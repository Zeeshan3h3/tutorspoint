import React from 'react';

export default function HelpCenter() {
    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '120px 24px 48px' }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>Help Center & FAQs</h1>
            <p style={{ color: '#475569', fontSize: 16, marginBottom: 48 }}>Find answers to common questions about using TutorsPoint.</p>

            <section style={{ marginBottom: 48 }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: '#2563EB', marginBottom: 24, borderBottom: '2px solid #E2E8F0', paddingBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>For Tutors 🎓</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {[
                        { q: 'Why do I have to pay ₹30-₹50?', a: 'We charge a tiny one-time fee per lead instead of taking huge cuts from your monthly tuition fee. This small amount helps us keep the servers running and ensures only serious tutors apply. You keep 100% of what you earn!' },
                        { q: "What if the parent doesn't pick up or reply?", a: 'Give them 24 hours. Parents are often busy during the day. Try dropping a polite WhatsApp message introducing yourself. If they still don\'t respond after 48 hours, report the lead and we’ll look into it.' },
                        { q: 'How do I get a refund for a fake or bad lead?', a: 'If a phone number is invalid or they already found a tutor before you paid, let us know via the "Contact Us" section. We\'ll check the details and credit your account back for your next unlock!' },
                        { q: 'How do I stand out to parents?', a: 'Complete your profile! Add your college name (e.g., Jadavpur University), your exact major, and a friendly, clear photo. Parents love hiring bright local students they can trust.' }
                    ].map((faq, i) => (
                        <div key={i} style={{ background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0F172A', marginBottom: 8 }}>{faq.q}</h3>
                            <p style={{ color: '#475569', lineHeight: 1.6, fontSize: 15 }}>{faq.a}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: '#10B981', marginBottom: 24, borderBottom: '2px solid #E2E8F0', paddingBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>For Parents 👨‍👩‍👧</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {[
                        { q: 'Are these tutors verified?', a: 'We collect basic details and college information from our tutors, who are mostly bright students from top local colleges in Kolkata. However, we highly recommend you check their college ID during the first meeting.' },
                        { q: 'Is it really free for parents?', a: '100% free! You will never pay us a single rupee. You negotiate the tuition fee directly with the tutor and pay them. We don\'t take any commissions.' },
                        { q: 'How do I choose the right student?', a: 'Once you post a requirement, interested tutors will contact you. Talk to 2-3 of them, ask about their college major, request a paid or free demo class, and see who connects best with your child.' }
                    ].map((faq, i) => (
                        <div key={i} style={{ background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0F172A', marginBottom: 8 }}>{faq.q}</h3>
                            <p style={{ color: '#475569', lineHeight: 1.6, fontSize: 15 }}>{faq.a}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
