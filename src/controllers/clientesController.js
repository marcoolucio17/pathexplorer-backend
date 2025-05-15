const {
  fetchClientes,
  fetchClientePorId,
  insertarCliente,
  modificarCliente
} = require('../services/clientesService');

const obtenerClientes = async (req, res) => {
  try {
    const data = await fetchClientes();
    res.json(data);
  } catch (error) {
    console.error('Error al obtener clientes:', error.message);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
};

const obtenerClientePorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = await fetchClientePorId(id);
    if (!data) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(data);
  } catch (error) {
    console.error('Error al obtener cliente por ID:', error.message);
    res.status(500).json({ error: 'Error al obtener cliente' });
  }
};

const crearCliente = async (req, res) => {
  try {
    const { clnombre, inversion, fotodecliente } = req.body;
    const nuevoCliente = await insertarCliente({ clnombre, inversion, fotodecliente });
    res.status(201).json(nuevoCliente);
  } catch (error) {
    console.error('Error al crear cliente:', error.message);
    res.status(500).json({ error: 'Error al crear cliente' });
  }
};

const actualizarCliente = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { clnombre, inversion, fotodecliente } = req.body;
    const actualizado = await modificarCliente(id, { clnombre, inversion, fotodecliente });
    res.json(actualizado);
  } catch (error) {
    console.error('Error al actualizar cliente:', error.message);
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
};

module.exports = {
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarCliente,
};
