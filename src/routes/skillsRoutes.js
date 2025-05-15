const express = require('express');
const { getHabilidadesPorTipo } = require('../controllers/skillsController');

const router = express.Router();

router.get('/por-tipo', getHabilidadesPorTipo);

module.exports = router;
