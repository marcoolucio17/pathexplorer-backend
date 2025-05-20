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

module.exports = {
  getUserById
};
