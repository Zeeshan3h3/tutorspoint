import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor', required: true },
    type: {
        type: String,
        enum: ['CREDIT_ADDED', 'CREDIT_SPENT', 'FREE_CREDIT', 'SUBSCRIPTION_PURCHASED'],
        required: true
    },
    amount: { type: Number, required: true }, // Negative for spent, positive for added
    description: { type: String },
    referenceId: { type: mongoose.Schema.Types.ObjectId }, // generic ref (Requirement ID, etc.)
    balanceAfter: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);
