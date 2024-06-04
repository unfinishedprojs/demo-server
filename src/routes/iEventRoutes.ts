import { Router } from 'express';
import { suggest, voteNegative, votePositive } from '../controllers/iEventController';

const router = Router();

// router.get('/', getUsers); // Get all active invite events pls tyvm

router.post('/suggest', suggest);

router.post('/vote/positive', votePositive)
router.post('/vote/negative', voteNegative)

export default router;