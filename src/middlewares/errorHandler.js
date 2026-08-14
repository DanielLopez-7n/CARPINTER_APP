import { AppError } from '../utils/AppError.js';

// globalErrorHandler:
// - Atiende cualquier error que ocurra en la aplicación.
// - Convierte errores conocidos en mensajes fáciles de entender para el cliente.
// - En desarrollo muestra más detalles; en producción sólo muestra un mensaje simple.
export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Manejo de errores específicos de MySQL
  if (err.code === 'ER_DUP_ENTRY') {
    err = new AppError('Ya existe un registro con esos datos clave (registro duplicado).', 400);
  } else if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    err = new AppError('No se puede eliminar el registro porque está siendo utilizado en otra parte del sistema.', 409);
  }

  // Respuesta en Entorno de Desarrollo
  if (process.env.NODE_ENV !== 'production') {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack
    });
  }

  // Respuesta en Entorno de Producción
  if (err.isOperational) {
    // Error controlado (4xx)
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  // Error de programación o desconocido (500): No exponer detalles técnicos al cliente
  console.error('ERROR INESPERADO:', err);
  return res.status(500).json({
    status: 'error',
    message: 'Ha ocurrido un error interno en el servidor.'
  });
};