const express = require('express');
const { getGoals, getGoalById, updateGoal } = require('../controllers/goalController');

const router = express.Router();

router.get('/goals', getGoals);

router.get('/goals/:id', getGoalById);

router.patch('/goals/:id', updateGoal);

module.exports = router;