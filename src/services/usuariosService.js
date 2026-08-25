import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

export const crearUsuarioService = async (usuarioData) => {
    const { nombre, email, password, rol_id } = usuarioData;

    // 1. Verificamos que el correo no exista ya en la base de datos
    const [existe] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existe.length > 0) {
        throw new Error('Este correo ya está registrado en el sistema.');
    }

    // 2. Encriptamos la contraseña por seguridad
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Guardamos el usuario en la base de datos
    const sql = `INSERT INTO usuarios (nombre, email, password, rol_id) VALUES (?, ?, ?, ?)`;
    const [resultado] = await pool.query(sql, [nombre, email, passwordHash, rol_id]);

    // Retornamos los datos limpios (sin la contraseña) para confirmar la creación
    return { 
        id: resultado.insertId, 
        nombre, 
        email, 
        rol_id 
    };
};
 

// Servicio para obtener todos los usuarios desde la base de datos
export const obtenerUsuariosService = async () => {
    // Traemos todos los usuarios, pero sin la contraseña por seguridad
    const [usuarios] = await pool.query('SELECT id, nombre, email, rol_id, created_at FROM usuarios');
    return usuarios;
};