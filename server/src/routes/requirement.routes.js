import express from 'express';
import {
    createRequirement,
    getRequirements,
    getRequirementById,
    applyToRequirement
} from '../controllers/requirement.controller.js';
import { protect, optionalAuth, requireApprovedTutor } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = express.Router();

// Public list (masked phone)
router.get('/', getRequirements);

// Get single requirement — increment views, reveal phone if tutor/applied
router.get('/:id', optionalAuth, getRequirementById);

// Post a requirement — must be logged in (student/parent)
router.post('/', protect, createRequirement);

// Apply to requirement — must be a tutor
router.post('/:id/apply', protect, requireApprovedTutor, applyToRequirement);

export default router;
