import { Router } from 'express';
import { login, logout } from '../controllers/authController.js';

const router = Router();

// Ruta: POST /api/auth/login
router.post('/login', login);
router.post('/logout', logout);

export default router;