const { 
    fetchAplicacionesByProject, 
    fetchAplicacionesByUser, 
    fetchAplicacionByUserAndId, 
    fetchUpdateAplicacionStatus, 
    fetchAddAplicacion 
  } = require('../services/appsService');
  
  // Función para obtener todas las aplicaciones de un proyecto
  const getAplicacionesByProject = async (req, res) => {
    try {
      const { projectid } = req.params;
      const aplicaciones = await fetchAplicacionesByProject(projectid);
      return res.status(200).json({ aplicaciones });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al obtener las aplicaciones del proyecto.' });
    }
  };
  
  // Función para obtener todas las aplicaciones de un usuario
  const getAplicacionesByUser = async (req, res) => {
    try {
      const { userid } = req.params;
      const aplicaciones = await fetchAplicacionesByUser(userid);
      return res.status(200).json({ aplicaciones });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al obtener las aplicaciones del usuario.' });
    }
  };
  
  // Función para obtener una aplicación específica de un usuario en un proyecto
  const getAplicacionByUserAndId = async (req, res) => {
    try {
      const { userid, aplicacionid } = req.params;
      const aplicacion = await fetchAplicacionByUserAndId(userid, aplicacionid);
      return res.status(200).json({ aplicacion });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al obtener la aplicación.' });
    }
  };
  
  // Función para actualizar el estado de una aplicación
  const updateAplicacionStatus = async (req, res) => {
    try {
      const { userid, projectid } = req.params;
      const { status } = req.body;
      const aplicacion = await fetchUpdateAplicacionStatus(userid, projectid, status);
      return res.status(200).json({ aplicacion });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al actualizar el estado de la aplicación.' });
    }
  };
  
  // Función para crear una nueva aplicación en un proyecto
  const createAplicacion = async (req, res) => {
    try {
      const { projectid } = req.params;
      const aplicacionData = req.body;
      const aplicacion = await fetchAddAplicacion(projectid, aplicacionData);
      return res.status(201).json({ aplicacion });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al crear la aplicación.' });
    }
  };
  
  module.exports = { 
    getAplicacionesByProject, 
    getAplicacionesByUser, 
    getAplicacionByUserAndId, 
    updateAplicacionStatus, 
    createAplicacion
  };
  