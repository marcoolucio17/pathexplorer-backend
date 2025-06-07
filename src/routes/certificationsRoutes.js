const express = require('express');
const router = express.Router();
const certificationsController = require('../controllers/certificationsController');
const upload = require('../middlewares/uploadMiddleware');
const authMiddleware = require('../middlewares/verifyHashToken');

router.post('/certificados', upload.single('imagen'), certificationsController.createCertificate);

router.post('/certificados/asignar', certificationsController.assignCertificateToEmployee);

router.get('/certificados/empleado/:id', certificationsController.getCertificatesByEmployeeId);


// Subida de imagen
router.post('/certificaciones/upload-image/:id', authMiddleware, upload.single('file'), certificationsController.uploadCertificateImage);

// Obtener URL firmada
router.get('/certificaciones/image-url/:id', authMiddleware, certificationsController.getCertificateImageSignedUrl);

router.put('/certificados/:id', certificationsController.updateCertificateController);

router.delete('/certificaciones/:id', authMiddleware, certificationsController.removeCertification);


module.exports = router;
