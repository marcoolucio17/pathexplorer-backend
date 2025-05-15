const appService = require('../services/appsService');

// GET: Todas las apps de un proyecto
const getAppsByProjectId = async (req, res) => {
    const { projectId } = req.params;
    try {
        const apps = await appService.fetchAppsByProjectId(projectId);
        res.status(200).json(apps);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las aplicaciones del proyecto.", error: error.message });
    }
};

// GET: Todas las apps de un usuario
const getAppsByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const apps = await appService.fetchAppsByUserId(userId);
        res.status(200).json(apps);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las aplicaciones del usuario.", error: error.message });
    }
};


// GET: Aplicación específica
const getUserAppInProject = async (req, res) => {
    const { userId, appId } = req.params;
    try {
        const app = await appService.fetchUserAppInProject(userId, appId);
        res.status(200).json(app);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la aplicación.", error: error.message });
    }
};

// PATCH: Cambiar estatus
const patchAppStatus = async (req, res) => {
    const { userId, appId } = req.params;
    const { estatus } = req.body;

    if (!estatus || !['vacante', 'asignado'].includes(estatus)) {
        return res.status(400).json({ message: "Estatus inválido. Debe ser 'vacante' o 'asignado'." });
    }

    try {
        const result = await appService.updateAppStatus(userId, appId, estatus);
        res.status(200).json({ message: 'Estatus actualizado correctamente.', result });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el estatus.", error: error.message });
    }
};

// POST: Crear una nueva aplicación
const createApp = async (req, res) => {
    const { idrol, idusuario } = req.body;

    if (!idrol || !idusuario) {
        return res.status(400).json({ message: "Faltan idrol o idusuario." });
    }

    try {
        const result = await appService.createApp(idrol, idusuario);
        res.status(201).json({ message: "Aplicación creada exitosamente", data: result });
    } catch (error) {
        res.status(500).json({ message: "Error al crear la aplicación", error: error.message });
    }
};


module.exports = {
    getAppsByProjectId,
    getAppsByUserId,
    getUserAppInProject,
    patchAppStatus,
    createApp
};
