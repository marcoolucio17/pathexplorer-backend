const express = require('express');

const { getProjects, getProjectById, addProject, updateProject } = require('../controllers/projectController');


const router = express.Router();

router.get('/projects', getProjects);

router.get('/projects/:id', getProjectById);



router.post('/projects', addProject);

router.patch('/projects/:id', updateProject);


module.exports = router;