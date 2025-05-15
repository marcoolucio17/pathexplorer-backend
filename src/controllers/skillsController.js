const { getSkillsByType } = require('../services/skillsService');

const getHabilidadesPorTipo = async (req, res) => {
    try {
        const { estecnica } = req.query;

        const isTechnical = estecnica === 'true';

        const habilidades = await getSkillsByType(isTechnical);
        res.json(habilidades);
    } catch (error) {
        console.error("Error al obtener habilidades por tipo:", error);
        res.status(500).json({ error: "Error al obtener habilidades por tipo" });
    }
};

module.exports = { getHabilidadesPorTipo };
