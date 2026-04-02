import Requirement from '../models/Requirement.js';
import Tutor from '../models/Tutor.js';
import Transaction from '../models/Transaction.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import jwt from 'jsonwebtoken';

// Helper: mask phone number  e.g. 9876543210 → 98XXXXXX10
const maskPhone = (phone) => {
    if (!phone) return '98XXXXXX10';
    const digits = String(phone).replace(/\D/g, '');
    if (digits.length < 6) return '**XXXX**';
    return digits.slice(0, 2) + 'X'.repeat(Math.max(6, digits.length - 4)) + digits.slice(-2);
};

// Helper: determine cost based on class
const calculateLeadCost = (classLevel) => {
    if (!classLevel) return 20;
    const cl = classLevel.toLowerCase();
    if (cl.includes('11') || cl.includes('12') || cl.includes('jee') || cl.includes('neet')) return 50;
    if (cl.includes('9') || cl.includes('10')) return 25;
    if (cl.includes('6') || cl.includes('7') || cl.includes('8')) return 15;
    if (cl.includes('1') || cl.includes('2') || cl.includes('3') || cl.includes('4') || cl.includes('5')) return 10;
    return 20; // fallback
};

// POST /api/requirement — Authenticated students/parents only
export const createRequirement = catchAsync(async (req, res, next) => {
    const {
        classLevel, board, medium, subjects, area, pinCode,
        budgetMin, budgetMax, sessionsPerMonth, daysPerWeek,
        classMode, genderPreference, startTiming,
        contactType, phone, message
    } = req.body;

    const costToUnlock = calculateLeadCost(classLevel);

    const requirement = await Requirement.create({
        postedBy: req.user._id,
        postedByName: req.user.name,
        classLevel,
        board,
        medium,
        subjects: Array.isArray(subjects) ? subjects : [subjects],
        area,
        pinCode,
        budgetMin: Number(budgetMin),
        budgetMax: Number(budgetMax),
        sessionsPerMonth: Number(sessionsPerMonth) || 12,
        daysPerWeek: Number(daysPerWeek),
        classMode,
        genderPreference: genderPreference || 'No Preference',
        startTiming: startTiming || 'Flexible',
        contactType: contactType || 'Parent',
        phone,
        message: message || '',
        costToUnlock
    });

    res.status(201).json(requirement);
});

// GET /api/requirement — Public list (masked phone)
export const getRequirements = catchAsync(async (req, res, next) => {
    const { area, subject, classLevel } = req.query;

    let isPro = false;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const tutor = await Tutor.findOne({ userId: decoded.id });
            if (tutor && tutor.isProUser && tutor.subscriptionEndDate > new Date()) {
                isPro = true;
            }
        } catch (err) {
            // Ignore token verification errors for this public route
        }
    }

    const filter = { status: 'open' };
    if (area) filter.area = { $regex: area, $options: 'i' };
    if (subject) filter.subjects = { $elemMatch: { $regex: subject, $options: 'i' } };
    if (classLevel) filter.classLevel = classLevel;

    const requirements = await Requirement.find(filter)
        .sort({ createdAt: -1 });

    const FIFTEEN_MINS = 15 * 60 * 1000;
    const now = Date.now();

    const masked = requirements.map(r => {
        const obj = r.toObject();
        obj.phone = maskPhone(r.phone);

        // 15-Minute Lead Scarcity Escrow System
        // High-value leads (> 20 credits) are escrowed for non-Pro users
        if (r.costToUnlock > 20 && !isPro) {
            const age = now - new Date(r.createdAt).getTime();
            if (age < FIFTEEN_MINS) {
                obj.isEscrowed = true;
                obj.escrowRemainingMs = FIFTEEN_MINS - age;
            }
        }

        return obj;
    });

    res.json(masked);
});

