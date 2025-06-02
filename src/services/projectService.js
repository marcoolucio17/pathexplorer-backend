const supabase = require("../config/supabaseClient");
const ApiError = require("../utils/errorHelper");

const tableProject = `idproyecto,pnombre,descripcion,fechainicio,fechafin,proyectoterminado,projectdeliverables`;
const tableUser = `usuario(idusuario,nombre)`;
const tableUtp = `utp(usuario(idusuario,nombre))`;
const tableClient = `cliente(idcliente,clnombre)`;
const tableSkill = `habilidades(idhabilidad,nombre,estecnica)`;
const tableRequirement = `requerimientos(idrequerimiento,tiempoexperiencia,${tableSkill})`;
const tableRequerimientosRoles = `requerimientos_roles(${tableRequirement})`;
//Aquí afecta el rol
const tableRoles = `roles(idrol,nombrerol,nivelrol,descripcionrol,disponible,${tableRequerimientosRoles})`;
const tableProjectRoles = `proyecto_roles(${tableRoles})`;
const textToObtainInfoProject = `${tableProject},${tableUser},${tableUtp},${tableClient},${tableProjectRoles}`;
const { getClienteFotoUrl } = require('../services/clientesService');
const { generateProfileSignedUrl } = require('../services/userService');


//Consulta para llamar la info para el proyecto en la pantalla de Dashboard

/**
 * @param "No se recibe ningun parametro"
 * @returns "Un array con la información de todos los proyectos - Incluye:
 *           ID de proyecto,
 *           Nombre de proyecto,
 *           Descripción de proyecto,
 *           Nombre del cliente,
 *           Todos los roles relacionados al proyecto:
 *              ID de rol,
 *              Nombre de rol,
 *              Descripción de rol,
 *              Requerimientos del rol:
 *                  ID de habilidad,
 *                  Nombre de habilidad,
 *                  esTecnica (booleano)
 */

const fetchProjects = async () => {
  const { data, error } = await supabase
    .from("proyecto")
    .select(textToObtainInfoProject)
    .eq("proyectoterminado", false);
  if (error) {
    console.log("error", error);
    throw new ApiError(
      error.status || 400,
      error.message || "There is an error fetching the projects."
    );
  }
  const dataProyectos = selectProyectosRolesDisponibles(data);
  return dataProyectos;
};

const fetchMyProjects = async (id_usuario) => {
  const { data, error } = await supabase
    .from("proyecto")
    .select(textToObtainInfoProject)
    .eq("idusuario", id_usuario);
  if (error) {
    console.log("error", error);
    throw new ApiError(
      error.status || 400,
      error.message || "There is an error fetching the projects."
    );
  }

  return data;
};

/**
 */

/**
 * @param {string} nombre_proyecto - Nombre del proyecto a buscar
 * @returns "Un array con la información de todos los proyectos - Incluye:
 *           ID de proyecto,
 *           Nombre de proyecto,
 *           Descripción de proyecto,
 *           Nombre del cliente,
 *           Todos los roles relacionados al proyecto:
 *              ID de rol,
 *              Nombre de rol,
 *              Descripción de rol,
 *              Requerimientos del rol:
 *                  ID de habilidad,
 *                  Nombre de habilidad,
 *                  esTecnica (booleano)
 */

/**
 *
 * @param {*} nombre_proyecto
 * @returns
 */
//Case insensitive search
const fetchProjectsByName = async (nombre_proyecto) => {
  const { data, error } = await supabase
    .from("proyecto")
    .select(textToObtainInfoProject)
    .ilike("pnombre", `%${nombre_proyecto}%`)
    .eq("proyectoterminado", false);

  if (error) {
    console.log("error", error);
    throw new ApiError(
      error.status || 400,
      error.message || "There is an error fetching the projects."
    );
  }
  const dataProyectos = selectProyectosRolesDisponibles(data);
  return dataProyectos;
};

/**
 * @param {int} id_proyecto - ID del proyecto a buscar
 * @returns "Un array con la información de todos los proyectos - Incluye:
 *           ID de proyecto,
 *           Nombre de proyecto,
 *           Descripción de proyecto,
 *           Nombre del cliente,
 *           Todos los roles relacionados al proyecto:
 *              ID de rol,
 *              Nombre de rol,
 *              Descripción de rol,
 *              Requerimientos del rol:
 *                  ID de habilidad,
 *                  Nombre de habilidad,
 *                  esTecnica (booleano)
 */
const fetchProjectById = async (id_proyecto) => {
  const { data, error } = await supabase
    .from("proyecto")
    .select(textToObtainInfoProject)
    .eq("idproyecto", id_proyecto);

  if (error) {
    console.log("error", error);
    throw new ApiError(
      error.status || 400,
      error.message || "There is an error fetching the projects."
    );
  }

  const url = await getRFPSignedUrl(id_proyecto);
  const dataProyectos = dataProjectsReorganized(data, url);
  return dataProyectos;
};

