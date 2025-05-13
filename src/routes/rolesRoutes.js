const express = require('express');
const { 
    getRoles, 
    getRoleById,     
    addNewRole,
    updateRoleById } = require('../controllers/rolesController');

const router = express.Router();

router.get('/roles', getRoles);

router.get('/roles/:id', getRoleById);

router.post('/roles', addNewRole);

router.patch('/roles/:id', updateRoleById);
module.exports = router;