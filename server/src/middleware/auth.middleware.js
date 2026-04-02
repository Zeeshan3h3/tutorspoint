import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Tutor from '../models/Tutor.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

export const protect = catchAsync(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];

        // Let the global error handler catch JsonWebTokenError
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            return next(new AppError('The user belonging to this token does no longer exist.', 401));
        }
        return next();
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }
});

// Optional auth — attaches user if token provided, but does NOT reject if missing
export const optionalAuth = catchAsync(async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
            req.user = await User.findById(decoded.id).select('-password');
        } catch (_) {
            // Token invalid — just continue without user
        }
    }
    next();
});

export const requireApprovedTutor = catchAsync(async (req, res, next) => {
    if (req.user.role !== 'tutor') {
        return next(new AppError('Only tutors are allowed to perform this action.', 403));
    }

    const tutor = await Tutor.findOne({ userId: req.user._id });

    if (!tutor || tutor.status !== 'APPROVED') {
        return next(new AppError('Your profile is pending approval. You cannot interact with parents yet.', 403));
    }

    req.tutorProfile = tutor;
    next();
});
