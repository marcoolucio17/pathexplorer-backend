const express = require('express');
const router = express.Router();
const { getFeedbackIfManager, asignarFeedback } = require('../controllers/feedbackController');
const authMiddleware = require('../middlewares/verifyHashToken');

// Primero rutas fijas
router.post('/asignar', authMiddleware, asignarFeedback);

// Luego la ruta dinámica (al final)
router.get('/:idUsuarioObjetivo', authMiddleware, getFeedbackIfManager);

module.exports = router;
