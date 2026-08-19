import express from 'express';
import * as enviosController from '../controllers/enviosController.js';

const router = express.Router();

// Ruta para obtener clientes y transportadoras del formulario
router.get('/datos-formulario', enviosController.getDatosForm);

// Ruta para guardar un nuevo envío
router.post('/', enviosController.crearEnvio);

// Ruta para obtener todos los envíos registrados
router.get('/', enviosController.obtenerEnvios);

export default router;