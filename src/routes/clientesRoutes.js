const express = require('express');
const {
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarCliente,
  uploadClientImage,
  getClienteById
} = require('../controllers/clientesController');

const router = express.Router();
const authMiddleware = require('../middlewares/verifyHashToken');
const upload = require('../middlewares/uploadMiddleware'); 

router.get('/', obtenerClientes);
router.get('/:id', obtenerClientePorId);
router.post('/', crearCliente);
router.put('/:id', actualizarCliente);

router.post('/upload-image/:idcliente', upload.single('file'), uploadClientImage);
router.get('/:idcliente', getClienteById);

module.exports = router;
