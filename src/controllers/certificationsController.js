const certificationsService = require('../services/certificationsService');

// Crear un nuevo certificado
const createCertificate = async (req, res) => {
    const { CNombre, Skill, CTecnica, FechaObtenido, FechaExpiracion, EmitidoPor, ImagenCertificado } = req.body;
    try {
        const newCertificate = await certificationsService.createCertificate(CNombre, Skill, CTecnica, FechaObtenido, FechaExpiracion, EmitidoPor, ImagenCertificado);
        res.status(201).json(newCertificate);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la certificación", error: error.message });
    }
};

// Asignar un certificado a un empleado
const assignCertificateToEmployee = async (req, res) => {
    const { IDUsuario, IdCertificaciones } = req.body;
    try {
        const assignment = await certificationsService.assignCertificateToEmployee(IDUsuario, IdCertificaciones);
        res.status(201).json(assignment);
    } catch (error) {
        res.status(500).json({ message: "Error al asignar el certificado al empleado", error: error.message });
    }
};

// Obtener las certificaciones de un empleado
const getCertificatesByEmployeeId = async (req, res) => {
    const { IDEmpleado } = req.params;
    try {
        const certificates = await certificationsService.getCertificatesByEmployeeId(IDEmpleado);
        res.status(200).json(certificates);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las certificaciones", error: error.message });
    }
};

module.exports = {
    createCertificate,
    assignCertificateToEmployee,
    getCertificatesByEmployeeId
};
