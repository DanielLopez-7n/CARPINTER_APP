import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import readline from 'readline';
import dotenv from 'dotenv';

dotenv.config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function crearSuperUser() {
    try {
        console.log("==========================================");
        console.log("👤 ASISTENTE DE CREACIÓN DE SUPERADMIN");
        console.log("==========================================");

        const nombre = await question("Nombre del Administrador: ");
        const email = await question("Correo electrónico: ");
        const passwordPlana = await question("Contraseña: ");

        if (!email || !passwordPlana || !nombre) {
            console.log("❌ Todos los campos son obligatorios.");
            rl.close();
            return;
        }

        // Encriptar la contraseña con bcrypt
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(passwordPlana, salt);

        // Rol ID 1 (Asumimos que el 1 es Administrador en tu tabla roles)
        const rolId = 1;

        const sql = `
            INSERT INTO usuarios (nombre, email, password, rol_id)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE password = VALUES(password), nombre = VALUES(nombre);
        `;

        await pool.query(sql, [nombre, email, passwordHash, rolId]);

        console.log("\n✅ ¡Superadministrador creado o actualizado con éxito en MySQL!");

    } catch (error) {
        console.error("❌ Error al crear el superadmin:", error);
    } finally {
        rl.close();
        await pool.end();
    }
}

crearSuperUser();