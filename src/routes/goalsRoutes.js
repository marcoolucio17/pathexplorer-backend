const express = require('express');
const { getGoals, createGoal, updateGoal, deleteGoal, updateUserGoals } = require('../controllers/goalController');

const router = express.Router();

router.get('/goals', getGoals);

router.post('/goals',createGoal);

router.patch('/goals', updateGoal);

router.delete('/goals', deleteGoal);

// vamos a mandar todo a la verga porque el de front no sabe qp
router.put('/update-goals/:userid', updateUserGoals);

module.exports = router;