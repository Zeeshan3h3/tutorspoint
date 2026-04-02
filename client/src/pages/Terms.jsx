import React from 'react';

export default function Terms() {
    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '120px 24px 48px' }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>Terms & Privacy Policy</h1>
            <p style={{ color: '#475569', fontSize: 16, marginBottom: 48, lineHeight: 1.6 }}>
                Welcome to TutorsPoint! Here’s the deal in plain English. No complicated legal walls of text.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                <section style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 24 }}>🤝</span> What We Do & Don't Do
                    </h2>
                    <ul style={{ paddingLeft: 24, margin: 0, color: '#475569', lineHeight: 1.7, fontSize: 15, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <li><strong>We are a Connector:</strong> We act as a digital notice board connecting local students with parents. We are <strong>not</strong> an employer, agency, or educational institution.</li>
                        <li><strong>No Guarantees:</strong> We try our best to keep the platform clean, but we do not guarantee the quality of teaching, exam results, or the behavior of any user.</li>
                        <li><strong>Safety First:</strong> You are responsible for your own safety. Parents should verify IDs; tutors should verify addresses.</li>
                    </ul>
                </section>

                <section style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 24 }}>💳</span> Payments & Refunds
                    </h2>
                    <ul style={{ paddingLeft: 24, margin: 0, color: '#475569', lineHeight: 1.7, fontSize: 15, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <li><strong>No Commissions:</strong> We do not take a percentage of the tuition fee. That's entirely between the parent and the tutor.</li>
                        <li><strong>Micro-fees:</strong> Tutors pay a small, non-refundable fee (wallet credits) to unlock a phone number of a parent's lead.</li>
                        <li><strong>Fair Refunds:</strong> If a lead is proven to be completely invalid (fake number) or was fulfilled before your unlock, report it. We’ll investigate and credit the amount back to your wallet.</li>
                    </ul>
                </section>

                <section style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 24 }}>🔒</span> Your Privacy
                    </h2>
                    <ul style={{ paddingLeft: 24, margin: 0, color: '#475569', lineHeight: 1.7, fontSize: 15, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <li><strong>Your Data is Yours:</strong> We <strong>DO NOT</strong> sell your personal data to third-party marketers, coaching centers, or advertising agencies.</li>
                        <li><strong>Why We Need It:</strong> We only use your phone number and email to securely connect you with tuitions or tutors, and to provide support when requested.</li>
                        <li><strong>Public Profiles:</strong> Tutors' profiles (excluding exact phone numbers) are visible to help them get hired. Parents' leads intentionally mask phone numbers until unlocked to prevent spam.</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
