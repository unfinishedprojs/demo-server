import { Router } from 'express';
import { getUsers, createUser } from '../controllers/userController';

const router = Router();

router.get('/', getUsers);

router.post('/register', createUser);

export default router;