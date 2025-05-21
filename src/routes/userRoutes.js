const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const authMiddleware = require('../middlewares/verifyHashToken');

router.get('/usuario/:ID', authMiddleware, userController.getUserById);

module.exports = router;