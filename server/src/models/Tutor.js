import mongoose from 'mongoose';

const tutorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    subjects: [{ type: String }],
    experience: { type: String },
    pricing: { type: String },
    area: { type: String },
    bio: { type: String },
    profileImage: { type: String, default: '' },
    isApproved: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Tutor', tutorSchema);
