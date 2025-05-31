const { 
    fetchGoal,
    fetchGoalById,
    fetchCreateGoal,
    fetchUpdateGoal,
    fetchDeleteGoal,
    updateAllGoals
} = require('../services/goalService');

//Función para obtener todas las metas de un usuario
const getGoals = async (req, res) => {
    try {
        const { id_usuario = null, id_goal = null} = req.body || {};
        //Consulta para todas las metas de un usuario
        if (id_usuario) {
            getGoalsUser(req, res);
        } else if (id_goal) {
        //Consulta para una meta por id
            getGoalById(req, res);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching goals' });
    }
}

//Función para obtener una meta por id
// Revisado
const getGoalsUser = async (req, res) => { 
    try {
        const { id_usuario = null} = req.body || {};
        const goals = await fetchGoal(id_usuario);
        if (!goals) {
            res.status(404).json({ error: 'No goals found for this user' });
        }
        res.status(200).json(goals);
    } catch (error) { 
        res.status(500).json({ error: 'Error fetching goals' });
    }
}

//Revisado
const getGoalById = async (req, res) => { 
    try {
        const { id_goal = null } = req.body || {};
        const goal = await fetchGoalById(id_goal);
        if (!goal) {
            res.status(404).json({ error: 'Goal not found' });
        }
        res.status(200).json(goal);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching goal' });
    }
}

//Función para crear una meta
const createGoal = async (req, res) => {
    try {
        const data = req.body || {};
        createNewGoal(req, res);

    } catch (error) {
        res.status(500).json({ error: 'Error creating goal' });
    }
}

const createNewGoal = async (req, res) => {
    try { 
        const data = req.body || {};
        
        const result = await fetchCreateGoal(data);
        if (!result) {
            res.status(400).json({ error: 'Error creating goal' });    
        }
        res.status(201).json({ message: 'Goal created successfully' });
    } catch (error) { 
        res.status(500).json({ error: 'Error creating goal' });
    }
}


//Función para actualizar una meta por id
const updateGoal = async (req, res) => {   
    try {
        const { idmeta, cambio } = req.body || {};

        // parchesote porque los del front tenían otro back en mente
        

        const result = await fetchUpdateGoal(idmeta, cambio);
        if (result) {
            res.status(200).json({ message: 'Goal updated successfully' });
        } else {
            res.status(404).json({ error: 'Goal not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating goal' });
    }
}

//Función para eliminar una meta por id
const deleteGoal = async (req, res) => { 
    try {
        const { id_goal = null } = req.body || {};
        if (id_goal) {
            deleteGoalById(req, res);
        } else {
            res.status(400).json({ error: 'Goal ID is required' });
        }
    
    } catch (error) {
        res.status(500).json({ error: 'Error deleting goal' });
    }
}

const deleteGoalById = async (req, res) => { 
    try {
        const { id_goal = null } = req.body || {};
        const result = await fetchDeleteGoal(id_goal);
        if (result) {
            res.status(200).json({ message: 'Goal deleted successfully' });
        } else {
            res.status(404).json({ error: 'Goal not found' });
        }
    } catch (error) { 
        res.status(500).json({ error: 'Error deleting goal' });
    }
}

const updateUserGoals = async (req, res) => {
    try {
        const { userid } = req.params;
        const { goals } = req.body;
        const result = await updateAllGoals(userid, goals);
        if (result) {
            res.status(200).json({ message: 'Goals updated successfully' });
        } else {
            res.status(404).json({ error: 'Error updating goals due to bad request format.' });
        }
    } catch (error) { 
        res.status(500).json({ error: 'Error deleting goal' });
    }
}

module.exports = { 
    getGoals, 
    createGoal,
    updateGoal,
    deleteGoal,
    updateUserGoals
};