import Tutor from '../models/Tutor.js';
import User from '../models/User.js';
import Requirement from '../models/Requirement.js'; // Might need this for unlock history
import Transaction from '../models/Transaction.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

// @desc    Get all tutors with filters, search, and pagination
// @route   GET /api/admin/tutors
// @access  Private/Admin
export const getAllTutors = catchAsync(async (req, res, next) => {
    const { search, status, area, isVerified, sort, page = 1, limit = 20 } = req.query;

    const query = {};

    // Filters
    if (status) query.status = status.toUpperCase();
    if (area) query.area = area;
    if (isVerified) query.isVerified = isVerified === 'true';

    let tutorsQuery = Tutor.find(query).populate('userId', 'name email phone');

    // Fast memory-efficient search via regex on populated doc requires aggregate or we can just search local fields
    // However, area, subjects, pricing are local fields. Name, email, phone are on User.
    // If search is provided, we might need a more complex query, but for now we'll filter after population or just search local text.
    // For MVP, fetch and filter is okay if the dataset is small, but a better approach is finding users first.
    let userIds = [];
    if (search) {
        const users = await User.find({
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
            ]
        }).select('_id');
        userIds = users.map(u => u._id);

        // Add to main query: either matches local fields OR matches user fields
        query.$or = [
            { userId: { $in: userIds } },
            { area: { $regex: search, $options: 'i' } },
            { subjects: { $regex: search, $options: 'i' } }
        ];

        // Re-assign the find with the updated query
        tutorsQuery = Tutor.find(query).populate('userId', 'name email phone');
    }

    // Pagination & Sorting
    let sortObj = { createdAt: -1 };
    if (sort === 'active') sortObj = { lastActiveAt: -1 };
    if (sort === 'unlocks') sortObj = { totalUnlocks: -1 };

    const skip = (page - 1) * limit;
    tutorsQuery.skip(skip).limit(Number(limit)).sort(sortObj);

    const tutors = await tutorsQuery;
    const total = await Tutor.countDocuments(query);

    res.status(200).json({
        success: true,
        count: tutors.length,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        data: tutors
    });
});

// @desc    Get single tutor details
// @route   GET /api/admin/tutors/:id
// @access  Private/Admin
export const getTutorDetails = catchAsync(async (req, res, next) => {
    const tutor = await Tutor.findById(req.params.id)
        .populate('userId', 'name email phone')
        .populate('approvedBy', 'name');

    if (!tutor) {
        return next(new AppError('Tutor not found', 404));
    }

    // Optional: Fetch unlock history here if there is an Unlock model/schema linking to this tutor

    res.status(200).json({
        success: true,
        data: tutor
    });
});

// @desc    Update tutor status with state transition checks
// @route   PATCH /api/admin/tutors/:id/status
// @access  Private/Admin
export const updateTutorStatus = catchAsync(async (req, res, next) => {
    const { status, rejectedReason } = req.body;
    const tutorId = req.params.id;

    if (!status) {
        return next(new AppError('Please provide a status', 400));
    }

    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
        return next(new AppError('Tutor not found', 404));
    }

    const currentStatus = tutor.status;
    const newStatus = status.toUpperCase();

    // Map of Allowed Transitions
    const allowedTransitions = {
        'PENDING': ['APPROVED', 'REJECTED'],
        'APPROVED': ['SUSPENDED', 'REMOVED'],
        'SUSPENDED': ['APPROVED', 'REMOVED'],
        'REJECTED': [], // Manual db restore required or specific edge case
        'REMOVED': ['APPROVED'] // Optional restore
    };

    if (currentStatus === newStatus) {
        return res.status(200).json({ success: true, data: tutor }); // No-op
    }

    if (!allowedTransitions[currentStatus].includes(newStatus)) {
        return next(new AppError(`Invalid state transition: Cannot change status from ${currentStatus} to ${newStatus}`, 400));
    }

    tutor.status = newStatus;

    // Apply side-effects based on new status
    if (newStatus === 'APPROVED') {
        tutor.approvedAt = Date.now();
        tutor.approvedBy = req.user.id; // Admin who approved
        tutor.verificationNote = req.body.verificationNote || tutor.verificationNote;
    }

    if (newStatus === 'REJECTED') {
        tutor.rejectedReason = rejectedReason || 'Did not meet platform guidelines';
    }

    if (newStatus === 'REMOVED') {
        tutor.removedAt = Date.now();
    }

    tutor.lastActiveAt = Date.now();

    // Push into status timeline
    tutor.statusTimeline.push({
        status: newStatus,
        changedAt: Date.now(),
        changedBy: req.user.id,
        note: newStatus === 'REJECTED' ? rejectedReason
            : newStatus === 'APPROVED' ? req.body.verificationNote
                : ''
    });

    await tutor.save();

    res.status(200).json({
        success: true,
        message: `Tutor status successfully updated to ${newStatus}`,
        data: tutor
    });
});

