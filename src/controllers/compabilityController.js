const { fetchCompatibility } = require("../services/compabilityService");


const getCompatibilitysFunctions = async (req, res) => { 
    try {
        const { id_rol = null, idusuario = null } = req.query || {};
        
        if (id_rol && idusuario) {
            getCompatibility(req, res);
        } else {
            res.status(400).json({ error: 'Missing parameters' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching compatibility. ' + error.message });
    }
}

const getCompatibility = async (req, res) => {
    try {
        const { id_rol, idusuario } = req.query;
        const result = await fetchCompatibility(id_rol, idusuario);
        
        if (typeof result === 'number') {
            
            res.status(200).json(result);
        } else {
            res.status(200).json({ error: 'Invalid compatibility result' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching compatibility' + error.message });
    }
}


module.exports = {
    getCompatibilitysFunctions
}