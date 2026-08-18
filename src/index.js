import express from 'express';
import clientesRoutes from './routes/clientesRoutes.js';
import productosRoutes from './routes/productosRoutes.js';
import vendedoresRoutes from './routes/vendedoresRoutes.js';
import pedidosRoutes from './routes/pedidosRoutes.js';
import { AppError } from './utils/AppError.js';
import { globalErrorHandler } from './middlewares/errorHandler.js';


const app = express();

// Middlewares base
app.use(express.json());

// Endpoint de Monitoreo (Health Check)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Registro de Rutas de la API
app.use('/api/clientes', clientesRoutes);
app.use('/api/vendedores', vendedoresRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/pedidos', pedidosRoutes);

// Manejo de Rutas Inexistentes (404)
app.all(/(.*)/, (req, res, next) => {
  next(new AppError(`No se pudo encontrar la ruta ${req.originalUrl} en este servidor.`, 404));
});

// Middleware Centralizado de Errores (debe ir siempre al final)
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en: http://localhost:${PORT} en modo [${process.env.NODE_ENV || 'development'}]`);
});