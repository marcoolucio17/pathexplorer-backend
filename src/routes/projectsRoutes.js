const express = require('express');

const { getProjects, createProject, updateProject, uploadRFP, getRFPUrl  } = require('../controllers/projectController');
const authMiddleware = require('../middlewares/verifyHashToken');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');

router.get('/projects', authMiddleware, getProjects);

router.post('/projects', authMiddleware, createProject);

router.patch('/projects', authMiddleware, updateProject);

router.post('/upload-rfp', authMiddleware, upload.single('file'), uploadRFP);

router.get('/:id/rfp', getRFPUrl);

module.exports = router;