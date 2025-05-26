const userService = require('../services/userService');
const {
  generateCVSignedUrl,
  generateProfileSignedUrl,
  uploadCVToStorage,
  uploadProfileToStorage
} = require('../services/userService');



const getUserById = async (req, res) => {
  const { ID } = req.params;

  try {
    const user = await userService.getUserById(ID);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener usuario:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const uploadUserCV = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.params.id;
    const result = await uploadCVToStorage(userId, file);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error en controller CV:', error);
    res.status(500).json({ error: 'Error al subir el archivo CV' });
  }
};

const uploadUserProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo. Asegúrate de que el campo se llame "file" y que el contenido sea un archivo.' });
    }

    const file = req.file;
    const userId = req.params.id;
    const result = await uploadProfileToStorage(userId, file);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error en controller Foto:', error);
    res.status(500).json({ error: 'Error al subir la foto de perfil' });
  }
};


const getUserCVSignedUrl = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await generateCVSignedUrl(userId);
    if (!result) return res.status(404).json({ error: 'CV no encontrado' });
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al obtener URL firmada del CV:', error);
    res.status(500).json({ error: 'Error al generar la URL del CV' });
  }
};

const getUserProfileSignedUrl = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await generateProfileSignedUrl(userId);
    if (!result) return res.status(404).json({ error: 'Foto de perfil no encontrada' });
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al obtener URL firmada de la foto:', error);
    res.status(500).json({ error: 'Error al generar la URL de la foto de perfil' });
  }
};


module.exports = {
  getUserById,
  uploadUserCV,
  uploadUserProfilePicture,
  getUserCVSignedUrl,
  getUserProfileSignedUrl
};
