const supabase = require("../config/supabaseClient");
const ApiError = require("../utils/errorHelper");
const { slugify } = require('../utils/filename');

const tableProject = `idproyecto,pnombre,descripcion,fechainicio,fechafin,proyectoterminado,projectdeliverables`;
const tableUser = `usuario(idusuario,nombre)`;
const tableUtp = `utp(usuario(idusuario,nombre))`;
const tableClient = `cliente(idcliente,clnombre,fotodecliente)`;
const tableSkill = `habilidades(idhabilidad,nombre,estecnica)`;
const tableRequirement = `requerimientos(idrequerimiento,tiempoexperiencia,${tableSkill})`;
const tableRequerimientosRoles = `requerimientos_roles(${tableRequirement})`;
//Aquí afecta el rol
const tableRoles = `roles(idrol,nombrerol,nivelrol,descripcionrol,disponible,${tableRequerimientosRoles})`;
const tableProjectRoles = `proyecto_roles(${tableRoles})`;
const textToObtainInfoProject = `${tableProject},${tableUser},${tableUtp},${tableClient},${tableProjectRoles}`;
const { getClienteFotoUrl } = require("../services/clientesService");
const { generateProfileSignedUrl } = require("../services/userService");
// const { fetchRolesName } = require("../services/rolesService");
const { fetchCompatibility } = require("../services/compabilityService");

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
const fetchAllUserSkills = async (idusuario) => {
  const { data: dataUserHab, error: errorUserHab } = await supabase
    .from("usuario_habilidad")
    .select("idhabilidad")
    .eq("idusuario", idusuario);
  if (errorUserHab) {
    throw new Error("Error fetching user skills: " + errorUserHab.message);
  }
  return dataUserHab;
};

const fetchAllRolesSkills = async () => {
  const { data: dataRolHab, error: errorRolHab } = await supabase.from("roles")
    .select(`idrol,
              requerimientos_roles(
                      requerimientos(
                          habilidades(idhabilidad)
                      )
                  )`);
  if (errorRolHab) {
    throw new Error(`Error fetching roles skills: ${errorRolHab.message}`);
  }
  return dataRolHab;
};



const fetchProjects = async (req, res) => {
  const { idcliente = null, idusuario = null } = req.query;

  let query = supabase
    .from("proyecto")
    .select(textToObtainInfoProject)
    .eq("proyectoterminado", false)
    .eq("proyecto_roles.estado", "Pendiente")
    .order("idproyecto", { ascending: true });

  if (idcliente !== null && idcliente !== undefined) {
    query = query.eq("idcliente", idcliente);
  }

  if (idusuario !== null && idusuario !== undefined) {
    query = query.eq("idusuario", idusuario);
  }

  const { data, error } = await query;

  if (error) {
    throw new ApiError(
      error.status || 400,
      error.message || "There is an error fetching the projects."
    );
  }

  const proyectosConUrl = await Promise.all(
    data.map(async (proy) => {
      if (proy.cliente?.idcliente) {
        try {
          const clienteUrlObj = await getClienteFotoUrl(proy.cliente.idcliente);
          proy.cliente = { ...proy.cliente, ...clienteUrlObj }; // agrega fotodecliente_url
        } catch (e) {
          // Si falla la URL, ignóralo para no romper la respuesta
        }
      }
      return proy;
    })
  );

  return proyectosConUrl;
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
const fetchProjectsByName = async (req, res) => {
  const { idcliente = null, idusuario = null, projectName = null } = req.query;

  let query = supabase
    .from("proyecto")
    .select(textToObtainInfoProject)
    .ilike("pnombre", `%${projectName}%`)
    .order("idproyecto", { ascending: true })
    .eq("proyecto_roles.estado", "Pendiente")
    .eq("proyectoterminado", false);

  if (idcliente !== null && idcliente !== undefined) {
    query = query.eq("idcliente", idcliente);
  }

  if (idusuario !== null && idusuario !== undefined) {
    query = query.eq("idusuario", idusuario);
  }

  const { data, error } = await query;
  if (error) {
    throw new ApiError(
      error.status || 400,
      error.message || "There is an error fetching the projects."
    );
  }

  const proyectosConUrl = await Promise.all(
    data.map(async (proy) => {
      if (proy.cliente?.idcliente) {
        try {
          const clienteUrlObj = await getClienteFotoUrl(proy.cliente.idcliente);
          proy.cliente = { ...proy.cliente, ...clienteUrlObj }; // agrega fotodecliente_url
        } catch (e) {
          // Si falla la URL, ignóralo para no romper la respuesta
        }
      }
      return proy;
    })
  );
  return proyectosConUrl;
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
    throw new ApiError(
      error.status || 400,
      error.message || "There is an error fetching the projects."
    );
  }

  let url;

  try {
    url = await getRFPSignedUrl(id_proyecto);
  } catch (error) {
    url = "";
  }
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
      .insert([
        {
          ...proyect, // debe contener projectdeliverables si lo tiene
        },
      ])
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
            nombrerol: rol.nombrerol,
            nivelrol: rol.nivelrol,
            descripcionrol: rol.descripcionrol,
            disponible: rol.disponible,
          },
        ])
        .select("idrol")
        .single();

      if (rolError || !rolData) {
        throw new ApiError(500, rolError?.message || "Error al crear el rol.");
      }

      const idrol = rolData.idrol;

      for (const req of rol.requerimientos) {
        const { tiempoexperiencia, idhabilidad } = req;
        const { data: existeReq, error: existeError } = await supabase
          .from("requerimientos")
          .select("idrequerimiento")
          .eq("tiempoexperiencia", tiempoexperiencia)
          .eq("idhabilidad", idhabilidad)
          .maybeSingle();

        let idrequerimiento;

        if (existeReq) {
          idrequerimiento = existeReq.idrequerimiento;
        } else {
          const { data: reqData, error: reqError } = await supabase
            .from("requerimientos")
            .insert([{ tiempoexperiencia, idhabilidad }])
            .select("idrequerimiento")
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
          .insert([{ idrol, idrequerimiento }]);

        if (reqRolError) {
          throw new ApiError(
            500,
            reqRolError?.message || "Error al asignar requerimientos al rol."
          );
        }
      }

      const { error: proyectRolError } = await supabase
        .from("proyecto_roles")
        .insert([{ idproyecto, idrol }]);

      if (proyectRolError) {
        throw new ApiError(
          500,
          proyectRolError?.message || "Error al asignar el rol al proyecto."
        );
      }
    }
    return { idproyecto };
  } catch (error) {
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
    throw new ApiError(
      error.status || 400,
      error.message || "There is an error updating the project."
    );
  }
};

