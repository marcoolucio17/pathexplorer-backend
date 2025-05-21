const express = require('express');
const router = express.Router();
const certificationsController = require('../controllers/certificationsController');
const upload = require('../middlewares/uploadMiddleware');

router.post(
  '/certificados',
  upload.single('imagen'),
  certificationsController.createCertificate
);

router.post(
  '/certificados/asignar',
  certificationsController.assignCertificateToEmployee
);

router.get(
  '/certificados/empleado/:idempleado',
  certificationsController.getCertificatesByEmployeeId
);

module.exports = router;
