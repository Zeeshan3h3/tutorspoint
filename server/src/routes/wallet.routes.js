import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { getMyTransactions, simulateUpiTopup, subscribePro } from '../controllers/wallet.controller.js';

const router = express.Router();

router.use(protect); // Only logged in users (Tutors) can access their wallet

router.get('/transactions', getMyTransactions);
router.post('/topup/upi', simulateUpiTopup);
router.post('/subscribe-pro', subscribePro);

export default router;
