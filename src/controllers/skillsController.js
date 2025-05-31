const { getSkillsByType, assignSkillToUser, getAllSkills } = require('../services/skillsService');

const getHabilidadesPorTipo = async (req, res) => {
  try {
    const { isTechnical } = req.query;

    if (typeof isTechnical === 'undefined') {
      return res.status(400).json({ error: 'Falta el parámetro isTechnical' });
    }

    const booleanValue = isTechnical === 'true';

    const data = await getSkillsByType(booleanValue);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener habilidades por tipo' });
  }
};

const getTodasHabilidades = async (req, res) => { 
    try {
        const habilidades = await getAllSkills();
        res.status(200).json(habilidades);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener todas las habilidades" });
    }
}

const assignSkill = async (req, res) => {
  const { idusuario, nombreHabilidad } = req.body;

  try {
    const result = await assignSkillToUser(idusuario, nombreHabilidad);
    res.status(201).json({ message: 'Habilidad asignada correctamente', result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



module.exports = { 
    getHabilidadesPorTipo,
    assignSkill,
    getTodasHabilidades
};
