const { fetchUsers, authenticateWithEmailAndPassword, signUpWithEmailAndPassword } = require("../services/userService");

const authenticateUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password required" });
    }
    const result = await authenticateWithEmailAndPassword(
      username,
      password
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req, res) => {
  try {
    const result = await signUpWithEmailAndPassword(req, res);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await fetchUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

module.exports = { getUsers, authenticateUser, registerUser };
