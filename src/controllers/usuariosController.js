import { crearUsuarioService } from '../services/usuariosService.js';

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