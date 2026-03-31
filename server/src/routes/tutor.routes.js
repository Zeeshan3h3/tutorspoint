import express from 'express';
import { createTutorProfile, getTutors, getTutorById, updateTutorProfile, getMyTutorProfile } from '../controllers/tutor.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { adminOrTutor } from '../middleware/role.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.post('/create', protect, upload.single('profileImage'), createTutorProfile);
router.get('/me/profile', protect, getMyTutorProfile);
router.get('/all', getTutors);
router.get('/:id', getTutorById);
router.put('/update', protect, upload.single('profileImage'), updateTutorProfile);

export default router;