const uploadRFPToStorage = async (file) => {
  const ext      = file.originalname.split('.').pop();
  const baseName = file.originalname.replace(/\.[^/.]+$/, '');
  const fileName = `rfp-${Date.now()}-${slugify(baseName)}.${ext}`;

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
    .from("proyecto")
    .select(
      `
      *,
      proyecto_roles!inner (
        estado,
        idrol,
        roles (
          idrol,
          nombrerol,
          nivelrol,
          descripcionrol,
          requerimientos_roles (
            requerimientos (
              habilidades(idhabilidad,nombre,estecnica),
              idrequerimiento,
              tiempoexperiencia
            ))
              
        )
      ),
      cliente (
        idcliente,
        clnombre,
        inversion,
        fotodecliente
      )

    `
    )
    .eq("idproyecto", idProyecto)
    .eq("proyecto_roles.idrol", idRol)
    .single();

  if (error) throw error;

  // Agregar cliente con URL firmada (foto)
  if (data.cliente?.idcliente) {
    const clienteConUrl = await getClienteFotoUrl(data.cliente.idcliente);
    data.cliente = {
      ...clienteConUrl,
    };
  }

  return data;
};

const obtenerProyectoCompleto = async (idProyecto) => {
  const { data: proyecto, error } = await supabase
    .from("proyecto")
    .select(
      `
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
    `
    )
    .eq("idproyecto", idProyecto)
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
    const signedUrlObj = await generateProfileSignedUrl(
      proyecto.usuario.idusuario
    );
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
    .from("proyecto")
    .select(
      `
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
    `
    )
    .eq("idusuario", idusuario);

  if (error) throw error;

  const proyectosConUrls = await Promise.all(
    proyectos.map(async (proyecto) => {
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
          .from("fotos-clientes")
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
        },
      };
    })
  );

  return proyectosConUrls;
};

