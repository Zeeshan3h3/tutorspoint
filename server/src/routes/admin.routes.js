import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { adminOnly } from '../middleware/role.middleware.js';
import {
    getAllTutors,
    getTutorDetails,
    updateTutorStatus,
    verifyTutor,
    suspendTutor,
    getAreaDensityInsights,
    getAdminRequirements,
    updateRequirementStatus,
    getRevenueInsights,
    getReferralInsights,
    adjustReferralCredits,
    toggleTrustedTutor,
    getTutorForReview,
    submitTutorReview
} from '../controllers/admin.controller.js';

const router = express.Router();

router.use(protect, adminOnly); // Protect all routes in this file

router.get('/tutors', getAllTutors);
router.get('/tutors/:id', getTutorDetails);
router.patch('/tutors/:id/status', updateTutorStatus);
router.patch('/tutors/:id/verify', verifyTutor);
router.patch('/tutors/:id/suspend', suspendTutor);
router.patch('/tutors/:id/trust', toggleTrustedTutor);
router.patch('/tutors/:id/credits', adjustReferralCredits);

// Review Cockpit
router.get('/tutors/:id/review', getTutorForReview);
router.patch('/tutors/:id/review', submitTutorReview);

router.get('/insights/area-density', getAreaDensityInsights);
router.get('/insights/revenue', getRevenueInsights);
router.get('/insights/referrals', getReferralInsights);

router.get('/requirements', getAdminRequirements);
router.patch('/requirements/:id/status', updateRequirementStatus);

export default router;
