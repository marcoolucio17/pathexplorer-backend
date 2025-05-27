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

const uploadClientImage = async (req, res) => {
  const { idcliente } = req.params;
  const file = req.file;

  if (!file) return res.status(400).json({ error: 'No se subió ningún archivo.' });

  try {
    const ruta = await clientesService.uploadClientImageToStorage(idcliente, file);
    res.status(200).json({ mensaje: 'Imagen subida correctamente.', ruta });
  } catch (error) {
    console.error('Error al subir la imagen del cliente:', error);
    res.status(500).json({ error: 'Error al subir la imagen del cliente.' });
  }
};

const getClienteById = async (req, res) => {
  const { idcliente } = req.params;

  try {
    const cliente = await clientesService.getClienteById(idcliente);
    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cliente.' });
  }
};


module.exports = {
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarCliente,
  uploadClientImage,
  getClienteById,
};
