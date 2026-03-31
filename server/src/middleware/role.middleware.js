export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

export const adminOrTutor = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'tutor')) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized to perform this action' });
    }
};

// Generic role check — requireRole('tutor'), requireRole('admin'), etc.
export const requireRole = (...roles) => (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
        return next();
    }
    res.status(403).json({ message: `Access denied. Requires role: ${roles.join(' or ')}` });
};
