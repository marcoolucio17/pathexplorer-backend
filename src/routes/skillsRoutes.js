const express = require('express');
const { getHabilidadesPorTipo, assignSkill } = require('../controllers/skillsController');
const authMiddleware = require('../middlewares/verifyHashToken');
const router = express.Router();

router.get('/por-tipo', authMiddleware, getHabilidadesPorTipo);

router.post('/asignar', authMiddleware, assignSkill);

module.exports = router;
