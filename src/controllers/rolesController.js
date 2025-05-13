const  { 
    fetchRoles, 
    fetchRoleById,
    addRole,
    updateRole } = require('../services/rolesService');

// Funcion para llamar todos los roles
const getRoles = async (req, res) => { 
    try {
        const roles = await fetchRoles();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching roles' });
    }
}

//Función para llamar un rol por id
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

//Función para agregar un nuevo rol
const addNewRole = async (req, res) => {
    try {
        const role = req.body;
        if(!role) {
            return res.status(400).json({ error: 'Role data is required' });
        }
        const result = await addRole(role);
        if (result) {
            return res.status(201).json({ message: 'Role added successfully' });
        }
    } catch (error) { 
        res.status(500).json({ error: 'Error adding role' });
    }
}


//Función para actualizar un rol por id
const updateRoleById = async (req, res) => {
    const { id } = req.params;
    const role = req.body;
    try {
        if (!id) {
            return res.status(400).json({ error: 'Role ID is required' });
        }
        if (!role) {
            return res.status(400).json({ error: 'Role data is required' });
        }
        const result = await updateRole(id, role);
        if (result) {
            return res.status(200).json({ message: 'Role updated successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating role' });
    }
}

module.exports = {
    getRoles,
    getRoleById,
    addNewRole,
    updateRoleById
}