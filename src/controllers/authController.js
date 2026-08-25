import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Buscar el usuario por su correo
        const [usuarios] = await pool.query(
            `SELECT u.*, r.nombre AS rol_nombre 
             FROM usuarios u 
             INNER JOIN roles r ON u.rol_id = r.id 
             WHERE u.email = ?`, 
            [email]
        );

        if (usuarios.length === 0) {
            return res.status(401).json({ error: "Credenciales inválidas (Correo no encontrado)" });
        }

        const usuario = usuarios[0];

        // 2. Verificar la contraseña con bcrypt
        const passwordValido = await bcrypt.compare(password, usuario.password);
        if (!passwordValido) {
            return res.status(401).json({ error: "Credenciales inválidas (Contraseña incorrecta)" });
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

        // 4. Generar el Token JWT (válido por 8 horas para su jornada de trabajo)
        const tokenPayload = {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol_nombre,
            id_lista_precio: listaPrecioId // ¡Clave para filtrar el catálogo luego!
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || 'secreto_super_seguro', {
            expiresIn: '8h'
        });

        // 5. Responder al cliente con el token y sus datos básicos
        res.json({
            mensaje: "¡Login exitoso!",
            token,
            usuario: {
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol_nombre,
                id_lista_precio: listaPrecioId
            }
        });

    } catch (error) {
        console.error("❌ Error en el login:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};