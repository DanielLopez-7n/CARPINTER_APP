import { crearUsuarioService } from '../services/usuariosService.js';
import { obtenerUsuariosService } from '../services/usuariosService.js';


// Controlador para crear un nuevo usuario
export const crearUsuario = async (req, res) => {
    try {
        // Le pasamos los datos que llegan desde el formulario o Postman al Service
        const nuevoUsuario = await crearUsuarioService(req.body);
        
        return res.status(201).json({
            mensaje: '¡Usuario creado con éxito!',
            usuario: nuevoUsuario
        });

    } catch (error) {
        // Si el service lanza un error (ej. correo duplicado), lo capturamos aquí
        return res.status(400).json({ error: error.message });
    }
};

// Ruta: GET /api/usuarios (Protegida con token)

export const obtenerUsuarios = async (req, res, next) => {
    try {
        const usuarios = await obtenerUsuariosService();
        
        return res.status(200).json({
            status: 'success',
            total: usuarios.length,
            data: usuarios
        });
    } catch (error) {
        next(error);
    }
};