// GET /api/requirement/:id — Increment views; reveal phone if tutor/applied
export const getRequirementById = catchAsync(async (req, res, next) => {
    const requirement = await Requirement.findByIdAndUpdate(
        req.params.id,
        { $inc: { views: 1 } },
        { new: true }
    );

    if (!requirement) {
        return next(new AppError('Requirement not found', 404));
    }

    const obj = requirement.toObject();

    // Show full phone only if caller is a logged-in tutor or has already applied
    const isTutor = req.user && req.user.role === 'tutor';
    const hasApplied = req.user && requirement.appliedTutors.some(
        id => id.toString() === req.user._id.toString()
    );

    if (!isTutor && !hasApplied) {
        obj.phone = maskPhone(requirement.phone);
    }

    res.json(obj);
});

// POST /api/requirement/:id/apply — Tutor auth required
export const applyToRequirement = catchAsync(async (req, res, next) => {
    const reqId = req.params.id;
    const tutorProfile = req.tutorProfile; // Found via middleware

    // Initial check
    const requirementBase = await Requirement.findById(reqId);
    if (!requirementBase) {
        return next(new AppError('Requirement not found', 404));
    }

    if (requirementBase.isLocked) {
        return next(new AppError('This requirement has already reached the maximum number of tutors', 400));
    }

    const alreadyApplied = requirementBase.appliedTutors.some(
        id => id.toString() === req.user._id.toString()
    );

    if (alreadyApplied) {
        return next(new AppError('You have already unlocked this requirement', 400));
    }

    // Fraud Detection: Velocity Locking (Max 5 unlocks per hour)
    // (Increased from 3 since it's a paid system now)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    tutorProfile.unlockTimestamps = tutorProfile.unlockTimestamps.filter(t => t > oneHourAgo);

    if (tutorProfile.unlockTimestamps.length >= 5) {
        tutorProfile.fraudFlags.push({
            reason: 'Velocity Spike: Attempted >5 unlocks in 1 hour',
            flaggedAt: new Date()
        });
        tutorProfile.status = 'SUSPENDED';
        tutorProfile.statusTimeline.push({
            status: 'SUSPENDED',
            changedAt: new Date(),
            note: 'Automated Fraud System: Velocity Spike'
        });

        await tutorProfile.save();
        return next(new AppError('Account temporarily suspended due to unusual activity. Please contact admin.', 403));
    }

    const unlockCost = requirementBase.costToUnlock;

    // Concurrency Phase 1: Deduct Credits
    const updatedTutor = await Tutor.findOneAndUpdate(
        { _id: tutorProfile._id, credits: { $gte: unlockCost } },
        {
            $inc: { credits: -unlockCost },
            $push: { unlockTimestamps: new Date() }
        },
        { new: true }
    );

    if (!updatedTutor) {
        return next(new AppError(`Insufficient credits. This lead costs ${unlockCost} credits.`, 400));
    }

    // Concurrency Phase 2: Claim Slot atomically
    const requirement = await Requirement.findOneAndUpdate(
        {
            _id: reqId,
            isLocked: false,
            // Assert array doesn't hit max limit
            [`unlockedBy.${requirementBase.maxUnlocks - 1}`]: { $exists: false }
        },
        {
            $push: {
                unlockedBy: tutorProfile._id,
                appliedTutors: req.user._id
            }
        },
        { new: true }
    );

    // Rollback Phase
    if (!requirement) {
        await Tutor.findByIdAndUpdate(tutorProfile._id, { $inc: { credits: unlockCost } });
        return next(new AppError('This requirement just filled up! Your credits were refunded.', 400));
    }

    if (requirement.unlockedBy.length >= requirement.maxUnlocks) {
        requirement.isLocked = true;
        await requirement.save();
    }

    // Transaction Logging
    await Transaction.create({
        tutorId: tutorProfile._id,
        type: 'CREDIT_SPENT',
        amount: -unlockCost,
        description: `Unlocked Class ${requirement.classLevel} Lead in ${requirement.area}`,
        referenceId: requirement._id,
        balanceAfter: updatedTutor.credits
    });

    updatedTutor.totalUnlocks += 1;
    await updatedTutor.save();

    const obj = requirement.toObject();
    res.json({ message: 'Lead unlocked successfully', requirement: obj, balance: updatedTutor.credits });
});
