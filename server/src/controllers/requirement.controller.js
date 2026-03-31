import Requirement from '../models/Requirement.js';

// Helper: mask phone number  e.g. 9876543210 → 98XXXXXX10
const maskPhone = (phone) => {
    if (!phone) return '98XXXXXX10';
    const digits = String(phone).replace(/\D/g, '');
    if (digits.length < 6) return '**XXXX**';
    return digits.slice(0, 2) + 'X'.repeat(Math.max(6, digits.length - 4)) + digits.slice(-2);
};

// POST /api/requirement — Authenticated students/parents only
export const createRequirement = async (req, res) => {
    try {
        const {
            classLevel, board, medium, subjects, area, pinCode,
            budgetMin, budgetMax, sessionsPerMonth, daysPerWeek,
            classMode, genderPreference, startTiming,
            contactType, phone, message
        } = req.body;

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
        });

        res.status(201).json(requirement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/requirement — Public list (masked phone)
export const getRequirements = async (req, res) => {
    try {
        const { area, subject, classLevel } = req.query;

        const filter = { status: 'open' };
        if (area) filter.area = { $regex: area, $options: 'i' };
        if (subject) filter.subjects = { $elemMatch: { $regex: subject, $options: 'i' } };
        if (classLevel) filter.classLevel = classLevel;

        const requirements = await Requirement.find(filter)
            .sort({ createdAt: -1 }); // Do not omit phone here

        const masked = requirements.map(r => {
            const obj = r.toObject();
            obj.phone = maskPhone(r.phone);
            return obj;
        });

        res.json(masked);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/requirement/:id — Increment views; reveal phone if tutor/applied
export const getRequirementById = async (req, res) => {
    try {
        const requirement = await Requirement.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!requirement) {
            return res.status(404).json({ message: 'Requirement not found' });
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
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/requirement/:id/apply — Tutor auth required
export const applyToRequirement = async (req, res) => {
    try {
        const requirement = await Requirement.findById(req.params.id);
        if (!requirement) {
            return res.status(404).json({ message: 'Requirement not found' });
        }

        const alreadyApplied = requirement.appliedTutors.some(
            id => id.toString() === req.user._id.toString()
        );

        if (alreadyApplied) {
            return res.status(400).json({ message: 'You have already applied to this requirement' });
        }

        requirement.appliedTutors.push(req.user._id);
        await requirement.save();

        // Return the requirement with full phone (tutor just applied)
        const obj = requirement.toObject();
        res.json({ message: 'Applied successfully', requirement: obj });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
