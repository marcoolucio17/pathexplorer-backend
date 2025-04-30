const supabase = require('../config/supabaseClient');

//Consulta para llamar la información de la tabla metas
const fetchGoal = async () => { 
    const {data,error} = await supabase
    .from("metas")
    .select("idmeta,idusuario,meta,plazo");
    if (error) throw error;
    return data;
}

//Consulta para llamar la información de la tabla metas filtrando por id de meta
const fetchGoalById = async (id) => { 
    const { data, error } = await supabase
        .from("metas")
        .select("idmeta,idusuario,meta,plazo")
        .eq('idmeta', id);
    if (error) throw error;
    return data;
};

//Consulta para actualizar meta por id de meta
const fetchUpdateGoal = async (id, goal) => {
    const { data, error } = await supabase
        .from("metas")
        .update([goal])
        .eq('idmeta', id);
    if (error) throw error;
    return data;
}

module.exports = {
    fetchGoal,
    fetchGoalById,
    fetchUpdateGoal
};