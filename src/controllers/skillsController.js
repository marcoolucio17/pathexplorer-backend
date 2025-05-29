const { getSkillsByType, getAllSkills } = require('../services/skillsService');

const getHabilidadesPorTipo = async (req, res) => {
    try {
        const { estecnica } = req.query;

        const isTechnical = estecnica === 'true';

        const habilidades = await getSkillsByType(isTechnical);
        res.status(200).json(habilidades);
    } catch (error) {
        console.error("Error al obtener habilidades por tipo:", error);
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
}

module.exports = { getHabilidadesPorTipo, getTodasHabilidades };
