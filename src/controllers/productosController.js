import pool from '../config/db.js';

// 1. Obtener todos los productos
export const obtenerProductos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM productos LIMIT 50');
        res.json({ total: rows.length, data: rows });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ mensaje: 'Error al consultar productos', error: error.message });
    }
};

// 2. Obtener un solo producto por ID
export const obtenerProductoPorId = async (req, res) => {
    try {
        const { id } = req.params; // Captura el ID que viene en la URL

        const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        res.json(rows[0]); // Devolvemos solo el objeto del producto encontrado
    } catch (error) {
        console.error('Error al buscar el producto:', error);
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

// 3. Crear un nuevo producto
export const crearProducto = async (req, res) => {
    try {
        const { codigo, articulo, precio_venta, stock_cantidad, costo_promedio } = req.body;

        // Validación básica
        if (!articulo || !precio_venta) {
            return res.status(400).json({ mensaje: 'El nombre del artículo y el precio son obligatorios' });
        }

        const sql = `
            INSERT INTO productos (codigo, articulo, precio_venta, stock_cantidad, costo_promedio) 
            VALUES (?, ?, ?, ?, ?)
        `;

        const [resultado] = await pool.query(sql, [
            codigo || null, 
            articulo, 
            precio_venta, 
            stock_cantidad || 0, 
            costo_promedio || 0
        ]);

        res.status(201).json({
            mensaje: 'Producto creado exitosamente',
            id_generado: resultado.insertId
        });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ mensaje: 'Error al guardar el producto', error: error.message });
    }
};

// 4. Actualizar un producto existente
export const actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params; // Capturamos el ID de la URL
        const { codigo, articulo, precio_venta, stock_cantidad, costo_promedio } = req.body;

        const sql = `
            UPDATE productos 
            SET codigo = ?, articulo = ?, precio_venta = ?, stock_cantidad = ?, costo_promedio = ?
            WHERE id = ?
        `;

        const [resultado] = await pool.query(sql, [
            codigo, articulo, precio_venta, stock_cantidad, costo_promedio, id
        ]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'No se encontró el producto para actualizar' });
        }

        res.json({ mensaje: 'Producto actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
    }
};

// 5. Eliminar un producto
export const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await pool.query('DELETE FROM productos WHERE id = ?', [id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'No se encontró el producto para eliminar' });
        }

        res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
    }
};