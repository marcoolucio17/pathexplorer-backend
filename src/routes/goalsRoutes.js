const express = require('express');
const { getGoals, createGoal, updateGoal, deleteGoal } = require('../controllers/goalController');

const router = express.Router();

router.get('/goals', getGoals);

router.post('/goals',createGoal);

router.patch('/goals/:id', updateGoal);

router.delete('/goals/:id', deleteGoal);

module.exports = router;