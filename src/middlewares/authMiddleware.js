import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato: Bearer TOKEN

    if (!token) {
        return res.status(403).json({ error: "Token de acceso requerido. Acceso no autorizado." });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'secreto_super_seguro', (err, usuario) => {
        if (err) {
            return res.status(401).json({ error: "Token inválido o expirado." });
        }
        
        req.user = usuario; // Guardamos los datos del usuario decodificados para usarlos en la ruta
        next(); // Permite continuar con la petición
    });
};