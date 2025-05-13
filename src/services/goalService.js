const supabase = require('../config/supabaseClient');
const ApiError = require('../utils/errorHelper');
//Consula para llamar todas las metas de un usuario
/**
 * @param {int} id_usuario - ID del usuario 
 * @returns "Un array con la información de todas las metas - Incluye:
 *          ID de meta,
 *          meta,
 *          plazo
 *
 */
const fetchGoal = async (id_usuario) => { 
    const {data,error} = await supabase
    .from("metas")
    .select(`idmeta,
             meta,
             plazo`)
    .eq('idusuario', id_usuario);
    if (error) {
        console.log("error", error);
        throw new ApiError(error.status || 400, error.message || "There is an error fetching the goals.");};
    return data;
}

//Consulta para llamar la información de la tabla metas filtrando por id de meta
/**
 * 
 * @param {int} id_meta 
 * @returns "Un array con la información de la meta - Incluye:
 *          ID de meta,
 *          meta,
 *          plazo"
 */
const fetchGoalById = async (id_meta) => { 
    const { data, error } = await supabase
        .from("metas")
        .select("idmeta,meta,plazo")
        .eq('idmeta', id_meta);
    if (error) {
        console.log("error", error);
        throw new ApiError(error.status || 400, error.message || "There is an error fetching the goal.");};
    return data;
};


//Consulta para crear una meta
/**
 * @param {object} goal - Objeto con la información de la meta a crear
 * @returns true si la meta fue creada correctamente
 */
const fetchCreateGoal = async (goal) => {
    const { data, error } = await supabase
        .from("metas")
        .insert([goal]);
    if (error) {
        console.log("error", error);
        throw new ApiError(error.status || 400, error.message || "There is an error creating the goal.");};
    return true;
}

//Consulta para actualizar meta por id de meta
/**
 * 
 * @param {int} id - ID de la meta a actualizar
 * @param {object} goal - Objeto con la información de la meta a actualizar
 * @returns true si la meta fue actualizada correctamente
 */
const fetchUpdateGoal = async (id, goal) => {
    const { data, error } = await supabase
        .from("metas")
        .update([goal])
        .eq('idmeta', id);
    if (error) {
        console.log("error", error);
        throw new ApiError(error.status || 400, error.message || "There is an error updating the goal.");};
    return true;
}

//Consulta para eliminar meta por id de meta
/**
 * 
 * @param {int} id - ID de la meta a eliminar
 * @returns true si la meta fue eliminada correctamente
 */

const fetchDeleteGoal = async (id_goal) => {
    const { data, error } = await supabase
        .from("metas")
        .delete()
        .eq('idmeta', id_goal);
    if (error) {
        console.log("error", error);
        throw new ApiError(error.status || 400, error.message || "There is an error deleting the goal.");};
    return true;
}

module.exports = {
    fetchGoal,
    fetchGoalById,
    fetchCreateGoal,
    fetchUpdateGoal,
    fetchDeleteGoal
};