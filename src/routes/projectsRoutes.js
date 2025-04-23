const express = require('express');

const { getProjects, getProjectById, addProject } = require('../controllers/projectController');


const router = express.Router();

router.get('/projects', getProjects);

router.get('/projects/:id', getProjectById);

router.post('/projects', addProject);

module.exports = router;