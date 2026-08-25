import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secreto_super_seguro';

const obtenerToken = (req) => {
    const authHeader = req.headers.authorization;
    const tokenAutorizacion = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;
    const tokenCookie = req.headers.cookie?.match(/(?:^|; )token=([^;]+)/)?.[1];

    return tokenAutorizacion || tokenCookie;
};

const autenticar = (req) => {
    const token = obtenerToken(req);
    if (!token) {
        return { error: 'Token de acceso requerido. Acceso no autorizado.' };
    }

    try {
        return { usuario: jwt.verify(token, JWT_SECRET) };
    } catch {
        return { error: 'Token inválido o expirado.' };
    }
};

export const verificarToken = (req, res, next) => {
    const resultado = autenticar(req);
    if (resultado.error) {
        return res.status(resultado.error.includes('requerido') ? 403 : 401).json({ error: resultado.error });
    }

    req.user = resultado.usuario;
    next();
};

export const protegerVista = (req, res, next) => {
    const resultado = autenticar(req);
    if (resultado.error) {
        return res.redirect('/');
    }

    req.user = resultado.usuario;
    next();
};