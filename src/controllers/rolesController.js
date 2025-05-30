const {
  fetchRolesName,
  fetchRoleById,
  addRole,
  updateRole,
  addRequirement,
  deleteRequirement,
  deleteRoleProject,
} = require("../services/rolesService");

//Revisado
const getRolesFunctions = async (req, res) => {
  try {
    const { id_rol = null } = req.body || {};
    if (id_rol) {
      getRoleById(req, res);
    } else if (!id_rol) {
      getRoles(req, res);
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching roles" });
  }
};

// Funcion para llamar todos los roles
// Revisado
const getRoles = async (req, res) => {
  try {
    const roles = await fetchRolesName();
    if (!roles) {
      res.status(404).json({ error: "No roles found" });
    } else {
      res.status(200).json(roles);
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching roles" });
  }
};

//Función para llamar un rol por id
// Revisado
const getRoleById = async (req, res) => {
  const { id_rol = null } = req.body || {};
  try {
    const role = await fetchRoleById(id_rol);
    if (!role) {
      res.status(404).json({ error: "Role not found" });
    } else {
      res.status(200).json(role);
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching role" });
  }
};

//Funciones para agregar un nuevo rol o requermientos
//Revisado
const addInfoRoles = async (req, res) => {
  try {
    const { role = null, id_rol = null, requerimiento = null } = req.body || {};

    if (role && !id_rol && !requerimiento) {
      addNewRole(req, res);
    } else if ((!role, id_rol && requerimiento)) {
      addNewRequirement(req, res);
    }
  } catch (error) {
    res.status(500).json({ error: "Error adding role" });
  }
};

//Función para agregar un nuevo rol
// Revisado
const addNewRole = async (req, res) => {
  try {
    const { role = null } = req.body || {};

    const result = await addRole(role);
    if (!result) {
      res.status(400).json({ error: "Role already exists" });
    } else {
      res.status(201).json({ message: "Role added successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error adding role" });
  }
};

//Revisado
const addNewRequirement = async (req, res) => {
  try {
    const { id_rol = null, requerimiento = null } = req.body || {};
    console.log(id_rol, requerimiento);
    const result = await addRequirement(id_rol, requerimiento);
    if (!result) {
      res.status(400).json({ error: "Requirement already exists" });
    } else {
      res.status(201).json({ message: "Requirement added successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error adding requirement" });
  }
};

const updatesRole = async (req, res) => {
  try {
    const { id_rol = null, role = null } = req.body || {};
    if (id_rol && role) {
      updateRoleById(req, res);
    } else {
      res.status(400).json({ error: "Role ID and data are required" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating the  role" });
  }
};

//Función para actualizar un rol por id
// Revisado
const updateRoleById = async (req, res) => {
  try {
    const { id_rol = null, role = null } = req.body || {};
    const result = await updateRole(id_rol, role);
    if (result) {
      return res.status(200).json({ message: "Role updated successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating role" });
  }
};

//Revisado
const deleteFunctionsReq = async (req, res) => {
  try {
    const {
      id_requerimiento = null,
      id_proyecto = null,
      id_rol = null,
      requerimientos = null,
    } = req.body || {};

    if (id_rol && requerimientos && id_proyecto && !id_requerimiento) {
      deleteARoleProject(req, res);
    } else if (id_rol && !requerimientos && !id_proyecto && id_requerimiento) {
      deleteOldRequirement(req, res);
    } else {
      res
        .status(400)
        .json({ error: "Role ID, Requirement ID or Project ID are required" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting requirement" });
  }
};

// Revisado
const deleteOldRequirement = async (req, res) => {
  try {
    const { id_requerimiento = null, id_rol = null } = req.body || {};

    const result = await deleteRequirement(id_rol, id_requerimiento);
    if (result) {
      return res
        .status(200)
        .json({ message: "Requirement deleted successfully" });
    } else {
      return res.status(404).json({ error: "Requirement not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting requirement" });
  }
};

//Revisado
const deleteARoleProject = async (req, res) => {
  try {
    const {
      requerimientos = null,
      id_proyecto = null,
      id_rol = null,
    } = req.body || {};
    const result = await deleteRoleProject(id_rol, id_proyecto, requerimientos);
    if (result) {
      res.status(200).json({ message: "Role deleted successfully" });
    } else {
      res.status(404).json({ error: "Role not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting role" });
  }
};

module.exports = {
  getRolesFunctions,
  addInfoRoles,
  updatesRole,
  deleteFunctionsReq,
};
