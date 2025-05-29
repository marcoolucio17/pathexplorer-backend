const express = require('express');
const { getHabilidadesPorTipo, getTodasHabilidades } = require('../controllers/skillsController');
const authMiddleware = require('../middlewares/verifyHashToken');
const router = express.Router();

router.get('/por-tipo', authMiddleware, getHabilidadesPorTipo);

router.get('', authMiddleware, getTodasHabilidades);
module.exports = router;
