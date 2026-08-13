import pool from '../config/db.js';

// 1. Obtener todos los clientes
export const obtenerClientes = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clientes ORDER BY codigo DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los clientes', error: error.message });
  }
};

// 2. Obtener un cliente por código
export const obtenerClientePorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM clientes WHERE codigo = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar el cliente', error: error.message });
  }
};

// 3. Crear un nuevo cliente (¡Tu función que quedó excelente!)
export const crearCliente = async (req, res) => {
  const { cliente, identificacion, e_mail, telefono, direccion } = req.body;

  if (!cliente || !identificacion) {
    return res.status(400).json({ mensaje: 'El nombre y el documento son obligatorios' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO clientes (cliente, identificacion, e_mail, telefono, direccion) VALUES (?, ?, ?, ?, ?)',
      [cliente, identificacion, e_mail || null, telefono || null, direccion || null]
    );
    res.status(201).json({
      mensaje: 'Cliente creado correctamente',
      clienteCodigo: result.insertId // Devuelve el nuevo 'codigo' autoincrementado
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear el cliente', error: error.message });
  }
};

// 4. Actualizar cliente
export const actualizarCliente = async (req, res) => {
  const { id } = req.params;
  const { cliente, identificacion, e_mail, telefono, direccion } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE clientes SET cliente = ?, identificacion = ?, e_mail = ?, telefono = ?, direccion = ? WHERE codigo = ?',
      [cliente, identificacion, e_mail, telefono, direccion, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    res.json({ mensaje: 'Cliente actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el cliente', error: error.message });
  }
};

// 5. Eliminar cliente
export const eliminarCliente = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM clientes WHERE codigo = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    res.json({ mensaje: 'Cliente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el cliente', error: error.message });
  }
};