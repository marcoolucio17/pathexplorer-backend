const userService = require('../services/userService');
const {
  generateCVSignedUrl,
  generateProfileSignedUrl,
  uploadCVToStorage,
  uploadProfileToStorage,
  updateUsuarioParcial,
  obtenerUsuariosConProyectoYRol,
  obtenerUsuariosPorProyecto
} = require('../services/userService');



const getUserById = async (req, res) => {
  const { ID } = req.params;
  
  try {
    const user = await userService.getUserById(ID);

    if (!user) {
      return res.status(404).json({ error: "User no found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error al obtener usuario:", error.message);
    res.status(500).json({ error: "Internal server error. " + error.message });
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
    res.status(500).json({ error: 'Error al subir el archivo CV. ' + error.message  });
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
    res.status(500).json({ error: 'Error al subir la foto de perfil. ' + error.message  });
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
    res.status(500).json({ error: 'Error al generar la URL de la foto de perfil. ' + error.message  });
  }
};


const patchUsuario = async (req, res) => {
  const id = req.params.id;
  const campos = req.body;

  try {
    const updated = await updateUsuarioParcial(id, campos);
    res.status(200).json(updated);
  } catch (error) {
    console.error('Error al actualizar el usuario:', error.message);
    res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
  }
};

const getUsuariosConProyectoYRol = async (req, res) => {
  try {
    const data = await obtenerUsuariosConProyectoYRol();
    res.json(data);
  } catch (error) {
    console.error('Error al obtener usuarios:', error.message);
    res.status(500).json({ error: 'Error al obtener usuarios. ' + error.message  });
  }
};

const getUsuariosPorProyecto = async (req, res) => {
  try {
    const { idproyecto } = req.params;
    const data = await obtenerUsuariosPorProyecto(idproyecto);
    res.json(data);
  } catch (error) {
    console.error('Error al obtener usuarios por proyecto:', error.message);
    res.status(500).json({ error: 'Error al obtener usuarios por proyecto. ' + error.message  });
  }
};


module.exports = {
  getUserById,
  uploadUserCV,
  uploadUserProfilePicture,
  getUserCVSignedUrl,
  getUserProfileSignedUrl,
  patchUsuario,
  getUsuariosConProyectoYRol,
  getUsuariosPorProyecto
};
