const express = require('express');
const { getGoals, createGoal, updateGoal, deleteGoal } = require('../controllers/goalController');

const router = express.Router();

router.get('/goals', getGoals);

router.post('/goals',createGoal);

router.patch('/goals', updateGoal);

router.delete('/goals', deleteGoal);

module.exports = router;