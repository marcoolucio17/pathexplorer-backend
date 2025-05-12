const express = require('express');
const { 
    getAplicacionesByProject, 
    getAplicacionesByUser, 
    getAplicacionByUserAndId, 
    updateAplicacionStatus, 
    createAplicacion 
} = require('../controllers/appsController');

const router = express.Router();

// Rutas para las aplicaciones
router.get('/aplicaciones/:projectid', getAplicacionesByProject);
router.get('/aplicaciones/:userid', getAplicacionesByUser);
router.get('/aplicaciones/:userid&:aplicacionid', getAplicacionByUserAndId);
router.patch('/aplicaciones/:userid&:projectid', updateAplicacionStatus);
router.post('/aplicacion/:projectid', createAplicacion);

module.exports = router;
