const supabase = require('../config/supabaseClient');

//Consulta para llamar toda la tabla de proyectos
const fetchProjects = async () => { 
    const { data,error} = await supabase.from("proyecto").select("*");
    if (error) throw error;
    return data;
};

//Consulta para llamar un proyecto por id
const fechtProjectById = async (id) => { 
    
    const { data, error } = await supabase
        .from("proyecto")
        .select("*")
        .eq('idproyecto', parseInt(id))
        .single();
    if (error) throw error;
    return data;
}

module.exports = { fetchProjects, fechtProjectById };