const express = require('express');
const { 
    getRolesFunctions,
    addInfoRoles,
    updatesRole,
    deleteFunctionsReq } = require('../controllers/rolesController');

const router = express.Router();
const authMiddleware = require('../middlewares/verifyHashToken');

router.get('/roles', authMiddleware, getRolesFunctions);

router.post('/roles', authMiddleware, addInfoRoles);

router.patch('/roles', authMiddleware, updatesRole);

router.delete('/roles', authMiddleware, deleteFunctionsReq);

module.exports = router;