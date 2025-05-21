const express = require('express');

const { getProjects, createProject, updateProject } = require('../controllers/projectController');
const authMiddleware = require('../middlewares/verifyHashToken');
const router = express.Router();

router.get('/projects', authMiddleware, getProjects);

router.post('/projects', authMiddleware, createProject);

router.patch('/projects', authMiddleware, updateProject);
module.exports = router;