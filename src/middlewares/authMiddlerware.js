// Middleware para verificar rol de Administrador
export const esAdmin = (req, res, next) => {
  if (req.usuario && req.usuario.rol === 'administrador') {
    return next();
  }
  return res.status(403).json({
    status: 'fail',
    message: 'Acceso denegado. Se requieren permisos de Administrador.'
  });
};