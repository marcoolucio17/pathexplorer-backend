const express = require('express');
const {
    getAppsByProjectId,
    getAppsByUserId,
    getUserAppInProject,
    patchAppStatus,
    createApp,
    getAplicacionesPorCreador,
    aceptarAplicacion,
    getAppsByStatus
} = require('../controllers/appsController');

const router = express.Router();
const authMiddleware = require('../middlewares/verifyHashToken');

// GET: Todas las apps de un proyecto
router.get('/apps/proyecto/:projectId', authMiddleware, getAppsByProjectId);

// GET: Todas las apps de un usuario
router.get('/apps/usuario/:userId', authMiddleware, getAppsByUserId);

// GET: Una app específica de un usuario
router.get('/apps/usuario/:userId/app/:appId', authMiddleware, getUserAppInProject);

// PATCH: Cambiar el estatus de una app
router.patch('/apps/usuario/:userId/app/:appId', authMiddleware, patchAppStatus);

// POST: Crear nueva aplicación     
router.post('/apps', authMiddleware, createApp);

// GET: Aplicaciones que se ha hecho a un proyecto de un manager
router.get('/creador/:idusuario/aplicaciones', authMiddleware, getAplicacionesPorCreador);

// asignar proyecto
router.post('/aplicacion/:id/aceptar', authMiddleware, aceptarAplicacion);

//apps por estatus
router.get('/apps/estatus/:estatus', authMiddleware, getAppsByStatus);

module.exports = router;
