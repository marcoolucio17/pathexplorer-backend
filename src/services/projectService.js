const supabase = require('../config/supabaseClient');
const ApiError = require('../utils/errorHelper');

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

const fetchProjects= async () => { 
    const { data, error } = await supabase
        .from("proyecto")
        .select(
            `idproyecto,
        pnombre,
        descripcion,
        fechainicio,
        fechafin,
        proyectoterminado,
        idusuario,
        rfpfile,
        cliente(
            idcliente,
            clnombre),
        proyecto_roles(
            roles(
                idrol,
                nombrerol,
                nivelrol,
                descripcionrol,
                disponible,
                requerimientos_roles(
                    requerimientos(
                        idrequerimiento,
                        tiempoexperiencia,
                        habilidades(
                            idhabilidad,
                            nombre,
                            estecnica
                        )
                    )
                )
            )
        )`)
        .eq("proyectoterminado", false);
    if (error) {
        console.log("error", error);
        throw new ApiError(error.status || 400, error.message || "There is an error fetching the projects.");
    };
    const dataProyectos = selectProyectosRolesDisponibles(data);
    return dataProyectos;
};

const fetchMyProjects = async (id_usuario) => {
    const { data, error } = await supabase
                                .from("proyecto")
                                .select(
                                    `idproyecto,
                                     pnombre,
                                     descripcion,
                                     fechainicio,
                                     fechafin,
                                     proyectoterminado,
                                     idusuario,
                                     rfpfile,
                                     cliente(
                                        idcliente,
                                        clnombre),
                                     proyecto_roles(
                                     roles(
                                      idrol,
                                      nombrerol,
                                      nivelrol,
                                      descripcionrol,
                                      disponible,
                                      requerimientos_roles(
                                          requerimientos(
                                            idrequerimiento,
                                            tiempoexperiencia,
                                            habilidades(
                                              idhabilidad,
                                              nombre,
                                              estecnica
                                            )
                                          )
                                      )
                                    )
                             )`)
        .eq("idusuario", id_usuario);
    if (error) {
        console.log("error", error);
        throw new ApiError(error.status || 400, error.message || "There is an error fetching the projects.");
    };
    
    return data;
}

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
        .select(`idproyecto,
        pnombre,
        descripcion,
        fechainicio,
        fechafin,
        proyectoterminado,
        idusuario,
        rfpfile,
        cliente(
            idcliente,
            clnombre),
        proyecto_roles(
            roles(
                idrol,
                nombrerol,
                nivelrol,
                descripcionrol,
                disponible,
                requerimientos_roles(
                    requerimientos(
                        idrequerimiento,
                        tiempoexperiencia,
                        habilidades(
                            idhabilidad,
                            nombre,
                            estecnica
                        )
                    )
                )
            )
        )`)
        .ilike('pnombre', `%${nombre_proyecto}%`)
        .eq("proyectoterminado", false);
    
    if (error) {
        console.log("error", error);
        throw new ApiError(error.status || 400, error.message || "There is an error fetching the projects.");
    };
    const dataProyectos = selectProyectosRolesDisponibles(data);
    return dataProyectos;
}

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
        .select(`idproyecto,
        pnombre,
        descripcion,
        fechainicio,
        fechafin,
        proyectoterminado,
        usuario(idusuario,nombre),
        projectdeliverables,
        utp(
            usuario(
                idusuario,
                nombre
            )
        ),
        cliente(
            idcliente,
            clnombre),
        proyecto_roles(
            estado,
            roles(
                idrol,
                nombrerol,
                nivelrol,
                descripcionrol,
                disponible,
                requerimientos_roles(
                    requerimientos(
                        idrequerimiento,
                        tiempoexperiencia,
                        habilidades(
                            idhabilidad,
                            nombre,
                            estecnica
                        )
                    )
                )
            )
        )`)
        .eq('idproyecto', id_proyecto);

    if (error) {
        console.log("error", error);
        throw new ApiError(error.status || 400, error.message || "There is an error fetching the projects.");
    };
    
    
    const url = await getRFPSignedUrl(id_proyecto);
    const dataProyectos = dataProjectsReorganized(data,url);
    return dataProyectos;
};

const dataProjectsReorganized = (data,url) => {
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
        roles: (project.proyecto_roles || []).map(role =>
            role.roles?.nombrerol || "Role not defined"
        ),
        habilidades: [...new Set((project.proyecto_roles || []).flatMap(rol =>
            
            rol.roles?.requerimientos_roles?.map(req => req.requerimientos?.habilidades?.nombre || "Skill not defined") || []
            
        ))],
        miembros: (project.utp || []).map(utp =>
            utp.usuario?.nombre 
        )

    };
    
    return informationProjects;

}

const selectProyectosRolesDisponibles = async (data) => { 
    const proyectosConRolesDisponibles = data
  .map(proyecto => ({
    ...proyecto,
    proyecto_roles: Array.isArray(proyecto.proyecto_roles)
      ? proyecto.proyecto_roles.filter(pr => pr.roles?.disponible === true)
      : []
  }))
  .filter(proyecto => proyecto.proyecto_roles.length > 0);

    return proyectosConRolesDisponibles;
}

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

