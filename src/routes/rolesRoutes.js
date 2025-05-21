const express = require('express');
const { 
    getRolesFunctions,
    addInfoRoles,
    updatesRole,
    deleteFunctionsReq } = require('../controllers/rolesController');

const router = express.Router();

router.get('/roles', getRolesFunctions);

router.post('/roles', addInfoRoles);

router.patch('/roles', updatesRole);

router.delete('/roles', deleteFunctionsReq);

module.exports = router;