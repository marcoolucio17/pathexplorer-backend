const express = require('express');
const {
    getAppsByProjectId,
    getAppsByUserId,
    getUserAppInProject,
    patchAppStatus,
    createApp
} = require('../controllers/appsController');

const router = express.Router();
const authMiddleware = require('../middlewares/verifyHashToken');

router.get('/aplicaciones/proyecto/:projectId', authMiddleware, getAppsByProjectId); // GET: Todas las aplicaciones de un proyecto
router.get('/aplicaciones/usuario/:userId', authMiddleware, getAppsByUserId); // GET: Todas las aplicaciones de un usuario
router.get('/aplicaciones/:userId/:appId', authMiddleware, getUserAppInProject);  // GET: Aplicación de un usuario en un proyecto
router.patch('/aplicaciones/:userId/:appId', authMiddleware, patchAppStatus);
router.post('/roles/:projectId', authMiddleware, createApp);

module.exports = router;
