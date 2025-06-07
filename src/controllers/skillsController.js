const {
  getSkillsByType,
  assignSkillToUser,
  getAllSkills,
  getNTopSkills,
  getAllUserSkills,
} = require("../services/skillsService");

const getHabilidadesPorTipo = async (req, res) => {
  try {
    const { isTechnical } = req.query;

    if (typeof isTechnical === "undefined") {
      return res.status(400).json({ error: "Falta el parámetro isTechnical" });
    }

    const booleanValue = isTechnical === "true";

    const data = await getSkillsByType(booleanValue);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener habilidades por tipo" });
  }
};

const getTodasHabilidades = async (req, res) => {
  try {
    const habilidades = await getAllSkills();
    res.status(200).json(habilidades);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener todas las habilidades" });
  }
};

const assignSkill = async (req, res) => {
  const { idusuario, nombreHabilidad } = req.body;

  try {
    const result = await assignSkillToUser(idusuario, nombreHabilidad);
    res
      .status(201)
      .json({ message: "Habilidad asignada correctamente", result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getTopSkills = async (req, res) => {
  const { count } = req.params;

  try {
    const result = await getNTopSkills(count);
    res
      .status(200)
      .json({ message: "Habilidades conseguidas fácilmente", result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserSkillsNames = async (req, res) => {
  const { idusuario } = req.params;

  try {
    const { data, error } = await getAllUserSkills(idusuario);

    if (error) {
      return res
        .status(500)
        .json({ error: "Error al obtener las habilidades del usuario" });
    }
    return res.status(200).json({ data });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al obtener las habilidades del usuario" });
  }
};

// DELETE /api/habilidades/:id
const removeSkill = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await deleteSkillById(id);
    if (!deleted)
      return res.status(404).json({ message: "Habilidad no encontrada" });

    res
      .status(200)
      .json({ message: "Habilidad eliminada correctamente", deleted });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la habilidad", detail: error.message });
  }
};


module.exports = {
  getHabilidadesPorTipo,
  assignSkill,
  getTodasHabilidades,
  getTopSkills,
  getUserSkillsNames,
  removeSkill
};
