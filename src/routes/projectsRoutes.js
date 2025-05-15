const express = require('express');

const { getProjects, getProjectById, createProject } = require('../controllers/projectController');

const router = express.Router();

router.get('/projects', getProjects);

router.get('/projects/:id', getProjectById);

router.post('/projects',createProject);

module.exports = router;