const fetchCreateProject = async (informacion) => {
    
    try {
        const {proyect, roles} = informacion; 
        if (!proyect) {
            throw new ApiError(400, "No se ha recibido la información del proyecto.");
        }
        if(!roles){
            throw new ApiError(400, "No se ha recibido la información de los roles.");
        }
        let idproyecto;
        const {data: proyectData, error: proyectError} = await supabase
            .from("proyecto")
            .insert([proyect])
            .select(`idproyecto`);
        if (!proyectData || proyectData.length === 0) {
            const {data: proyectData, error: proyectError} = await supabase
                .from("proyecto")
                .select(`idproyecto`)
                .eq('pnombre', proyect.pnombre)
                .eq('descripcion', proyect.descripcion)
                .eq('fecha_inicio', proyect.fecha_inicio)
                .eq('fecha_fin', proyect.fecha_fin)
                .eq('idcliente', proyect.idcliente);

            idproyecto = proyectData[0].idproyecto;
        } else {
            idproyecto = proyectData[0].idproyecto;
        }
       
        for (let i = 0; i < roles.length; i++) {
            let idrol;
            const {data: rolData, error: rolError} = await supabase
                .from("roles")
                .insert([ {
                    nombrerol: roles[i].nombrerol,
                    nivelrol: roles[i].nivelrol,
                    descripcionrol: roles[i].descripcionrol,
                    disponible: roles[i].disponible
                }])
                .select(`idrol`);
            if (!rolData || rolData.length === 0) {

                const {data: rolData, error: rolError} = await supabase
                    .from("roles")
                    .select(`idrol`)
                    .eq('nombrerol', roles[i].nombrerol)
                    .eq('nivelrol', roles[i].nivelrol)
                    .eq('descripcionrol', roles[i].descripcionrol)
                    .eq('disponible', roles[i].disponible);
                idrol = rolData[0].idrol;
            };
            idrol = rolData[0].idrol;
            
            const {requerimientos} = roles[i];
        
            for (let j = 0; j <requerimientos.length; j++) {
                let idrequerimiento;
                const {tiempoexperiencia, idhabilidad} = requerimientos[j];
                const {data: existeReq, error: existeError} = await supabase
                    .from("requerimientos")
                    .select(`idrequerimiento`)
                    .eq('tiempoexperiencia', tiempoexperiencia)
                    .eq('idhabilidad', idhabilidad);
                if(!existeReq || existeReq.length === 0){
                    const {data: reqData, error: reqError} = await supabase
                        .from("requerimientos")
                        .insert([{
                            tiempoexperiencia: tiempoexperiencia,
                            idhabilidad: idhabilidad
                        }]);
                    const {data: existeReq, error: existeError} = await supabase
                        .from("requerimientos")
                        .select(`idrequerimiento`)
                        .eq('tiempoexperiencia', tiempoexperiencia)
                        .eq('idhabilidad', idhabilidad);
                        console.log("existeReq", existeReq);
                    idrequerimiento = existeReq[0].idrequerimiento;
                } 
                const {data: reqRolData, error: reqRolError} = await supabase 
                    .from("requerimientos_roles")
                    .insert([{
                        idrol: idrol,
                        idrequerimiento: idrequerimiento
                }]);          
            }
            const {data: proyectRolData, error: proyectRolError} = await supabase 
                .from("proyecto_roles")
                .insert([{
                    idproyecto: idproyecto,
                    idrol: idrol
                }]);
        }
         return { idproyecto };

    } catch (error) {
        console.log("error", error);
        throw new ApiError(error.status || 400, error.message || "There is an error creating the project.");
    }
    
   
};

const fetchUpdateProject = async (id_proyecto, informacion) => {
    try {
        const {data, error} = await supabase
            .from("proyecto")
            .update(informacion)
            .eq('idproyecto', id_proyecto);
        
        return true;
    } catch (error) {
        console.log("error", error);
        throw new ApiError(error.status || 400, error.message || "There is an error updating the project.");
    };
        
}


const uploadRFPToStorage = async (file) => {
  const fileName = `rfp-${Date.now()}-${file.originalname}`;

  const { data, error } = await supabase.storage
    .from('rfpproyecto')
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) throw error;

  return data.path;
};


const saveRFPPathToProject = async (projectId, filePath) => {
  const { data, error } = await supabase
    .from('proyecto')
    .update({ rfpfile: filePath })
    .eq('idproyecto', projectId)
    .select();

  console.log('Actualización de Proyecto:', { projectId, filePath, data, error });

  if (error || !data || data.length === 0) {
    throw new Error('No se pudo actualizar el proyecto o el ID es inválido');
  }
};

const getRFPSignedUrl = async (projectId) => {
  const { data: proyecto, error } = await supabase
    .from('proyecto')
    .select('rfpfile')
    .eq('idproyecto', projectId)
    .single();

  if (error || !proyecto || !proyecto.rfpfile) {
    throw new Error('Archivo RFP no encontrado');
  }

  const { data: signedUrlData, error: urlError } = await supabase.storage
    .from('rfpproyecto')
    .createSignedUrl(proyecto.rfpfile, 300); // URL válida 5 min

  if (urlError) {
    throw new Error('Error al generar URL firmada');
    }
    return signedUrlData.signedUrl;
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
    getRFPSignedUrl
};