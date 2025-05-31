const express = require('express');

const { getProjects, createProject, updateProject, uploadRFP, getRFPUrl, getProyectoCompleto, getProyectoPorRol  } = require('../controllers/projectController');
const authMiddleware = require('../middlewares/verifyHashToken');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');

router.get('/projects', authMiddleware, getProjects);

router.post('/projects', authMiddleware, createProject);

router.patch('/projects', authMiddleware, updateProject);

router.post('/upload-rfp', authMiddleware, upload.single('file'), uploadRFP);

router.get('/:id/rfp', getRFPUrl);

router.get('/:id/por-rol/:idrol', authMiddleware, getProyectoPorRol); //proyecto completo por rol
router.get('/:id/completo', authMiddleware, getProyectoCompleto); //proyecto completo


module.exports = router;