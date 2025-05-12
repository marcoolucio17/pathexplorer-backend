const express = require('express');
const { authenticateUser, registerUser } = require('../controllers/authController');

const router = express.Router();

router.post('/authenticate', authenticateUser);
router.post('/register', registerUser);

module.exports = router;