import express from 'express'; //Traemos todas las herramientas de la libreria express
import dotenv from 'dotenv';
import pool from './config/db.js';// Importamos la conexión a la base de datos

dotenv.config(); //Leemos el archivo .env y lo cargamos

const app = express(); //Creamos la aplicación y usamos la variable app para manejarla
const PORT = process.env.PORT || 3000; //Definimos el puerto en el que correrá la aplicación, si no está definido en el .env, usará 3000 por defecto

app.use(express.json()); //Middleware para que la aplicación pueda recibir y procesar datos en formato JSON

app.get('/', (req, res) => {
    res.send({mensaje: 'Backned de CARPINTER_APP esta activo.'}); //Creacion de la primera ruta (Endpoint) para verificar que el backend está activo
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`); //Le dice al servidor que escuche en el puerto definido y muestra un mensaje en la consola indicando que está corriendo
});