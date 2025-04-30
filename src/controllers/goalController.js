const { fetchGoal,fetchGoalById,fetchUpdateGoal} = require('../services/goalService');

const getGoals = async (req, res) => {
    try {
        const goals = await fetchGoal();
        res.status(200).json(goals);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching goals' });
    }
}

const getGoalById = async (req, res) => {
    const { id } = req.params;
    try {
        const goal = await fetchGoalById(id);
        if (goal) {
            return res.status(200).json(goal);
        }
        return res.status(404).json({ error: 'Goal not found' });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching goal' });
    }
}

const updateGoal = async (req, res) => { 
    
    const { id } = req.params;
    try {
        const goal = req.body.goal;
    
        const data = await fetchUpdateProject(id, goal);
        if (data) {
            return res.status(200).json({ message: 'Goal updated successfully' });
        } else {
            return res.status(404).json({ error: 'Goal not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating goal' });
    }
 
}

module.exports = { 
    getGoals, 
    getGoalById, 
    updateGoal
};