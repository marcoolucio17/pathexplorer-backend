const {
  fetchGoal,
  fetchGoalById,
  fetchCreateGoal,
  fetchUpdateGoal,
  fetchDeleteGoal,
} = require("../services/goalService");

//Función para obtener todas las metas de un usuario
const getGoals = async (req, res) => {
  try {
    const { id_usuario = null, id_goal = null } = req.query || {};
    //Consulta para todas las metas de un usuario
    if (id_usuario) {
      console.log(id_usuario);
      getGoalsUser(req, res);
    } else if (id_goal) {
      //Consulta para una meta por id
      getGoalById(req, res);
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching goals" });
  }
};

//Función para obtener una meta por id
// Revisado
const getGoalsUser = async (req, res) => {
  try {
    const { id_usuario = null } = req.query || {};
    const goals = await fetchGoal(id_usuario);
    if (!goals) {
      res.status(404).json({ error: "No goals found for this user" });
    }
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ error: "Error fetching goals" });
  }
};

//Revisado
const getGoalById = async (req, res) => {
  try {
    const { id_goal = null } = req.query || {};
    const goal = await fetchGoalById(id_goal);
    if (!goal) {
      res.status(404).json({ error: "Goal not found" });
    }
    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({ error: "Error fetching goal" });
  }
};

//Función para crear una meta
const createGoal = async (req, res) => {
  try {
    const { goal = null } = req.body.informacion || {};
    if (goal) {
      createNewGoal(req, res);
    } else {
      res.status(400).json({ error: "Goal is required" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error creating goal" });
  }
};

const createNewGoal = async (req, res) => {
  try {
    const { goal = null } = req.body.informacion || {};

    const result = await fetchCreateGoal(goal);
    if (!result) {
      res.status(400).json({ error: "Error creating goal" });
    }
    res.status(201).json({ message: "Goal created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error creating goal" });
  }
};

//Función para actualizar una meta por id
const updateGoal = async (req, res) => {
  try {
    const { idmeta = null } = req.body || {};
    const { goal = null } = req.body.informacion || {};

    if (idmeta && goal) {
      updatingAGoalUser(req, res);
    } else {
      res.status(400).json({ error: "User ID and goal are required" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating goal" });
  }
};

const updatingAGoalUser = async (req, res) => {
  try {
    const { idmeta = null } = req.body || {};
    const { goal = null } = req.body.informacion || {};
    console.log(idmeta, goal);
    const result = await fetchUpdateGoal(idmeta, goal);
    if (result) {
      res.status(200).json({ message: "Goal updated successfully" });
    } else {
      res.status(404).json({ error: "Goal not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating goal" });
  }
};

//Función para eliminar una meta por id
const deleteGoal = async (req, res) => {
  try {
    const { id_goal = null } = req.body || {};
    if (id_goal) {
      deleteGoalById(req, res);
    } else {
      res.status(400).json({ error: "Goal ID is required" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting goal" });
  }
};

const deleteGoalById = async (req, res) => {
  try {
    const { id_goal = null } = req.body || {};
    const result = await fetchDeleteGoal(id_goal);
    if (result) {
      res.status(200).json({ message: "Goal deleted successfully" });
    } else {
      res.status(404).json({ error: "Goal not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting goal" });
  }
};

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
};
