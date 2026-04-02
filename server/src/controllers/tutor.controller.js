import Tutor from '../models/Tutor.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

export const getMyTutorProfile = catchAsync(async (req, res, next) => {
    const tutor = await Tutor.findOne({ userId: req.user._id }).populate('userId', 'name email phone');
    if (!tutor) return next(new AppError('Tutor profile not found', 404));
    res.json(tutor);
});

export const createTutorProfile = catchAsync(async (req, res, next) => {
    const existingTutor = await Tutor.findOne({ userId: req.user._id });
    if (existingTutor) {
        return next(new AppError('Tutor profile already exists', 400));
    }

    let subjects = req.body.subjects;
    if (typeof subjects === 'string') {
        try { subjects = JSON.parse(subjects); } catch (e) { subjects = [subjects]; }
    }

    const tutorData = { ...req.body, subjects };
    if (req.file) {
        tutorData.profileImage = `/uploads/profiles/${req.file.filename}`;
    }

    const tutor = await Tutor.create({
        userId: req.user._id,
        ...tutorData
    });

    res.status(201).json(tutor);
});

export const getTutors = catchAsync(async (req, res, next) => {
    // Return only approved tutors to the public
    const tutors = await Tutor.find({ status: 'APPROVED' }).populate('userId', 'name email phone');
    res.json(tutors);
});

export const getTutorById = catchAsync(async (req, res, next) => {
    const tutor = await Tutor.findById(req.params.id).populate('userId', 'name email phone');
    if (!tutor) {
        return next(new AppError('Tutor not found', 404));
    }
    res.json(tutor);
});

export const updateTutorProfile = catchAsync(async (req, res, next) => {
    const tutor = await Tutor.findOne({ userId: req.user._id });
    if (!tutor) {
        return next(new AppError('Tutor profile not found', 404));
    }

    // Identify incoming basic changes
    let incomingSubjects = req.body.subjects;
    if (typeof incomingSubjects === 'string') {
        try { incomingSubjects = JSON.parse(incomingSubjects); } catch (e) { incomingSubjects = [incomingSubjects]; }
    }

    let incomingClasses = req.body.classesHandled;
    if (typeof incomingClasses === 'string') {
        try { incomingClasses = JSON.parse(incomingClasses); } catch (e) { incomingClasses = [incomingClasses]; }
    }

    // Compile dynamic payload
    const updates = { ...req.body };
    if (incomingSubjects) updates.subjects = incomingSubjects;
    if (incomingClasses) updates.classesHandled = incomingClasses;

    if (req.file) {
        updates.profileImage = `/uploads/profiles/${req.file.filename}`;
    }

    // Strictly locked fields (Cannot be changed after initial setup)
    const permanentlyLocked = ['gender', 'degree', 'graduationYear'];
    for (const field of permanentlyLocked) {
        if (updates[field] && tutor[field] && updates[field] !== tutor[field]) {
            delete updates[field]; // Silently drop or return an error
        }
    }

    // Critical Field Re-Review Logic
    const criticalFields = ['college', 'subjects', 'area', 'classesHandled'];
    let criticalChanged = false;
    const changesToLog = [];

    // Detect all changes for the ChangeLog
    Object.keys(updates).forEach(field => {
        if (Array.isArray(updates[field])) {
            const oldArray = tutor[field] || [];
            const newArray = updates[field];
            if (oldArray.join(',') !== newArray.join(',')) {
                changesToLog.push({ field, oldValue: oldArray, newValue: newArray });
                if (criticalFields.includes(field)) {
                    criticalChanged = true;
                }
            }
        } else if (updates[field] !== undefined && updates[field] !== tutor[field]) {
            // Ignore tracking file path changes for simplicity, track data fields
            if (field !== 'profileImage') {
                changesToLog.push({ field, oldValue: tutor[field], newValue: updates[field] });
            }
            if (criticalFields.includes(field)) {
                criticalChanged = true;
            }
        }
    });

    if (changesToLog.length === 0 && !req.file) {
        return res.json({ success: true, message: 'No changes detected.', data: tutor });
    }

    // Append to audit log
    if (changesToLog.length > 0) {
        tutor.changeLog.push(...changesToLog.map(c => ({
            ...c, changedAt: Date.now()
        })));
    }

    if (criticalChanged) {
        // Enforce 10-day lock
        const tenDaysMs = 10 * 24 * 60 * 60 * 1000;
        const msSinceCreation = Date.now() - new Date(tutor.createdAt).getTime();

        if (msSinceCreation < tenDaysMs) {
            return next(new AppError('Critical profile fields (College, Area, Subjects) cannot be edited within the first 10 days of account creation. Contact support to fix errors.', 403));
        }

        // Trigger Re-Review
        tutor.status = 'PENDING';
        tutor.verificationNote = 'System Auto-Flag: Critical fields updated by tutor post-approval. Escrowed for Re-Verification.';
        tutor.lastCriticalUpdateAt = Date.now();
        tutor.statusTimeline.push({
            status: 'PENDING',
            changedAt: Date.now(),
            changedBy: req.user._id,
            note: 'Tutor edited critical fields'
        });
    }

    // Apply updates manually to trigger the `.pre('save')` completeness hook
    Object.keys(updates).forEach(key => {
        tutor[key] = updates[key];
    });

    await tutor.save(); // This runs the Completeness Score generator!

    res.json({
        success: true,
        message: criticalChanged ? 'Profile updated. Critical changes detected: Your profile is now locked for Admin Re-review.' : 'Profile updated successfully.',
        data: tutor
    });
});

export const uploadProof = catchAsync(async (req, res, next) => {
    const { type } = req.body; // 'idProof' or 'introVideo'
    if (!type || !['idProof', 'introVideo'].includes(type)) {
        return next(new AppError('Invalid proof type', 400));
    }

    if (!req.file) {
        return next(new AppError('Please provide a file', 400));
    }

    const tutor = await Tutor.findOne({ userId: req.user._id });
    if (!tutor) return next(new AppError('Tutor profile not found', 404));

    const fileUrl = `/uploads/${type === 'idProof' ? 'proofs' : 'videos'}/${req.file.filename}`;

    if (type === 'idProof') tutor.idProofUrl = fileUrl;
    if (type === 'introVideo') tutor.introVideoUrl = fileUrl;

    await tutor.save();

    res.status(200).json({
        success: true,
        message: 'File successfully recorded as proof',
        data: {
            idProofUrl: tutor.idProofUrl,
            introVideoUrl: tutor.introVideoUrl,
            completenessScore: tutor.completenessScore
        }
    });
});
