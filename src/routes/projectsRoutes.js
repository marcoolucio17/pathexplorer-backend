const express = require('express');

const { getProjects, 
    createProject, 
    updateProject, 
    uploadRFP, 
    getRFPUrl, 
    getProyectoCompleto, 
    getProyectoPorRol, 
    getProyectosPorCreador, 
    editarProyectoYRoles,
    borrarRelacionProyectoRol } = require('../controllers/projectController');

const authMiddleware = require('../middlewares/verifyHashToken');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');

router.get('/projects', authMiddleware, getProjects);

router.post('/projects', authMiddleware, createProject);

router.patch('/projects', authMiddleware, updateProject);

router.patch('/upload-rfp', authMiddleware, upload.single('file'), uploadRFP);

router.get('/:id/rfp', getRFPUrl);

router.get('/:id/por-rol/:idrol', authMiddleware, getProyectoPorRol); //proyecto completo por rol

router.get('/:id/completo', authMiddleware, getProyectoCompleto); //proyecto completo

router.get('/creador/:idusuario', authMiddleware, getProyectosPorCreador); //proyectos por creador

router.patch('/editprojects/:idproyecto', authMiddleware, editarProyectoYRoles); //editar proyecto y roles

router.delete('/delete-proyecto-rol/:idproyecto/:idrol', authMiddleware, borrarRelacionProyectoRol);

module.exports = router;