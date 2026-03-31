import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../utils/sendEmail.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d',
    });
};

export const signup = async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const assignedRole = role === 'tutor' || role === 'student' ? role : 'student';

        const user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
            role: assignedRole,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();

        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
        const messageHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 16px; padding: 32px; background: #fff;">
                <h2 style="color: #0F172A; text-align: center;">Password Reset Request</h2>
                <p style="color: #475569; font-size: 16px; line-height: 1.5;">You requested a password reset for your <strong>TutorsPoint</strong> account. Please click the button below to set a new password. This link is valid for 10 minutes.</p>
                <div style="text-align: center; margin: 32px 0;">
                    <a href="${resetUrl}" style="display: inline-block; padding: 14px 28px; background: #2563EB; color: #fff; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px;">Reset Your Password</a>
                </div>
                <p style="color: #94A3B8; font-size: 14px; text-align: center;">If you didn't request this, please ignore this email.</p>
            </div>
        `;

        try {
            if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
                await sendEmail({
                    email: user.email,
                    subject: 'TutorsPoint Password Reset',
                    html: messageHtml
                });
            } else {
                console.log('\n[Email Skipping] No SMTP configs in .env. Here is the reset link:\n', resetUrl, '\n');
            }

            res.status(200).json({
                message: 'Password reset link sent'
            });
        } catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ message: 'Email could not be sent' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
