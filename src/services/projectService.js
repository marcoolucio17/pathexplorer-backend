const supabase = require('../config/supabaseClient');

//Consulta para llamar toda la tabla de proyectos en la pantalla de Dashboard
const fetchProjects= async () => { 
    const { data,error} = await supabase.from("proyecto").select("idproyecto,pnombre,descripcion,cliente(clnombre),proyecto_roles(idrol,roles(nombrerol,descripcionrol),estado)");
    if (error) throw error;
    return data;
};

//Consulta para llamar un proyecto por id
const fechtProjectById = async (id) => { 
    
    const { data, error } = await supabase
        .from("proyecto")
        .select("idproyecto,pnombre,descripcion,cliente(clnombre),proyecto_roles(idrol,roles(nombrerol,descripcionrol),estado)")
        .eq('idproyecto', id);
    if (error) throw error;
    return data;
}

//Consulta para agregar un nuevo proyecto a la base de datos
const fecthaddProject = async(project) => {
    const { data, error } = await supabase
        .from("proyecto")
        .insert([project]);
    
    if (error) throw error;
    return data;
}

//Consulta para actualizar un proyecto en la base de datos
const fetchUpdateProject = async (id, project) => {
    const { data, error } = await supabase
        .from("proyecto")
        .update([project])
        .eq('idproyecto', id);
    if (error) throw error;
    return data;

}


module.exports = { fetchProjects, fechtProjectById, fecthaddProject, fetchUpdateProject };