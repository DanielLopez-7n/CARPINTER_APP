/**
 * Clase personalizada para errores operacionales del sistema
 */
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Identifica errores controlados de lógica de negocio

    Error.captureStackTrace(this, this.constructor);
  }
}