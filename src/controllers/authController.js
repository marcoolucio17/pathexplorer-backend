const {
  authenticateWithEmailAndPassword,
  signUpWithEmailAndPassword,
} = require("../services/authService");
const ApiError = require("../utils/errorHelper");

const authenticateUser = async (req, res, next) => {
  try {
    const { providerid, password } = req.body || {};

    if (!providerid || !password) {
      return res
        .status(400)
        .json({ message: "Username and password required" });
    }
    const result = await authenticateWithEmailAndPassword(providerid, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req, res) => {
  try {
    // deberíamos de conseguir el nombre, apellido, providerid, rol
    const { name, lastname, providerid, role, level, password } = req.body || {};

    // nos aseguramos que la estructura sea la correcta
    if (!name || !lastname || !providerid || !role || !level) {
      return res.status(400).json({
        message:
          "An incomplete form was sent. Please try again, filling all fields.",
      });
    }

    // lo hacemos un solo objeto para facilitar las cosas
    const payload = {
      name,
      lastname,
      providerid,
      role,
      level,
      password,
    };

    const result = await signUpWithEmailAndPassword(payload);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  authenticateUser,
  registerUser,
};