const dataProjectsReorganized = (data, url) => {
  if (!data || data.length === 0) {
    return [];
  }

  const project = data[0];

  const informationProjects = {
    idproyecto: project.idproyecto,
    pnombre: project.pnombre,
    descripcion: project.descripcion,
    fechainicio: project.fechainicio,
    fechafin: project.fechafin,
    proyectoterminado: project.proyectoterminado,
    rfpfile: url,
    idusuario: project.usuario?.idusuario || null,
    creador: project.usuario?.nombre || null,
    cliente: project.cliente?.clnombre || null,
    idcliente: project.cliente?.idcliente || null,
    projectdeliverables: project.projectdeliverables || "",
    //Aquí afecta el rol
    roles: (project.proyecto_roles || []).map(
      (role) => role.roles?.nombrerol || "Role not defined"
    ),
    habilidades: [
      ...new Set(
        (project.proyecto_roles || []).flatMap(
          (rol) =>
            rol.roles?.requerimientos_roles?.map(
              (req) =>
                req.requerimientos?.habilidades?.nombre || "Skill not defined"
            ) || []
        )
      ),
    ],
    miembros: (project.utp || []).map((utp) => utp.usuario?.nombre),
  };

  return informationProjects;
};

const selectProyectosRolesDisponibles = (data) => {
  const proyectosConRolesDisponibles = data
    .map((proyecto) => ({
      ...proyecto,
      proyecto_roles: Array.isArray(proyecto.proyecto_roles)
        ? proyecto.proyecto_roles.filter((pr) => pr.roles?.disponible === true)
        : [],
    }))
    .filter((proyecto) => proyecto.proyecto_roles.length > 0);

  return proyectosConRolesDisponibles;
};

/**
 *
 * @param {*} informacion (JSON)
 * proyecto: {
 *   pnombre: "nombre del proyecto",
 *   descripcion: "descripcion del proyecto",
 *  fecha_inicio: "YYYY-MM-DD",
 *  fecha_fin: "YYYY-MM-DD",
 *  idcliente: id de cliente
 *  }
 * Obtener id de cada rol
 *  roles: [
 *      {
 *          nombrerol: "nombre del rol",
 *          nivelrol: "nivel del rol", int
 *          descripcionrol: "descripcion del rol",
 *          disponible: true/false,
 *          Obtener id de cada requerimiento
 *          requerimientos: [ {
 *               tiempoexperiencia: "tiempo de experiencia",
 *               idhabilidad: id de habilidad
 *              },
 *              {
 *               tiempoexperiencia: "tiempo de experiencia",
 *               idhabilidad: id de habilidad
 *              }]
 *       },
 *        {
 *          nombrerol: "nombre del rol",
 *          nivelrol: "nivel del rol", int
 *          descripcionrol: "descripcion del rol",
 *          disponible: true/false,
 *        },
 * ]
 * @returns
 */
//El envío del json
const fetchCreateProject = async (informacion) => {
  try {
    const { proyect, roles } = informacion;
    if (!proyect || !roles) {
      throw new ApiError(400, "Falta información del proyecto o los roles.");
    }

    const { data: proyectData, error: proyectError } = await supabase
      .from("proyecto")
      .insert([proyect])
      .select("idproyecto")
      .single();

    if (proyectError || !proyectData) {
      throw new ApiError(
        500,
        proyectError?.message || "Error al crear el proyecto."
      );
    }

    const idproyecto = proyectData.idproyecto;

    for (const rol of roles) {
      const { data: rolData, error: rolError } = await supabase
        .from("roles")
        .insert([
          {
            //Aquí afecta el rol
            nombrerol: rol.nombrerol,
            nivelrol: rol.nivelrol,
            descripcionrol: rol.descripcionrol,
            disponible: rol.disponible,
          },
        ])
        .select(`idrol`)
        .single();

      if (rolError || !rolData) {
        throw new ApiError(500, rolError?.message || "Error al crear el rol.");
      }
      const idrol = rolData.idrol;

      for (const req of rol.requerimientos) {
        const { tiempoexperiencia, idhabilidad } = req;
        const { data: existeReq, error: existeError } = await supabase
          .from("requerimientos")
          .select(`idrequerimiento`)
          .eq("tiempoexperiencia", tiempoexperiencia)
          .eq("idhabilidad", idhabilidad)
          .maybeSingle();

        let idrequerimiento;

        if (existeReq) {
          idrequerimiento = existeReq.idrequerimiento;
        } else {
          const { data: reqData, error: reqError } = await supabase
            .from("requerimientos")
            .insert([
              {
                tiempoexperiencia: tiempoexperiencia,
                idhabilidad: idhabilidad,
              },
            ])
            .select(`idrequerimiento`)
            .single();

          if (!reqData || reqError) {
            throw new ApiError(
              500,
              reqError?.message || "Error al crear el requerimiento."
            );
          }
          idrequerimiento = reqData.idrequerimiento;
        }

        const { error: reqRolError } = await supabase
          .from("requerimientos_roles")
          .insert([
            {
              idrol: idrol,
              idrequerimiento: idrequerimiento,
            },
          ]);
        if (reqRolError) {
          throw new ApiError(
            500,
            reqRolError?.message || "Error al asignar requerimientos al rol."
          );
        }
      }

      const { error: proyectRolError } = await supabase
        .from("proyecto_roles")
        .insert([
          {
            idproyecto: idproyecto,
            idrol: idrol,
          },
        ]);

      if (proyectRolError) {
        throw new ApiError(
          500,
          proyectRolError?.message || "Error al asignar el rol al proyecto."
        );
      }
    }
    return {idproyecto};
  } catch (error) {
    console.log("error", error);
    throw new ApiError(
      error.status || 500,
      error.message || "There is an error creating the project."
    );
  }
};

