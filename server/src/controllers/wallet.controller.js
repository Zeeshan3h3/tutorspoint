import Transaction from '../models/Transaction.js';
import Tutor from '../models/Tutor.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

// GET /api/wallet/transactions
export const getMyTransactions = catchAsync(async (req, res, next) => {
    const tutor = await Tutor.findOne({ userId: req.user._id });
    if (!tutor) return next(new AppError('Tutor profile not found', 404));

    const transactions = await Transaction.find({ tutorId: tutor._id })
        .sort({ createdAt: -1 })
        .limit(50); // limit to 50 for MVP

    res.status(200).json({
        success: true,
        data: {
            balance: tutor.credits,
            transactions
        }
    });
});

// POST /api/wallet/topup/upi  (Simulated Manual Topup for MVP)
export const simulateUpiTopup = catchAsync(async (req, res, next) => {
    const { amount, transactionId } = req.body;

    if (!amount || amount < 10) return next(new AppError('Minimum topup is ₹10', 400));
    if (!transactionId) return next(new AppError('UPI Transaction ID is required', 400));

    const tutor = await Tutor.findOne({ userId: req.user._id });
    if (!tutor) return next(new AppError('Tutor profile not found', 404));

    // SIMULATED: Instantly approve topup (In production, admin would approve or Razorpay webhook handles this)
    tutor.credits += Number(amount);
    await tutor.save();

    const transaction = await Transaction.create({
        tutorId: tutor._id,
        type: 'CREDIT_ADDED',
        amount: Number(amount),
        description: `UPI Top-up (Ref: ${transactionId})`,
        referenceId: null,
        balanceAfter: tutor.credits
    });

    res.status(200).json({
        success: true,
        message: `${amount} credits added successfully!`,
        data: { balance: tutor.credits, transaction }
    });
});

// POST /api/wallet/subscribe-pro
export const subscribePro = catchAsync(async (req, res, next) => {
    const tutor = await Tutor.findOne({ userId: req.user._id });
    if (!tutor) return next(new AppError('Tutor profile not found', 404));

    if (tutor.isProUser && tutor.subscriptionEndDate > new Date()) {
        return next(new AppError('You already have an active Pro subscription', 400));
    }

    // SIMULATED: We assume the 199 INR payment was successful
    tutor.isProUser = true;
    tutor.subscriptionStartDate = new Date();

    // Set expiry to 30 days from now
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    tutor.subscriptionEndDate = expiry;

    // Grant 250 Credits
    tutor.credits += 250;
    await tutor.save();

    const transaction = await Transaction.create({
        tutorId: tutor._id,
        type: 'SUBSCRIPTION_PURCHASED',
        amount: 250,
        description: 'Pro Subscription: 250 Credits Granted',
        referenceId: null,
        balanceAfter: tutor.credits
    });

    res.status(200).json({
        success: true,
        message: 'Successfully upgraded to Pro! 250 Credits have been added to your wallet.',
        data: { tutor, transaction }
    });
});
