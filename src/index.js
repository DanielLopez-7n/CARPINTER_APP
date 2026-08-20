/**
 * ============================================================================
 * MÓDULOS DE TERCEROS Y LIBRERÍAS
 * ============================================================================
 */
// Módulo principal del framework web Express
import express from 'express';

// Módulos nativos para la resolución de rutas de archivos en entorno ECMAScript (ESM)
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * ============================================================================
 * MÓDULOS DE RUTAS DE LA APLICACIÓN
 * ============================================================================
 */
import clientesRoutes from './routes/clientesRoutes.js';
import productosRoutes from './routes/productosRoutes.js';
import vendedoresRoutes from './routes/vendedoresRoutes.js';
import pedidosRoutes from './routes/pedidosRoutes.js';
import enviosRoutes from './routes/enviosRoutes.js';

/**
 * ============================================================================
 * UTILIDADES Y MIDDLEWARES
 * ============================================================================
 */
import AppError from './utils/AppError.js';
import { globalErrorHandler } from './middlewares/errorHandler.js';

/**
 * ============================================================================
 * CONFIGURACIÓN DE RUTA ABSOLUTA (Requisito para Módulos ES)
 * ============================================================================
 * En ECMAScript Modules (ESM) __dirname no existe globalmente.
 * Se obtiene transformando la URL del archivo actual a una ruta del sistema operativo.
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicialización de la aplicación Express
const app = express();

/**
 * ============================================================================
 * MIDDLEWARES BASE DE LA APLICACIÓN
 * ============================================================================
 */
// Middleware para parsear y procesar solicitudes con cuerpo en formato JSON
app.use(express.json());

// Permite que el navegador cargue archivos públicos como hojas de estilos e imágenes.
app.use(express.static(path.join(__dirname, '../public')));

/**
 * ============================================================================
 * RUTAS PÚBLICAS Y VISTAS HTML
 * ============================================================================
 */

// 1. Ruta principal del Panel de Control (Dashboard)
app.get('/', (req, res) => {
  /**
   * Sirve la plantilla HTML almacenada en la carpeta 'templates'.
   * path.join construye la ruta compatible según el SO (Windows/Linux).
   */
  res.sendFile(path.join(__dirname, 'templates', 'dashboard.html'));
});

// 2. Endpoint de monitoreo técnico (Health Check)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 3. Rutas para vistas de envíos
app.get('/envios', (req, res) => res.sendFile(path.join(__dirname, 'templates', 'envios.html')));

// 4. Ruta para crear un nuevo envío (Formulario)
app.get('/envios/nuevo', (req, res) => res.sendFile(path.join(__dirname, 'templates', 'nuevo_envio.html')));
app.get('/envios/nuevo_envio', (req, res) => res.sendFile(path.join(__dirname, 'templates', 'nuevo_envio.html')));
/**
 * ============================================================================
 * REGISTRO DE RUTAS DE LA API (ENDPOINTS)
 * ============================================================================
 */
app.use('/api/clientes', clientesRoutes);
app.use('/api/vendedores', vendedoresRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/envios', enviosRoutes);

/**
 * ============================================================================
 * CONTROL DE RUTAS NO ENCONTRADAS (404) Y MANEJO DE ERRORES
 * ============================================================================
 * Este bloque debe ubicarse DESPUÉS de todas las rutas válidas para capturar
 * cualquier petición a URLs no registradas.
 */
app.all(/(.*)/, (req, res, next) => {
  next(new AppError(`No se pudo encontrar la ruta ${req.originalUrl} en este servidor.`, 404));
});

// Middleware centralizado para procesamiento de errores (Siempre al final)
app.use(globalErrorHandler);

/**
 * ============================================================================
 * INICIALIZACIÓN DEL SERVIDOR HTTP
 * ============================================================================
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en: http://localhost:${PORT} en modo [${process.env.NODE_ENV || 'development'}]`);
});