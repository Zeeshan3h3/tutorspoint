import AppError from '../utils/AppError.js';

export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return next(new AppError('Not authorized as an admin', 403));
    }
};

export const adminOrTutor = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'tutor')) {
        next();
    } else {
        return next(new AppError('Not authorized to perform this action', 403));
    }
};

// Generic role check — requireRole('tutor'), requireRole('admin'), etc.
export const requireRole = (...roles) => (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
        return next();
    }
    return next(new AppError(`Access denied. Requires role: ${roles.join(' or ')}`, 403));
};
