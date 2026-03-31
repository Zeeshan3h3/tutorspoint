import express from 'express';
import { getPendingTutors, approveTutor } from '../controllers/admin.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { adminOnly } from '../middleware/role.middleware.js';

const router = express.Router();

router.get('/tutors/pending', protect, adminOnly, getPendingTutors);
router.put('/tutor/approve/:id', protect, adminOnly, approveTutor);

export default router;
