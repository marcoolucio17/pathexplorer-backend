const express = require('express');

const { getProjects } = require('../controllers/projectController');
const { getProjectById } = require('../controllers/projectController');

const router = express.Router();

router.get('/projects', getProjects);

router.get('/projects/:id', getProjectById);

module.exports = router;