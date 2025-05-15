const { fetchUsers } = require("../services/userService");


const getUsers = async (req, res) => {
  try {
    const users = await fetchUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

module.exports = { getUsers };
