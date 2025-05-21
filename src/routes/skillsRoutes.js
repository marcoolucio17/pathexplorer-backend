const express = require('express');
const { getHabilidadesPorTipo } = require('../controllers/skillsController');
const authMiddleware = require('../middlewares/verifyHashToken');
const router = express.Router();

router.get('/por-tipo', authMiddleware, getHabilidadesPorTipo);

module.exports = router;
