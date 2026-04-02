import mongoose from 'mongoose';

const tutorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

    // Basic Info
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },

    // Academic Details
    college: { type: String, trim: true, required: [true, 'College name is required'] },
    degree: { type: String },
    graduationYear: { type: String },
    collegeEmail: { type: String, trim: true },

    // Location & Teaching Preferences
    area: { type: String, required: [true, 'Please provide your locality/area'] },
    teachingRadius: { type: Number, default: 5 },
    teachingMode: { type: String, enum: ['Home Tuition', 'Online', 'Both', 'Any'] },

    // Teaching Details
    subjects: {
        type: [String],
        required: true,
        validate: [v => v.length > 0, 'At least one subject is required']
    },
    classesHandled: [{ type: String }],
    experience: { type: Number }, // in years
    teachingStyle: { type: String },

    // Pricing
    expectedFeesMin: { type: Number },
    expectedFeesMax: { type: Number },
    isNegotiable: { type: Boolean, default: true },

    // Profile Content
    bio: { type: String, maxlength: 500 },
    whyChooseMe: { type: String, maxlength: 500 },

    // Trust Boosters & Media
    profileImage: { type: String, required: [true, 'A professional profile photo is required'] },
    idProofUrl: { type: String },
    introVideoUrl: { type: String },
    certificates: [{
        title: String,
        url: String
    }],

    // Verification & Admin Control
    verificationTypes: {
        phoneVerified: { type: Boolean, default: false },
        collegeEmailVerified: { type: Boolean, default: false },
        manualApproved: { type: Boolean, default: false },
        idVerified: { type: Boolean, default: false }
    },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED', 'REMOVED', 'SUSPENDED'],
        default: 'PENDING'
    },
    trustedTutor: { type: Boolean, default: false },
    adminChecklist: {
        identityChecked: { type: Boolean, default: false },
        academicChecked: { type: Boolean, default: false },
        teachingChecked: { type: Boolean, default: false },
        locationChecked: { type: Boolean, default: false },
        qualityChecked: { type: Boolean, default: false }
    },
    verificationNote: String,
    rejectedReason: String,

    // Audit & Timelines
    statusTimeline: [{
        status: String,
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        note: String
    }],
    changeLog: [{
        field: String,
        oldValue: mongoose.Schema.Types.Mixed,
        newValue: mongoose.Schema.Types.Mixed,
        changedAt: { type: Date, default: Date.now }
    }],
    approvedAt: Date,
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    removedAt: Date,
    lastLogin: Date,

    // Fraud & Security
    fraudFlags: [{
        reason: String,
        flaggedAt: { type: Date, default: Date.now }
    }],

    // Wallet & Monetization
    credits: { type: Number, default: 0 },
    receivedFreeCredits: { type: Boolean, default: false },
    isProUser: { type: Boolean, default: false },
    subscriptionStartDate: { type: Date },
    subscriptionEndDate: { type: Date },

    // New Profile Management Edit Constraints
    lastUpdatedAt: { type: Date, default: Date.now },
    lastCriticalUpdateAt: { type: Date },
    completenessScore: { type: Number, default: 0 }

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual property for lead unlocking
// Only APPROVED tutors are allowed to unlock leads
tutorSchema.virtual('canUnlockLeads').get(function () {
    return this.status === 'APPROVED';
});

// Auto-calculate Profile Completeness & Trust Score (Max 100)
tutorSchema.pre('save', function (next) {
    let score = 0;

    // 50% base score mapping to the mandatory friction points
    if (this.profileImage) score += 10;
    if (this.college) score += 20;
    if (this.subjects && this.subjects.length > 0) score += 20;

    // 50% Trust Boosters
    if (this.idProofUrl || this.verificationTypes?.idVerified) score += 25;
    if (this.introVideoUrl) score += 25;

    // We can also add incremental points for new fields without breaking the 100 ceiling.
    if (score < 100 && this.bio && this.whyChooseMe) score += 10;
    if (score < 100 && this.teachingMode && this.expectedFeesMin) score += 10;

    this.completenessScore = Math.min(score, 100);
    this.lastUpdatedAt = Date.now();

    next();
});

export default mongoose.model('Tutor', tutorSchema);
