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

    try {
        const updatedApp = await appService.updateAppStatus(userId, appId, estatus);
        res.status(200).json(updatedApp);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el estatus de la aplicación.", error: error.message });
    }
};


// POST: Crear rol asignado a un proyecto
const createRoleForProject = async (req, res) => {
    const { projectId } = req.params;
    const { nombreRol, nivelRol, descripcionRol, estado } = req.body;

    try {
        const newRole = await appService.createRole(projectId, nombreRol, nivelRol, descripcionRol, estado);
        res.status(201).json(newRole);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el rol.", error: error.message });
    }
};

module.exports = {
    getAppsByProjectId,
    getAppsByUserId,
    getUserAppInProject,
    patchAppStatus,
    createRoleForProject
};