const actualizarProyectoYRoles = async (
  idproyecto,
  { pnombre, descripcion, fechainicio, fechafin, projectdeliverables, roles }
) => {
  /* Proyecto ---------------------------------------------------- */
  const { error: errorProyecto } = await supabase
    .from('proyecto')
    .update({ pnombre, descripcion, fechainicio, fechafin, projectdeliverables })
    .eq('idproyecto', idproyecto);

  if (errorProyecto) throw errorProyecto;

  /* 2️Procesar cada rol ------------------------------------------ */
  for (const rol of roles) {
    const {
      idrol = null,
      nombrerol,
      nivelrol,
      descripcionrol,
      disponible,
      requerimientos = [],
    } = rol;

    let rolId = idrol;

    /* ── a) INSERT / UPDATE del rol ──────────────────────────────── */
    if (rolId) {
      const { error: errorRol } = await supabase
        .from('roles')
        .update({ nombrerol, nivelrol, descripcionrol, disponible })
        .eq('idrol', rolId);
      if (errorRol) throw errorRol;
    } else {
      const { data: rolData, error: errorRolIns } = await supabase
        .from('roles')
        .insert([{ nombrerol, nivelrol, descripcionrol, disponible }])
        .select('idrol')
        .single();
      if (errorRolIns) throw errorRolIns;
      rolId = rolData.idrol;

      /* Vincula rol nuevo al proyecto */
      const { error: errLink } = await supabase
        .from('proyecto_roles')
        .insert([{ idproyecto, idrol: rolId }]);
      if (errLink) throw errLink;
    }

    /* ── b) Sincronizar requerimientos del rol ───────────────────── */
    // 1. Obtener los req actuales del rol
    const { data: reqActuales } = await supabase
      .from('requerimientos_roles')
      .select('idrequerimiento')
      .eq('idrol', rolId);

    const idsActuales = new Set(reqActuales.map((r) => r.idrequerimiento));
    const idsDeseados = new Set();

    for (const req of requerimientos) {
      const { tiempoexperiencia, idhabilidad } = req;

      // ¿Existe ya este requerimiento con (tiempo, habilidad)?
      const { data: reqExist } = await supabase
        .from('requerimientos')
        .select('idrequerimiento')
        .eq('tiempoexperiencia', tiempoexperiencia)
        .eq('idhabilidad', idhabilidad)
        .maybeSingle();

      let idreq = reqExist?.idrequerimiento;

      // Si no existe ⇒ crear
      if (!idreq) {
        const { data: reqNew, error: reqErr } = await supabase
          .from('requerimientos')
          .insert([{ tiempoexperiencia, idhabilidad }])
          .select('idrequerimiento')
          .single();
        if (reqErr) throw reqErr;
        idreq = reqNew.idrequerimiento;
      }

      idsDeseados.add(idreq);

      // Asegurar vínculo rol-req
      if (!idsActuales.has(idreq)) {
        const { error: linkErr } = await supabase
          .from('requerimientos_roles')
          .insert([{ idrol: rolId, idrequerimiento: idreq }]);
        if (linkErr && linkErr.code !== '23505') throw linkErr; // ignora duplicado único
      }
    }

    // 2. Eliminar vínculos que ya no se desean
    for (const idreq of idsActuales) {
      if (!idsDeseados.has(idreq)) {
        const { error: delErr } = await supabase
          .from('requerimientos_roles')
          .delete()
          .match({ idrol: rolId, idrequerimiento: idreq });
        if (delErr) throw delErr;
      }
    }
  }

  return { message: 'Proyecto y roles actualizados correctamente' };
};

const eliminarRelacionProyectoRol = async (idproyecto, idrol) => {
  if (!idproyecto || !idrol) {
    throw new Error("Faltan parámetros idproyecto o idrol");
  }

  const { error } = await supabase
    .from("proyecto_roles")
    .delete()
    .match({ idproyecto: parseInt(idproyecto), idrol: parseInt(idrol) });

  if (error) {
    throw error;
  }
};

const obtenerTopProyectos = async (idusuario) => {
  const { data: roles, error: errorRoles } = await supabase
    .from("proyecto_roles")
    .select("idrol, idproyecto")
    .eq("estado", "Pendiente");

  const userResult = await fetchAllUserSkills(idusuario);

  const userSkills = new Set(
    userResult.flatMap((habilidad) => habilidad.idhabilidad)
  );

  const rolesResult = await fetchAllRolesSkills();

  const rolesSkills = {};

  rolesResult.forEach((rol) => {
    const skills = rol.requerimientos_roles.flatMap((req) => {
      return req.requerimientos.habilidades.idhabilidad || [];
    });
    const uniqueSkills = [...new Set(skills)];
    rolesSkills[rol.idrol] = uniqueSkills;
  });

  if (errorRoles) throw errorRoles;

  // Paso 1: Calculamos compatibilidad para cada rol
  const promesas = roles.map(({ idrol, idproyecto }) => {
    const res = fetchCompatibility(rolesSkills[idrol], userSkills);
    return {
      idrol,
      idproyecto,
      comp: res,
    };
  });

  const resultados = promesas;
  const top3 = resultados.sort((a, b) => b.comp - a.comp).slice(0, 3);

  const projectFetches = top3.map(async ({ idrol, idproyecto, comp }) => {
    const project = await obtenerProyectoPorRol(idproyecto, idrol);

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
      idproyecto: project.idproyecto,
      pnombre: project.pnombre,
      descripcion: project.descripcion,
      fechainicio: project.fechainicio,
      fechafin: project.fechafin,
      cliente: {
        idcliente: project.cliente?.idcliente || null,
        clnombre: project.cliente?.clnombre || null,
        fotodecliente_url: project.cliente?.fotodecliente_url || null,
      },
      duracionMes: project.duracionMes,
      idrol: project.proyecto_roles[0]?.roles?.idrol || null,
      nivelrol: project.proyecto_roles[0]?.roles?.nivelrol || null,
      nombrerol: project.proyecto_roles[0]?.roles?.nombrerol || null,
      descripcionrol: project.proyecto_roles[0]?.roles?.descripcionrol || null,
      requerimientos_roles:
        project.proyecto_roles[0]?.roles?.requerimientos_roles || [],
      compatibility: comp,
      duracionMes: duracionMes,
    };
  });

  const projects = await Promise.all(projectFetches);

  return projects;
};

module.exports = {
  fetchProjects,
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
  actualizarProyectoYRoles,
  eliminarRelacionProyectoRol,
  obtenerTopProyectos,
  fetchAllUserSkills,
  fetchAllRolesSkills,

};
