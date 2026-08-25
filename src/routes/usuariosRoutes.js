import { Router } from 'express';
import { crearUsuario } from '../controllers/usuariosController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Ruta: POST /api/usuarios (Protegida con token)
router.post('/', verificarToken, crearUsuario);

export default router;