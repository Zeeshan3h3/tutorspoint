import mongoose from 'mongoose';

const requirementSchema = new mongoose.Schema({
    // Who posted
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postedByName: { type: String, required: true },

    // Academic info
    classLevel: { type: String, required: true },
    subjects: [{ type: String }],
    board: { type: String },
    medium: { type: String },
    daysPerWeek: { type: Number },

    // Location
    area: { type: String, required: true },
    pinCode: { type: String },

    // Budget
    budgetMin: { type: Number, required: true },
    budgetMax: { type: Number, required: true },
    sessionsPerMonth: { type: Number, default: 12 },

    // Teaching mode
    classMode: {
        type: String,
        enum: ["Home Tuition", "Tutor's Place", "Online", "Flexible"],
        required: true
    },

    // Preferences
    genderPreference: {
        type: String,
        enum: ['Male', 'Female', 'No Preference'],
        default: 'No Preference'
    },
    startTiming: {
        type: String,
        enum: ['Immediately', 'Within 1 Week', 'Flexible'],
        default: 'Flexible'
    },

    // Contact
    contactType: { type: String, enum: ['Student', 'Parent'], default: 'Parent' },
    phone: { type: String, required: true },

    // Optional message
    message: { type: String, default: '' },

    // Stats
    views: { type: Number, default: 0 },
    appliedTutors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    status: { type: String, enum: ['open', 'matched', 'closed'], default: 'open' }
}, { timestamps: true });

export default mongoose.model('Requirement', requirementSchema);
