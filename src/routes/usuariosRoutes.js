import { Router } from 'express';
import { crearUsuario } from '../controllers/usuariosController.js';
import { obtenerUsuarios } from '../controllers/usuariosController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Ruta: POST /api/usuarios (Protegida con token)
router.post('/', verificarToken, crearUsuario);
router.get('/', verificarToken, obtenerUsuarios);

export default router;


