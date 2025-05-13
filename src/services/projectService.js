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
        cliente(clnombre),
        proyecto_roles(
            idrol,
            roles(
                nombrerol,
                descripcionrol,
                requerimientos_roles(
                    requerimientos(
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

//Case insensitive search
const fetchProjectsByName = async (nombre_proyecto) => { 
    const { data, error } = await supabase
        .from("proyecto")
        .select(`idproyecto,
                 pnombre,
                 descripcion,
                 cliente(clnombre),
                 proyecto_roles(
                 idrol,
                 roles(
                     nombrerol,
                     descripcionrol,
                     requerimientos_roles(
                         requerimientos(
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
                 cliente(clnombre),
                 proyecto_roles(
                 idrol,
                 roles(
                     nombrerol,
                     descripcionrol,
                     requerimientos_roles(
                         requerimientos(
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


module.exports = { 
    fetchProjects, 
    fetchProjectById, 
    fetchProjectsByName
};