const express = require('express');
const {
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarCliente
} = require('../controllers/clientesController');

const router = express.Router();

router.get('/', obtenerClientes);
router.get('/:id', obtenerClientePorId);
router.post('/', crearCliente);
router.put('/:id', actualizarCliente);

module.exports = router;
