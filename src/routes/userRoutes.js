const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/verifyHashToken');

router.get('/usuario/:ID', authMiddleware, userController.getUserById);
router.post('/usuario/upload/foto/:ID', authMiddleware, userController.uploadFotoPerfil);
router.post('/usuario/upload/cv/:ID', authMiddleware, userController.uploadCV);


module.exports = router;    