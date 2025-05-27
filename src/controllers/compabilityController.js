const { fetchCompatibility } = require("../services/compabilityService");


const getCompatibilitysFunctions = async (req, res) => { 
    try {
        const { id_rol = null, idusuario = null } = req.body || {};
        if (id_rol && idusuario) {
            getCompatibility(req, res);
        } else {
            res.status(400).json({ error: 'Missing parameters' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching compatibility' });
    }
}

const getCompatibility = async (req, res) => {
    try {
        const { id_rol, idusuario } = req.body;
        const result = await fetchCompatibility(id_rol, idusuario);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ error: 'No compatibility found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching compatibility' });
    }
}


module.exports = {
    getCompatibilitysFunctions
}