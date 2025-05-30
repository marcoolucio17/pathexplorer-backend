const express = require('express');
const { getHabilidadesPorTipo, assignSkill, getTodasHabilidades } = require('../controllers/skillsController');
const authMiddleware = require('../middlewares/verifyHashToken');
const router = express.Router();

router.get('/por-tipo', authMiddleware, getHabilidadesPorTipo);

router.post('/asignar', authMiddleware, assignSkill);

router.get('', authMiddleware, getTodasHabilidades);

module.exports = router;
module.exports = router;
