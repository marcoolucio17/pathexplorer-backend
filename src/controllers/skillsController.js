const { fetchSkills } = require('../services/skillsService');

//Función para utilizar la consulta de llamar todas las habilidades
const getSkills = async (req, res) => {
    try {
        const skills = await fetchSkills();
        res.status(200).json(skills);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching skills' });
    }
}


module.exports = { getSkills };