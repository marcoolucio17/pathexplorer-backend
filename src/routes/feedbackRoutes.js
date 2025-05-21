const express = require('express');
const router = express.Router();
const { getFeedbackIfManager } = require('../controllers/feedbackController');

const authMiddleware = require('../middlewares/verifyHashToken');

router.get('/:idUsuarioObjetivo', authMiddleware, getFeedbackIfManager);

module.exports = router;
