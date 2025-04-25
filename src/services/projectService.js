const supabase = require('../config/supabaseClient');

//Consulta para llamar la info para el proyecto en la pantalla de Dashboard
const fetchProjects= async () => { 
    const {data,error} = await supabase
    .from("proyecto")
    .select("idproyecto,pnombre,descripcion,cliente(clnombre),proyecto_roles(idrol,roles(nombrerol,descripcionrol,requerimientos_roles(requerimientos(habilidades(idhabilidad,nombre,estecnica)))))")
    //const { data,error} = await supabase.from("proyecto").select("idproyecto,pnombre,descripcion,cliente(clnombre),proyecto_roles(idrol,roles(nombrerol,descripcionrol),estado)");
    //const { data,error} = await supabase.from("proyecto").select("idproyecto,pnombre,descripcion");
    if (error) throw error;
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


module.exports = { fetchProjects, fetchProjectById, fetchaddProject, fetchUpdateProject , fetchProjectsByNameCaseInsensitive};