import express from 'express';
import { signIn, getUserByPhone, getAllUsers } from '../controllers/authController.js';

const router = express.Router();

router.post('/signin', signIn);
router.get('/user/:phone', getUserByPhone);
router.get('/users', getAllUsers);

export default router;
