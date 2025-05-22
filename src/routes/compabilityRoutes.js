const express = require('express');
const { getCompatibilitysFunctions } = require('../controllers/compabilityController');
const router = express.Router();

const authMiddleware = require('../middlewares/verifyHashToken');

router.get('/compability', authMiddleware, getCompatibilitysFunctions);

module.exports = router;