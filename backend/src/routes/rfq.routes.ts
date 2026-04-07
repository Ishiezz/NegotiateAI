import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', protect, (_req, res) => res.json({ rfqs: [], pagination: {} }));
router.post('/', protect, authorize('buyer'), (_req, res) => res.status(201).json({ message: 'RFQ created' }));
router.post('/:id/quote', protect, authorize('seller'), (_req, res) => res.json({ message: 'Quote submitted' }));

export default router;