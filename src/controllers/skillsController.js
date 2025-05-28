const { getSkillsByType, assignSkillToUser } = require('../services/skillsService');

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


const assignSkill = async (req, res) => {
  const { idusuario, idhabilidad } = req.body;

  try {
    const data = await assignSkillToUser(idusuario, idhabilidad);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = { 
    getHabilidadesPorTipo,
    assignSkill
};
