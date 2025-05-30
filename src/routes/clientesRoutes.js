const express = require('express');
const {
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarCliente,
  uploadClienteImage,
  getClienteWithFotoUrl
} = require('../controllers/clientesController');
const authMiddleware = require('../middlewares/verifyHashToken');

const router = express.Router();
const upload = require('../middlewares/uploadMiddleware'); 

router.get('/', authMiddleware, obtenerClientes);
router.get('/:id',authMiddleware, obtenerClientePorId);
router.post('/', crearCliente);
router.put('/:id', actualizarCliente);

// Subir imagen del cliente
router.post('/upload/:idcliente', authMiddleware, upload.single('file'), uploadClienteImage);

// Obtener cliente con URL de la imagen
router.get('/:idcliente/foto', authMiddleware, getClienteWithFotoUrl);


module.exports = router;
