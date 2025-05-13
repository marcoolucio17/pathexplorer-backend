const { 
    fetchGoal,
    fetchGoalById,
    fetchCreateGoal,
    fetchUpdateGoal,
    fetchDeleteGoal} = require('../services/goalService');

//Función para obtener todas las metas de un usuario
const getGoals = async (req, res) => {
    try {
        const { id_usuario } = req.query;
        const { id_goal} = req.query;
        //Consulta para todas las metas de un usuario
        if (id_usuario) {
            const goals = await fetchGoal(id_usuario);
            if (!goals) {
                return res.status(404).json({ error: 'No goals found for this user' });
            }
            return res.status(200).json(goals);
        } else if (id_goal) {
        //Consulta para una meta por id
            const goal = await fetchGoalById(id_goal);
            if (!goal) {
                return res.status(404).json({ error: 'Goal not found' });    
            }
            return res.status(200).json(goal);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching goals' });
    }
}

//Función para crear una meta
const createGoal = async (req, res) => {
    try {
        const { goal } = req.body;
        if (!goal) {
            return res.status(400).json({ error: 'Goal is required' });
        }
        const result = await fetchCreateGoal(goal);
        if (result) {
            return res.status(201).json({ message: 'Goal created successfully' });
        } else {
            return res.status(400).json({ error: 'Error creating goal' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error creating goal' });
    }
}

//Función para actualizar una meta por id
const updateGoal = async (req, res) => { 
    
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Goal ID is required' });
        }
        const goal = req.body.goal;
        if (!goal) {
            return res.status(400).json({ error: 'Goal is required' });
        }
        const result = await fetchUpdateGoal(id, goal);
        if (result) {
            return res.status(200).json({ message: 'Goal updated successfully' });
        } else {
            return res.status(404).json({ error: 'Goal not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating goal' });
    }
 
}

//Función para eliminar una meta por id
const deleteGoal = async (req, res) => { 
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Goal ID is required' });
        }
        const result = await fetchDeleteGoal(id);
        if (result) {
            return res.status(200).json({ message: 'Goal deleted successfully' });
        } else {
            return res.status(404).json({ error: 'Goal not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting goal' });
    }
}

module.exports = { 
    getGoals, 
    createGoal,
    updateGoal,
    deleteGoal
};