import { Router } from 'express';
import { getIEvents, suggest, voteNegative, votePositive } from '../controllers/iEventController';

const router = Router();

router.get('/', getIEvents); // Get all active invite events pls tyvm

router.post('/suggest', suggest);

// Voting on active IEvents

router.post('/vote/positive', votePositive)
router.post('/vote/negative', voteNegative)

export default router;