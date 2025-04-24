const express = require('express');
const { getUsers, registerUser, authenticateUser } = require('../controllers/userController');

const router = express.Router();

router.post('/authenticate', authenticateUser);
router.post('/usuarios', registerUser);
router.get('/usuarios', getUsers);

module.exports = router;
