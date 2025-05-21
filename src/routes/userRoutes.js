const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const authMiddleware = require('../middlewares/verifyHashToken');

// de esto -> router.get('/usuario/:ID', userController.getUserById);
router.get('/usuario/:ID', authMiddleware, userController.getUserById); // a esto 

module.exports = router;