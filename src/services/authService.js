import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const autenticarUsuarioService = async (email, password) => {
    // 1. Buscar el usuario por su correo cruzando con los roles
    const [usuarios] = await pool.query(
        `SELECT u.*, r.nombre AS rol_nombre 
         FROM usuarios u 
         INNER JOIN roles r ON u.rol_id = r.id 
         WHERE u.email = ?`, 
        [email]
    );

    if (usuarios.length === 0) {
        throw new Error("Credenciales inválidas (Correo no encontrado)");
    }

    const usuario = usuarios[0];

    // 2. Verificar la contraseña con bcrypt
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
        throw new Error("Credenciales inválidas (Contraseña incorrecta)");
    }

    // 3. Si es vendedor, buscamos su lista de precios (zona) asignada
    let listaPrecioId = null;
    if (usuario.rol_nombre === 'vendedor') {
        const [vendedorData] = await pool.query(
            `SELECT id_lista_precio FROM vendedores WHERE usuario_id = ?`,
            [usuario.id]
        );
        if (vendedorData.length > 0) {
            listaPrecioId = vendedorData[0].id_lista_precio;
        }
    }

    // 4. Preparar los datos del Token JWT
    const tokenPayload = {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol_nombre,
        id_lista_precio: listaPrecioId
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || 'secreto_super_seguro', {
        expiresIn: '8h'
    });

    return {
        token,
        usuario: {
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol_nombre,
            id_lista_precio: listaPrecioId
        }
    };
};