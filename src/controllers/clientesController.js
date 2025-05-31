const {
  fetchClientes,
  fetchClientePorId,
  insertarCliente,
  modificarCliente,
  uploadClienteFoto, 
  getClienteConFotoUrl
} = require('../services/clientesService');

const clientesService = require('../services/clientesService');

const obtenerClientes = async (req, res) => {
  try {
    const data = await fetchClientes();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error al obtener clientes:', error.message);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
};

const obtenerClientePorId = async (req, res) => {
  const { id } = req.params;

  try {
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

const uploadClienteImage = async (req, res) => {
  try {
    const { idcliente } = req.params;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'No se envió ninguna imagen.' });

    const filename = await clientesService.uploadClienteFoto(idcliente, file);
    res.status(200).json({ message: 'Imagen subida correctamente.', filename });
  } catch (error) {
    console.error('Error al subir la imagen del cliente:', error);
    res.status(500).json({ error: 'Error al subir la imagen del cliente.' });
  }
};

// Obtener URL pública de la imagen
const getClienteWithFotoUrl = async (req, res) => {
  try {
    const { idcliente } = req.params;
    const cliente = await clientesService.getClienteFotoUrl(idcliente);
    res.status(200).json(cliente);
  } catch (error) {
    console.error('Error al obtener el cliente:', error);
    res.status(500).json({ error: 'Error al obtener el cliente con URL de la imagen.' });
  }
};  

module.exports = {
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarCliente,
  uploadClienteImage,
  getClienteWithFotoUrl
};
