const express = require('express');

const { getProjects, createProject, updateProject } = require('../controllers/projectController');

const router = express.Router();

router.get('/projects', getProjects);

router.post('/projects',createProject);

router.patch('/projects', updateProject);
module.exports = router;