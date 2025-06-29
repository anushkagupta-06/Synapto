import express from 'express';
import { registerUser, loginUser } from '../controllers/authControllers.js';
import {googleLogin} from '../controllers/googleLoginController.js';
import { Passkey, PasskeyVerify ,PasskeyLogin,PasskeyVerifyLogin} from '../controllers/Passkey.js';


const router = express.Router();



router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post("/google-login", googleLogin);
router.post("/passkey", Passkey);
router.post('/passkey-verify', PasskeyVerify);
router.post('/passkey-login', PasskeyLogin);
router.post('/passkey-verify-login', PasskeyVerifyLogin);


export default router;