const fetchUpdateProject = async (id_proyecto, informacion) => {
  try {
    const { data, error } = await supabase
      .from("proyecto")
      .update(informacion)
      .eq("idproyecto", id_proyecto);

    return true;
  } catch (error) {
    console.log("error", error);
    throw new ApiError(
      error.status || 400,
      error.message || "There is an error updating the project."
    );
  }
};

const uploadRFPToStorage = async (file) => {
  const fileName = `rfp-${Date.now()}-${file.originalname}`;

  const { data, error } = await supabase.storage
    .from("rfpproyecto")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) throw error;

  return data.path;
};

const saveRFPPathToProject = async (projectId, filePath) => {
  const { data, error } = await supabase
    .from("proyecto")
    .update({ rfpfile: filePath })
    .eq("idproyecto", projectId)
    .select();

  console.log("Actualización de Proyecto:", {
    projectId,
    filePath,
    data,
    error,
  });

  if (error || !data || data.length === 0) {
    throw new Error("No se pudo actualizar el proyecto o el ID es inválido");
  }
};

const getRFPSignedUrl = async (projectId) => {
  const { data: proyecto, error } = await supabase
    .from("proyecto")
    .select("rfpfile")
    .eq("idproyecto", projectId)
    .single();

  if (error || !proyecto || !proyecto.rfpfile) {
    throw new Error("Archivo RFP no encontrado");
  }

  const { data: signedUrlData, error: urlError } = await supabase.storage
    .from("rfpproyecto")
    .createSignedUrl(proyecto.rfpfile, 300); // URL válida 5 min

  if (urlError) {
    throw new Error("Error al generar URL firmada");
  }
  return signedUrlData.signedUrl;
};


const obtenerProyectoPorRol = async (idProyecto, idRol) => {
  const { data, error } = await supabase
    .from('proyecto')
    .select(`
      *,
      usuario (
        idusuario,
        nombre,
        correoelectronico,
        tipo,
        nivelusuario
      ),
      proyecto_roles!inner (
        estado,
        idrol,
        roles (
          idrol,
          nombrerol,
          nivelrol,
          descripcionrol
        )
      ),
      miembro (
        idmiembro,
        usuario (
          idusuario,
          nombre,
          correoelectronico,
          tipo,
          nivelusuario
        )
      ),
      utp (
        idusuario,
        estado,
        usuario (
          idusuario,
          nombre,
          correoelectronico,
          telefono,
          fotodeperfil,
          github,
          linkedin
        )
      )
    `)
    .eq('idproyecto', idProyecto)
    .eq('proyecto_roles.idrol', idRol)
    .single();

  if (error) throw error;

  // Añadir URL firmada del RFP
  try {
    const rfpUrl = await getRFPSignedUrl(idProyecto);
    data.rfpfile_url = rfpUrl;
  } catch (err) {
    console.warn("No se pudo obtener URL del RFP:", err.message);
  }

  // Añadir URL de la foto de perfil a cada usuario en UTP
  if (Array.isArray(data.utp)) {
    for (const miembro of data.utp) {
      const userId = miembro?.usuario?.idusuario;
      if (userId) {
        const signedUrlObj = await generateProfileSignedUrl(userId);
        if (signedUrlObj?.url) {
          miembro.usuario.fotodeperfil_url = signedUrlObj.url;
        }
      }
    }
  }

  return data;
};




