const express = require('express');
const { getRoles, getRoleById } = require('../controllers/rolesController');

const router = express.Router();

router.get('/roles', getRoles);

router.get('/roles/:id', getRoleById);

module.exports = router;