import express from 'express';
import dotenv from 'dotenv';
import productosRoutes from './routes/productoRoutes.js';
import clientesRoutes from './routes/clientesRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/productos', productosRoutes);
app.use('/api/clientes', clientesRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});