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

//Lo mismo que fetchProjects, pero con un filtro por nombre de proyecto
const fetchProjectsByNameCaseInsensitive = async (name) => { 
    const { data, error } = await supabase
        .from("proyecto")
        .select("idproyecto,pnombre,descripcion,cliente(clnombre),proyecto_roles(idrol,roles(nombrerol,descripcionrol,requerimientos_roles(requerimientos(habilidades(idhabilidad,nombre,estecnica)))))")
        .ilike('pnombre', `%${name}%`);
    if (error) throw error;
    return data;
}

//Lo mismo que fetchProjects, pero con un filtro por nombre de proyecto
const fetchProjectsBySkill = async (skill) => { 
    const { data, error } = await supabase
        .from("proyecto")
        .select("idproyecto,pnombre,descripcion,cliente(clnombre),proyecto_roles(idrol,roles(nombrerol,descripcionrol,requerimientos_roles(requerimientos(habilidades(idhabilidad,nombre,estecnica)))))")
        .contains('proyecto_roles.roles.requerimientos_roles.requerimientos.habilidades', [{ nombre: skill }]);
    if (error) throw error;
    return data;
}

//Consulta para llamar un proyecto por id
const fetchProjectById = async (id) => { 
    
    const { data, error } = await supabase
        .from("proyecto")
        .select("idproyecto,pnombre,descripcion,cliente(clnombre),proyecto_roles(idrol,roles(nombrerol,descripcionrol),estado)")
        .eq('idproyecto', id);
    if (error) throw error;
    return data;
};

//Consulta para agregar un nuevo proyecto a la base de datos
const fetchaddProject = async(project) => {
    const { data, error } = await supabase
        .from("proyecto")
        .insert([project]);
    
    if (error) throw error;
    return data;
};

//Consulta para actualizar un proyecto en la base de datos
const fetchUpdateProject = async (id, project) => {
    const { data, error } = await supabase
        .from("proyecto")
        .update([project])
        .eq('idproyecto', id);
    if (error) throw error;
    return data;

};

module.exports = { 
    fetchProjects, 
    fetchProjectById, 
    fetchaddProject, 
    fetchUpdateProject, 
    fetchProjectsByNameCaseInsensitive,
    fetchProjectsBySkill
    
};