// @desc    Toggle verify state
// @route   PATCH /api/admin/tutors/:id/verify
// @access  Private/Admin
export const verifyTutor = catchAsync(async (req, res, next) => {
    const { isVerified, verificationNote, verificationType } = req.body;

    const tutor = await Tutor.findById(req.params.id);
    if (!tutor) return next(new AppError('Tutor not found', 404));

    if (verificationType && ['idVerified', 'phoneVerified', 'manualApproved'].includes(verificationType)) {
        tutor.verificationTypes[verificationType] = isVerified !== undefined ? isVerified : !tutor.verificationTypes[verificationType];
        if (verificationType === 'idVerified') {
            tutor.isVerified = tutor.verificationTypes.idVerified;
        }
    } else {
        tutor.isVerified = isVerified !== undefined ? isVerified : !tutor.isVerified;
        if (tutor.isVerified) {
            tutor.verificationTypes.manualApproved = true;
        }
    }

    if (verificationNote) tutor.verificationNote = verificationNote;

    await tutor.save(); // Also triggers the pre-save profile score recalculation

    res.status(200).json({
        success: true,
        message: 'Tutor verification updated',
        data: tutor
    });
});

// @desc    Suspend tutor
// @route   PATCH /api/admin/tutors/:id/suspend
// @access  Private/Admin
export const suspendTutor = catchAsync(async (req, res, next) => {
    const tutor = await Tutor.findById(req.params.id);
    if (!tutor) return next(new AppError('Tutor not found', 404));

    const currentStatus = tutor.status;
    if (currentStatus !== 'APPROVED') {
        return next(new AppError(`Only APPROVED tutors can be explicitly suspended. Current status is ${currentStatus}`, 400));
    }

    tutor.status = 'SUSPENDED';
    await tutor.save();

    res.status(200).json({
        success: true,
        message: 'Tutor has been temporarily suspended',
        data: tutor
    });
});

