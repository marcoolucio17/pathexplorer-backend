const userService = require('../services/userService');

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

const uploadFotoPerfil = async (req, res) => {
  const { ID } = req.params;
  const { fotoFile } = req.body;

  try {
    const result = await userService.uploadFotoPerfil(ID, fotoFile);
    res.status(200).json({ message: 'Foto de perfil subida exitosamente', result });
  } catch (error) {
    console.error('Error al subir foto de perfil:', error.message);
    res.status(500).json({ error: 'Error al subir foto de perfil' });
  }
};

const uploadCV = async (req, res) => {
  const { ID } = req.params;
  const { cvFile } = req.body;

  try {
    const result = await userService.uploadCV(ID, cvFile);
    res.status(200).json({ message: 'CV subido exitosamente', result });
  } catch (error) {
    console.error('Error al subir CV:', error.message);
    res.status(500).json({ error: 'Error al subir CV' });
  }
};

module.exports = {
  getUserById,
  uploadFotoPerfil,
  uploadCV
};
