const  { fetchRoles, fetchRoleById } = require('../services/rolesService');

const getRoles = async (req, res) => { 
    try {
        const roles = await fetchRoles();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching roles' });
    }
}

const getRoleById = async (req, res) => { 
    const { id } = req.params;
    try {
        const role = await fetchRoleById(id);
        if (role) {
            return res.status(200).json(role);
        }
        return res.status(404).json({ error: 'Role not found' });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching role' });
    }
}

module.exports = {
    getRoles,
    getRoleById
}