const obtenerProyectoCompleto = async (idProyecto) => {
  const { data: proyecto, error } = await supabase
    .from('proyecto')
    .select(`
      *,
      cliente (
        idcliente,
        clnombre,
        inversion,
        fotodecliente
      ),
      usuario (
        idusuario,
        employeeeid,
        nombre,
        correoelectronico,
        telefono,
        ubicacion,
        linkedin,
        github,
        fotodeperfil
      ),
      proyecto_roles (
        idrol,
        estado,
        roles (
          idrol,
          nombrerol,
          nivelrol,
          descripcionrol,
          requerimientos_roles (
            requerimientos (
              idrequerimiento,
              tiempoexperiencia,
              habilidades (
                idhabilidad,
                nombre,
                estecnica
              )
            )
          )
        )
      ),
      utp (
        idusuario,
        estado,
        usuario (
          idusuario,
          nombre,
          correoelectronico,
          telefono,
          fotodeperfil,
          github,
          linkedin
        )
      )
    `)
    .eq('idproyecto', idProyecto)
    .single();

  if (error) throw error;

  // Agregar la URL firmada del RFP
  try {
    const rfpUrl = await getRFPSignedUrl(idProyecto);
    proyecto.rfpfile_url = rfpUrl;
  } catch (err) {
    console.warn("No se pudo obtener URL del RFP:", err.message);
  }

  // Agregar cliente con URL firmada (foto)
  if (proyecto.cliente?.idcliente) {
    const clienteConUrl = await getClienteFotoUrl(proyecto.cliente.idcliente);
    proyecto.cliente = { ...proyecto.cliente, ...clienteConUrl };
  }

  // Agregar URL de foto al creador del proyecto
  if (proyecto.usuario?.idusuario) {
    const signedUrlObj = await generateProfileSignedUrl(proyecto.usuario.idusuario);
    if (signedUrlObj?.url) {
      proyecto.usuario.fotodeperfil_url = signedUrlObj.url;
    }
  }

  // Agregar URL de foto de perfil a los miembros UTP
  if (Array.isArray(proyecto.utp)) {
    for (const miembro of proyecto.utp) {
      const userId = miembro?.usuario?.idusuario;
      if (userId) {
        const signedUrlObj = await generateProfileSignedUrl(userId);
        if (signedUrlObj?.url) {
          miembro.usuario.fotodeperfil_url = signedUrlObj.url;
        }
      }
    }
  }

  return proyecto;
};

const obtenerProyectosPorCreador = async (idusuario) => {
    const { data: proyectos, error } = await supabase
    .from('proyecto')
    .select(`
      *,
      cliente (
        clnombre,
        fotodecliente
      ),
      proyecto_roles (
        *,
        roles (
          nombrerol,
          descripcionrol,
          disponible
        )
      )
    `)
    .eq('idusuario', idusuario);

  if (error) throw error;

  const proyectosConUrls = await Promise.all(proyectos.map(async proyecto => {
    // URL firmada para el RFP
    let rfpfile_url = null;
    try {
      if (proyecto.rfpfile) {
        rfpfile_url = await getRFPSignedUrl(proyecto.idproyecto);
      }
    } catch (e) {
      rfpfile_url = null; // Si no hay archivo o falla, dejarlo como null
    }

    // URL firmada para la foto del cliente
    let fotodecliente_url = null;
    if (proyecto.cliente?.fotodecliente) {
      const { data: signedFoto } = await supabase.storage
        .from('fotos-clientes')
        .createSignedUrl(proyecto.cliente.fotodecliente, 60 * 60);
      if (signedFoto?.signedUrl) {
        fotodecliente_url = signedFoto.signedUrl;
      }
    }

    return {
      ...proyecto,
      rfpfile_url,
      cliente: {
        ...proyecto.cliente,
        fotodecliente_url,
      }
    };
  }));

  return proyectosConUrls;
};


const actualizarProyectoYRoles = async (idproyecto, { pnombre, descripcion, fechainicio, fechafin, roles }) => {
  const { error: errorProyecto } = await supabase
    .from('proyecto')
    .update({ pnombre, descripcion, fechainicio, fechafin })
    .eq('idproyecto', idproyecto);

  if (errorProyecto) throw errorProyecto;

  // Actualizar roles (asumiendo que vienen con idrol y los nuevos campos)
  for (const rol of roles) {
    const { idrol, nombrerol, descripcionrol, estado, disponible } = rol;
    const { error: errorRol } = await supabase
      .from('roles')
      .update({ nombrerol, descripcionrol, estado, disponible })
      .eq('idrol', idrol);

    if (errorRol) throw errorRol;
  }

  return { message: 'Proyecto y roles actualizados correctamente' };
};


module.exports = {
  fetchProjects,
  fetchMyProjects,
  fetchProjectById,
  fetchProjectsByName,
  fetchCreateProject,
  fetchUpdateProject,
  uploadRFPToStorage,
  saveRFPPathToProject,
  getRFPSignedUrl,
  obtenerProyectoPorRol,
  obtenerProyectoCompleto,
  obtenerProyectosPorCreador,
  actualizarProyectoYRoles
};