// @desc    Get Area Density Insights
// @route   GET /api/admin/insights/area-density
// @access  Private/Admin
export const getAreaDensityInsights = catchAsync(async (req, res, next) => {
    const density = await Tutor.aggregate([
        { $match: { area: { $exists: true, $ne: '' } } },
        { $group: { _id: '$area', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);

    const formattedData = density.map(d => ({
        area: d._id,
        count: d.count
    }));

    res.status(200).json({
        success: true,
        data: formattedData
    });
});

// @desc    Get all requirements for admin moderation
// @route   GET /api/admin/requirements
// @access  Private/Admin
export const getAdminRequirements = catchAsync(async (req, res, next) => {
    const requirements = await Requirement.find()
        .sort({ unlockCount: -1, createdAt: -1 })
        .populate('postedBy', 'name email phone');

    res.status(200).json({
        success: true,
        count: requirements.length,
        data: requirements
    });
});

// @desc    Update requirement status (e.g. mark spam)
// @route   PATCH /api/admin/requirements/:id/status
// @access  Private/Admin
export const updateRequirementStatus = catchAsync(async (req, res, next) => {
    const { status } = req.body;
    const requirement = await Requirement.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!requirement) return next(new AppError('Requirement not found', 404));

    res.status(200).json({ success: true, data: requirement });
});

// @desc    Get Revenue & Top-level Insights
// @route   GET /api/admin/insights/revenue
// @access  Private/Admin
export const getRevenueInsights = catchAsync(async (req, res, next) => {
    const result = await Tutor.aggregate([
        { $group: { _id: null, totalUnlocks: { $sum: '$totalUnlocks' } } }
    ]);
    const totalUnlocks = result[0]?.totalUnlocks || 0;
    const totalRevenue = totalUnlocks * 40; // 40 INR per unlock

    res.status(200).json({
        success: true,
        data: {
            totalUnlocks,
            totalRevenue
        }
    });
});

// @desc    Get Referral Leaderboard
// @route   GET /api/admin/insights/referrals
// @access  Private/Admin
export const getReferralInsights = catchAsync(async (req, res, next) => {
    const topReferrers = await Tutor.find({ referralCredits: { $gt: 0 } })
        .populate('userId', 'name email phone')
        .sort({ referralCredits: -1 })
        .limit(50); // Get top 50

    res.status(200).json({
        success: true,
        data: topReferrers
    });
});

// @desc    Adjust Tutor Referral Credits
// @route   PATCH /api/admin/tutors/:id/credits
// @access  Private/Admin
export const adjustReferralCredits = catchAsync(async (req, res, next) => {
    const { amount, actionType } = req.body; // actionType: 'add' | 'deduct'
    const tutor = await Tutor.findById(req.params.id);
    if (!tutor) return next(new AppError('Tutor not found', 404));

    const adjustment = parseInt(amount) || 0;
    if (actionType === 'add') {
        tutor.referralCredits += adjustment;
    } else if (actionType === 'deduct') {
        tutor.referralCredits = Math.max(0, tutor.referralCredits - adjustment);
    }

    await tutor.save();

    res.status(200).json({
        success: true,
        message: `Credits ${actionType === 'add' ? 'added' : 'deducted'} successfully`,
        data: tutor
    });
});

// @desc    Toggle Trusted Tutor badge (God Badge)
// @route   PATCH /api/admin/tutors/:id/trust
// @access  Private/Admin
export const toggleTrustedTutor = catchAsync(async (req, res, next) => {
    const tutor = await Tutor.findById(req.params.id);
    if (!tutor) return next(new AppError('Tutor not found', 404));

    tutor.trustedTutor = !tutor.trustedTutor;
    await tutor.save();

    res.status(200).json({
        success: true,
        message: tutor.trustedTutor ? 'Tutor marked as deeply trusted' : 'Trust badge removed',
        data: tutor
    });
});

// @desc    Get tutor for admin review cockpit (with real-time red flags)
// @route   GET /api/admin/tutors/:id/review
// @access  Private/Admin
export const getTutorForReview = catchAsync(async (req, res, next) => {
    const tutor = await Tutor.findById(req.params.id).populate('userId', 'name email phone');
    if (!tutor) return next(new AppError('Tutor not found', 404));

    const redFlags = [];

    // Check missing fields
    if (!tutor.profileImage) redFlags.push('Missing profile photo');
    if (!tutor.college) redFlags.push('Missing college information');
    if (!tutor.subjects || tutor.subjects.length === 0) redFlags.push('No subjects selected');

    // Check suspicious name (numbers or very short)
    const name = tutor.userId?.name || '';
    if (name.length < 3) redFlags.push('Suspiciously short name');
    if (/\d/.test(name)) redFlags.push('Name contains numbers');

    // Check duplicate phone
    if (tutor.userId?.phone) {
        const duplicatePhoneCount = await User.countDocuments({ phone: tutor.userId.phone });
        if (duplicatePhoneCount > 1) {
            redFlags.push('Duplicate phone number detected across multiple accounts');
        }
    }

    res.status(200).json({
        success: true,
        data: {
            tutor,
            redFlags
        }
    });
});

// @desc    Submit admin review checklist and update status
// @route   PATCH /api/admin/tutors/:id/review
// @access  Private/Admin
export const submitTutorReview = catchAsync(async (req, res, next) => {
    const { status, verificationNote, adminChecklist, rejectedReason } = req.body;
    const tutor = await Tutor.findById(req.params.id);

    if (!tutor) return next(new AppError('Tutor not found', 404));

    if (adminChecklist) {
        tutor.adminChecklist = adminChecklist;
    }

    if (verificationNote !== undefined) {
        tutor.verificationNote = verificationNote;
    }

    // Only process status transition if it's changing
    if (status && status !== tutor.status) {
        const currentStatus = tutor.status;
        const newStatus = status.toUpperCase();

        const allowedTransitions = {
            'PENDING': ['APPROVED', 'REJECTED'],
            'APPROVED': ['SUSPENDED', 'REMOVED'],
            'SUSPENDED': ['APPROVED', 'REMOVED'],
            'REJECTED': [],
            'REMOVED': ['APPROVED']
        };

        if (allowedTransitions[currentStatus] && allowedTransitions[currentStatus].includes(newStatus)) {
            tutor.status = newStatus;

            if (newStatus === 'APPROVED') {
                tutor.approvedAt = Date.now();
                tutor.approvedBy = req.user.id;

                // FREE CREDIT LOGIC: Grant 100 credits ONCE if ID is uploaded or marked verified
                if (!tutor.receivedFreeCredits && (tutor.idProofUrl || tutor.verificationTypes?.idVerified)) {
                    tutor.credits += 100;
                    tutor.receivedFreeCredits = true;

                    // Create Transaction log
                    await Transaction.create({
                        tutorId: tutor._id,
                        type: 'FREE_CREDIT',
                        amount: 100,
                        description: 'Welcome Bonus: Verified Tutor Profile',
                        balanceAfter: tutor.credits
                    });
                }

            } else if (newStatus === 'REJECTED') {
                tutor.rejectedReason = rejectedReason || 'Did not meet platform guidelines';
            } else if (newStatus === 'REMOVED') {
                tutor.removedAt = Date.now();
            }

            tutor.statusTimeline.push({
                status: newStatus,
                changedAt: Date.now(),
                changedBy: req.user.id,
                note: newStatus === 'REJECTED' ? rejectedReason : (newStatus === 'APPROVED' ? verificationNote : '')
            });
        } else {
            return next(new AppError(`Invalid transition from ${currentStatus} to ${newStatus}`, 400));
        }
    }

    await tutor.save();

    res.status(200).json({
        success: true,
        message: 'Review submitted successfully',
        data: tutor
    });
});

