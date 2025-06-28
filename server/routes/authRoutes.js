import express from 'express';
import { registerUser, loginUser } from '../controllers/authControllers.js';
import {googleLogin} from '../controllers/googleLoginController.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post("/google-login", googleLogin);

export default router;