import { Router } from 'express';
import { createInvites } from '../controllers/adminController';

const router = Router();

router.post('/createInvite', createInvites);

export default router;