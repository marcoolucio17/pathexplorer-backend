const { 
    fetchProjects, 
    fetchProjectById, 
    fetchProjectsByName,
    fetchCreateProject,
    fetchUpdateProject,
    uploadRFPToStorage, 
    saveRFPPathToProject,
    getRFPSignedUrl,
    obtenerProyectoCompleto,
    obtenerProyectoPorRol,
    obtenerProyectosPorCreador,
    actualizarProyectoYRoles,
    eliminarRelacionProyectoRol,
    obtenerTopProyectos
  } = require('../services/projectService');

//Función para utilizar la consulta de llamar todos los proyectos
const getProjects = async (req, res) => {
  try {
    const { projectName = null, idproyecto = null } = req.query;

    if (projectName && !idproyecto) {
      return getProjectsByName(req, res);
    } else if (!projectName && idproyecto) {
      return getProjectById(idproyecto, res);
    } else if (!projectName && !idproyecto) {
      return getAllProjects(req, res);
    } else {
      return res.status(400).json({ error: "Invalid query parameters" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error fetching projects" });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await fetchProjects();
    if (projects) {
      getProjectsByFilter(req, res, projects);
    } else {
      res.status(404).json({ error: "No projects found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching projects" });
  }
};

const getProjectsByName = async (req, res) => {
  try {
    const { projectName = null } = req.query || {};
    const projects = await fetchProjectsByName(projectName);
    if (projects) {
      return getProjectsByFilter(req, res, projects);
    } else {
      return res.status(404).json({ error: "Project not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error fetching projects" });
  }
};

//Función para utilizar la consulta de llamar un proyecto por id
const getProjectById = async (idproyecto, res) => {
  try {
    const project = await fetchProjectById(idproyecto);
    if (project) {
      return res.status(200).json(project);
    } else {
      return res.status(404).json({ error: "Project not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error fetching project" });
  }
};

const getProjectsByFilter = async (req, res, projects) => {
  try {
    const { idSkills = null } = req.body || {};

    const { nombrerol = null, idcliente = null, idusuario = null } = req.query;

    const requiredSkills = new Set(idSkills) ?? [];

    const projectsFiltered = projects
      .filter((project) => {
        return !idusuario || project.usuario?.idusuario === parseInt(idusuario);
      })
      .filter((project) => {
        return !idcliente || project.cliente.idcliente === parseInt(idcliente);
      })
      .map((project) => {
        const rolesFiltrados = project.proyecto_roles.filter((role) => {
          const datosRol = role.roles;

          if (nombrerol && datosRol.nombrerol !== nombrerol) {
            return false;
          }

          if (requiredSkills.length > 0) {
            const habilidades = datosRol.requerimientos_roles.map(
              (r) => r.requerimientos.habilidades.idhabilidad
            );
            const cumpleTodas = requiredSkills.every((idSkill) =>
              habilidades.includes(idSkill)
            );

            if (!cumpleTodas) return false;
          }
          return true;
        });
        const getDuracionEnMeses = (inicio, fin) => {
          const anios = fin.getFullYear() - inicio.getFullYear();
          const meses = fin.getMonth() - inicio.getMonth();
          const totalMeses = anios * 12 + meses;

          // Ajustar si el día de fin es menor que el de inicio
          if (fin.getDate() < inicio.getDate()) {
            return totalMeses - 1;
          }
          return totalMeses;
        };

        const fechaInicio = new Date(project.fechainicio);
        const fechaFin = new Date(project.fechafin);
        const duracionMes = getDuracionEnMeses(fechaInicio, fechaFin);
        return {
          ...project,
          duracionMes,
          proyecto_roles: rolesFiltrados,
        };
      })
      .filter((project) => {
        return project.proyecto_roles.length > 0;
      });

    return res.status(200).json(projectsFiltered);
  } catch (error) {
    return res.status(500).json({ error: "Error fetching projects" });
  }
};

const createProject = async (req, res) => {
  try {
    const {
      informacion = null,
      projectName = null,
      idproyecto = null,
      nombrerol = null,
      idcliente = null,
      idusuario = null,
      idSkills = null,
    } = req.body || {};

    if (informacion) {
      return createFullProject(informacion, res);
    } else if (
      !informacion &&
      (projectName ||
        idproyecto ||
        nombrerol ||
        idcliente ||
        idSkills ||
        idusuario)
    ) {
      return getProjects(req, res);
    } else {
      return res.status(400).json({ error: "No project information provided" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error creating project" });
  }
};

const createFullProject = async (informacion, res) => {
  try {
    const result = await fetchCreateProject(informacion);
    if (!result) {
      return res.status(404).json({ error: "Project not found" });
    } else {
      return res.status(201).json(result);
    }
  } catch (error) {
    return res.status(500).json({ error: "Error creating project" });
  }
};

const updateProject = async (req, res) => {
  try {
    const { idproyecto = null } = req.query || {};
    const { proyect = null } = req.body.informacion || {};
    if (idproyecto && proyect) {
      return updatingProject(idproyecto, proyect, res);
    } else {
      return res.status(400).json({ error: "No project information provided" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error updating project" });
  }
};

const updatingProject = async (idproyecto, proyect, res) => {
  try {
    const result = await fetchUpdateProject(idproyecto, proyect);
    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ error: "Project not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error updating project" });
  }
};

const uploadRFP = async (req, res) => {
  try {
    const file = req.file;
    const { projectId } = req.body;

    if (!file || !projectId) {
      return res
        .status(400)
        .json({ error: "Archivo y projectId son requeridos" });
    }

    const storagePath = await uploadRFPToStorage(file);

    // Guarda la ruta en la tabla Proyecto
    await saveRFPPathToProject(projectId, storagePath);

    res
      .status(200)
      .json({ message: "Archivo RFP subido correctamente", path: storagePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al subir el archivo RFP" });
  }
};

const getRFPUrl = async (req, res) => {
  try {
    const projectId = req.params.id;
    const signedUrl = await getRFPSignedUrl(projectId);
    res.status(200).json({ url: signedUrl });
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ error: error.message });
  }
};

const getProyectoPorRol = async (req, res) => {
  try {
    const { id, idrol } = req.params;
    const data = await obtenerProyectoPorRol(id, idrol);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el proyecto por rol" });
  }
};

const getProyectoCompleto = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await obtenerProyectoCompleto(id);
    res.json(data);
  } catch (error) {
    console.error("[ERROR en obtenerProyectoCompleto]", error); // 👈
    res.status(500).json({
      error: error.message || "Error al obtener el proyecto completo",
    });
  }
};

const getProyectosPorCreador = async (req, res) => {
  const { idusuario } = req.params;
  try {
    const proyectos = await obtenerProyectosPorCreador(idusuario);
    res.status(200).json(proyectos);
  } catch (error) {
    console.error("Error en getProyectosPorCreador:", error.message);
    res
      .status(500)
      .json({ error: "Error al obtener los proyectos del usuario" });
  }
};

const editarProyectoYRoles = async (req, res) => {
  const { idproyecto } = req.params;
  const {
    pnombre,
    descripcion,
    fechainicio,
    fechafin,
    projectdeliverables,
    roles,
  } = req.body;

  try {
    const resultado = await actualizarProyectoYRoles(idproyecto, {
      pnombre,
      descripcion,
      fechainicio,
      fechafin,
      projectdeliverables,
      roles,
    });
    res.status(200).json(resultado);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error al actualizar el proyecto y los roles",
        detalle: error.message,
      });
  }
};

const borrarRelacionProyectoRol = async (req, res) => {
  const { idproyecto, idrol } = req.params;

  try {
    await eliminarRelacionProyectoRol(idproyecto, idrol);
    res
      .status(200)
      .json({ message: "Rol desvinculado del proyecto correctamente" });
  } catch (error) {
    console.error("Error en borrarRelacionProyectoRol:", error.message);
    res.status(500).json({
      error: "Error al desvincular el rol del proyecto",
      detalle: error.message,
    });
  }
};

const obtenerTop3Proyectos = async (req, res) => {
  const { id } = req.params;
  try {
    let result = await obtenerTopProyectos(id);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error al obtener los tres proyectos más compatibles",
        detalle: error.message,
      });
  }
};

module.exports = {
    getProjects,
    createProject,
    updateProject,
    uploadRFP,
    getRFPUrl,
    getProyectoPorRol,
    getProyectoCompleto,
    getProyectosPorCreador,
    editarProyectoYRoles,
    borrarRelacionProyectoRol,
    obtenerTop3Proyectos
};

