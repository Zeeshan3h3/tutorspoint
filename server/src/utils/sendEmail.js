import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    // Always send FROM the authenticated Gmail — Gmail rejects mismatched senders
    const message = {
        from: `${process.env.FROM_NAME || 'TutorsPoint'} <${process.env.SMTP_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html: options.html
    };

    try {
        const info = await transporter.sendMail(message);
        console.log('[Email] ✅ Sent successfully to:', options.email, '— ID:', info.messageId);
    } catch (err) {
        console.error('[Email] ❌ FAILED to send email:', err.message);
        throw err; // Re-throw so the controller can respond with 500
    }
};
