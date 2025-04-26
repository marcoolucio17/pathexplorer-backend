const express = require('express');

const { getSkills } = require('../controllers/skillsController');


const router = express.Router();


router.get('/skills', getSkills);


module.exports = router;