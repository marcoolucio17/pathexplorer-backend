const express = require('express');
const router = express.Router();
const certificationsController = require('../controllers/certificationsController');

// Crear un certificado
router.post('/certificados', certificationsController.createCertificate);

// Asignar un certificado a un empleado
router.post('/asignar-certificado', certificationsController.assignCertificateToEmployee);

// Obtener las certificaciones de un empleado
router.get('/certificados/empleado/:IDEmpleado', certificationsController.getCertificatesByEmployeeId);

module.exports = router;
