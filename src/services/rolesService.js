
const supabase = require('../config/supabaseClient');
const ApiError = require('../utils/errorHelper');
//Consulta para llamar la información de la tabla de roles

/**
 * @param "No se recibe ningun parametro"
 * @returns "Un array con la información de todos los roles - Incluye:
 *           ID de rol,
 *           Nombre de rol, 
 *           Nivel de rol, 
 *           Descripción de rol,
 *           Disponible (booleano),
 *           Por cada rol, un array de requerimientos (habilidades)- Incluye: 
 *           ID de habilidad,
 *           Nombre de habilidad,
 *          Es técnica (booleano)
 */
const fetchRoles = async () => {
    const { data, error } = await supabase
        .from("roles")
        .select(`
                idrol,
                nombrerol,
                nivelrol,
                descripcionrol,
                disponible,
                requerimientos_roles(
                    requerimientos(
                        habilidades(
                            idhabilidad,
                            nombre,
                            estecnica
                        )
                    )
                )`
            );
    if (error) {
        console.log("error", error);
        throw new ApiError(error.status || 400, error.message || "There is an error fetching the roles.");};
    return data;
}

//Consulta para llamar la información de los roles filtrando por id de rol
/**
 * @param {int} id_rol - ID del rol a buscar 
 * @returns "Un array con la información del rol - Incluye:
 *           ID de rol,
 *           Nombre de rol,
 *           Nivel de rol,
 *           Descripción de rol,
 *           Disponible (booleano) 
 *           Por cada rol, un array de requerimientos (habilidades)- Incluye: 
 *             ID de habilidad,
 *             Nombre de habilidad,
 *             Es técnica (booleano)"
 */
const fetchRoleById = async (id_rol) => { 
    const { data, error } = await supabase
        .from("roles")
        .select(`
                idrol,
                nombrerol,
                nivelrol,
                descripcionrol,
                disponible,
                requerimientos_roles(
                    requerimientos(
                        habilidades(
                            idhabilidad,
                            nombre,
                            estecnica
                        )
                    )
                )`
            )
        .eq('idrol', id_rol);
    if (error) {
        console.log("error", error);
        throw new ApiError(error.status || 400, error.message || "There is an error fetching the roles.");};
    return data;

}

//Consulta para agregar un nuevo rol 
/**
 * @param {json} rol - Objeto con la información del rol a agregar - Incluye:
 *          nombrerol,
 *          nivelrol,
 *          descripcionrol,
 *          disponible
 *          Por cada rol, un array de requerimientos (habilidades)- Incluye: 
 *             ID de habilidad,
 *             Nombre de habilidad,
 *             Es técnica (booleano)
 * @returns "true" si se agregó correctamente el rol
 */
const addRole = async (rol) => {
    const { data, error } = await supabase
        .from("roles")
        .insert(rol);
    if (error) {
        console.log("error", error);
        throw new ApiError(error.status || 400, error.message || "There is an error adding the role.");};
    return true;
}

//Consulta para actualizar un rol por id de rol 
/**
 * @param {int} id_rol 
 * @param {json} rol 
 * @returns "true" si se actualizó correctamente el rol
 */
const updateRole = async (id_rol, rol) => {
    const { data, error } = await supabase
        .from("roles")
        .update(rol)
        .eq('idrol', id_rol);
    if (error) {
        console.log("error", error);
        throw new ApiError(error.status || 400, error.message || "There is an error updating the role.");};
    return true;
} 

module.exports = {
    fetchRoles,
    fetchRoleById,
    addRole,
    updateRole

}