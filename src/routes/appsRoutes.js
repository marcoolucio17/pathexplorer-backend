const express = require('express');
const {
    getAppsByProjectId,
    getAppsByUserId,
    getUserAppInProject,
    patchAppStatus,
    createApp
} = require('../controllers/appsController');

const router = express.Router();

router.get('/aplicaciones/proyecto/:projectId', getAppsByProjectId); // GET: Todas las aplicaciones de un proyecto
router.get('/aplicaciones/usuario/:userId', getAppsByUserId); // GET: Todas las aplicaciones de un usuario
router.get('/aplicaciones/:userId/:appId', getUserAppInProject);  // GET: Aplicación de un usuario en un proyecto
router.patch('/aplicaciones/:userId/:appId', patchAppStatus);
router.post('/roles/:projectId', createApp);

module.exports = router;
