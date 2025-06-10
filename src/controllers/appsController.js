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
    if (!userId) {
      return res.status(400).json({ message: "ID user is required." });
    }
    const apps = await appService.fetchAppsByUserId(userId);
    res.status(200).json(apps);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user applications.",
      error: error.message,
    });
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

    if (!estatus || !['Asignado', 'Pendiente', 'Revision', 'Rechazado', 'RolAsignado'].includes(estatus)) {
        return res.status(400).json({ message: "Estatus inválido. Debe ser 'Asignado', 'Revision', 'Rechazado', 'RolAsignado' o 'Pendiente'." });
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
  try {
    const { idusuario, idrol, message } = req.body;

    if (!idusuario || !idrol || !message) {
      return res.status(400).json({ error: 'Faltan campos requeridos (idusuario, idrol, message).' });
    }

    const data = await appService.createAppService({ idusuario, idrol, message });
    res.status(201).json(data);
  } catch (err) {
    console.error('Error general al crear la aplicación:', err.message);
    res.status(500).json({ message: 'Error al crear la aplicación.', error: err.message });
  }
};

const getAplicacionesPorCreador = async (req, res) => {
  try {
    const { idusuario } = req.params;
    const data = await appService.obtenerAplicacionesPorCreador(parseInt(idusuario));
    res.json(data);
  } catch (error) {
    console.error('[ERROR]', error);
    res.status(500).json({ error: error.message || 'Error al obtener las aplicaciones' });
  }
};


const aceptarAplicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await appService.asignarAplicacion(id);
    res.status(200).json({
      message: 'Aplicación aceptada y usuario asignado al proyecto',
      resultado
    });
  } catch (error) {
    console.error('Error al aceptar aplicación:', error.message);
    res.status(500).json({ error: 'Error al aceptar aplicación. ' + error.message });
  }
};

const getAppsByStatus = async (req, res) => {
  const { estatus } = req.params;

  const estatusValidos = ['Asignado', 'Pendiente', 'Revision', 'Rechazado', 'RolAsignado'];
  if (!estatusValidos.includes(estatus)) {
    return res.status(400).json({ error: 'Estatus no válido. Usa uno de: ' + estatusValidos.join(', ') });
  }

  try {
    const aplicaciones = await appService.obtenerAplicacionesPorEstatus(estatus);
    res.status(200).json({ aplicaciones });
  } catch (error) {
    console.error('Error en getAppsByStatus:', error.message);
    res.status(500).json({ error: 'Error al obtener las aplicaciones. ' + error.message });
  }
};


module.exports = {
    getAppsByProjectId,
    getAppsByUserId,
    getUserAppInProject,
    patchAppStatus,
    createApp,
    getAplicacionesPorCreador,
    aceptarAplicacion,
    getAppsByStatus
};
