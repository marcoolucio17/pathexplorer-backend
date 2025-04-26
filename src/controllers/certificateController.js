const { fetchCertificates } = require('../services/certificateService');

//Función para utilizar la consulta de llamar todas las certificaciones
const getCertificates = async (req, res) => {
    try {
        const certificates = await fetchCertificates();
        res.status(200).json(certificates);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching certificates' });
    }
}

module.exports = { getCertificates };