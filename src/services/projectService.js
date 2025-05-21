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
    const {data,error} = await supabase
    .from("proyecto")
    .select(
        `idproyecto,
        pnombre,
        descripcion,
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
    if (error) {
        console.log("error", error);
        throw new ApiError(error.status || 400, error.message || "There is an error fetching the projects.");};
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
        .select(`idproyecto,
        pnombre,
        descripcion,
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
        .ilike('pnombre', `%${nombre_proyecto}%`);
    if (error) {
        console.log("error", error);
        throw new ApiError(error.status || 400, error.message || "There is an error fetching the projects.");};
    return data;
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
        .eq('idproyecto', id_proyecto);
    if (error) {
        console.log("error", error);
        throw new ApiError(error.status || 400, error.message || "There is an error fetching the projects.");};
    return data;
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
         return true;

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


module.exports = { 
    fetchProjects, 
    fetchProjectById, 
    fetchProjectsByName,
    fetchCreateProject,
    fetchUpdateProject
};