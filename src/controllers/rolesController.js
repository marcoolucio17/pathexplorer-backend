const  { 
    fetchRoles,
    fetchRoleById,
    addRole,
    updateRole,
    addRequirement,
    deleteRequirement,
    deleteRoleProject } = require('../services/rolesService');

const getRolesFunctions = async (req, res) => { 
    try {
        const { id_rol = null } = req.body || {};
        if (id_rol) {
            getRoleById(req, res);
        } else if (id_rol === null) {
            getRoles(req, res);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching roles' });
    }
}

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
    const { id_rol = null } = req.body || {};
    try {
        const role = await fetchRoleById(id_rol);
        if (role) {
            return res.status(200).json(role);
        }
        return res.status(404).json({ error: 'Role not found' });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching role' });
    }
}

//Funciones para agregar un nuevo rol o requermientos

const addInfoRoles = async (req, res) => { 
    try {
        const { role = null, id_rol = null, requerimiento = null } = req.body || {};

        if (role, id_rol === null && requerimiento === null) {
            addNewRole(req, res);
        } else if (role === null, id_rol && requerimiento) {
            addNewRequirement(req, res);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error adding role' });
    }
}


//Función para agregar un nuevo rol
const addNewRole = async (req, res) => {
    try {
        const { role = null } = req.body || {}
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

const addNewRequirement = async (req, res) => { 
    try {
        const { id_rol } = req.body;
        const { requerimiento } = req.body;
        if (!id_rol) {
            return res.status(400).json({ error: 'Role ID is required' });
        }
        const result = await addRequirement(id_rol, requerimiento);
        if (result) {
            return res.status(201).json({ message: 'Requirement added successfully' });
        }

    } catch (error) {
        res.status(500).json({ error: 'Error adding requirement' });
    }
}

const updatesRole = async (req, res) => { 
    try {
        const { id_rol = null, role = null } = req.body || {};
        if (id_rol && role) {
            updateRoleById(req, res);
        }
        
    } catch (error) { 
        res.status(500).json({ error: 'Error updating the  role' });
    }

}


//Función para actualizar un rol por id
const updateRoleById = async (req, res) => {
    const { id_rol = null, role = null } = req.body || {};
    try {
        if (!id_rol) {
            return res.status(400).json({ error: 'Role ID is required' });
        }
        if (!role) {
            return res.status(400).json({ error: 'Role data is required' });
        }
        const result = await updateRole(id_rol, role);
        if (result) {
            return res.status(200).json({ message: 'Role updated successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating role' });
    }
}



const deleteFunctionsReq = async (req, res) => { 
    //console.log(JSON.stringify(req.body, null, 2));
    const { requerimientos = null } = req.body || {};
    const { id_requerimiento = null, id_proyecto = null, id_rol = null} = req.body || {};

    if (id_rol && requerimientos && id_proyecto && !id_requerimiento) {
        console.log("deleteARoleProject");
      deleteARoleProject(req, res);  
    } else if (id_rol && !requerimientos && !id_proyecto && id_requerimiento) {
        console.log("deleteOldRequirement");
        deleteOldRequirement(req, res);
    }
    res.status(500).json({ error: 'Error deleting the role' });
}


const deleteOldRequirement = async (req, res) => {
    try {
        const { id_requerimiento = null, id_rol = null} = req.body || {};

        if (!id_rol) {
            return res.status(400).json({ error: 'Requirement ID is required' });
        }
        console.log("ID rol obtenido exitosamente");
        if (!id_requerimiento) {
            return res.status(400).json({ error: 'Requirement ID is required' });
        }
        console.log("ID requerimiento obtenido exitosamente");
        const result = await deleteRequirement(id_rol,id_requerimiento);
        if (result) {
            return res.status(200).json({ message: 'Requirement deleted successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting requirement' });
    }
}

const deleteARoleProject = async (req, res) => {
    try {  
        const { requerimientos = null } = req.body || {};
        const { id_proyecto = null, id_rol = null} = req.body || {};
        if (!requerimientos) {
            return res.status(400).json({ error: 'Requeriment(s) is required' });
        }
        console.log("Requerimientos obtenidos exitosamente");
        if (!id_rol) {
            return res.status(400).json({ error: 'Role ID is required' });
        }
        console.log("ID rol obtenido exitosamente");
        if (!id_proyecto) {
            return res.status(400).json({ error: 'Project ID is required' });
        }
        console.log("ID proyecto obtenido exitosamente");
        const result = await deleteRoleProject(Number(id_rol), Number(id_proyecto), requerimientos);
        
        if (result) {
            return res.status(200).json({ message: 'Role deleted successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting role' });
    }
}

module.exports = {
    getRolesFunctions,
    addInfoRoles,
    updatesRole,
    deleteFunctionsReq

}