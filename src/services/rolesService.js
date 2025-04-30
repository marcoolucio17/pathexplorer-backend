const supabase = require('../config/supabaseClient');

//Consulta para llamar la información de la tabla de roles

const fetchRoles = async () => {
    const { data, error } = await supabase
        .from("roles")
        .select("idrol,nombrerol,nivelrol,descripcionrol,disponible");
    if (error) throw error;
    return data;
}

//Consulta para llamar la información de los roles filtrando por id de rol

const fetchRoleById = async (id) => { 
    const { data, error } = await supabase
        .from("roles")
        .select("idrol,nombrerol,nivelrol,descripcionrol,disponible")
        .eq('idrol', id);
    if (error) throw error;
    return data;

}


module.exports = {
    fetchRoles,
    fetchRoleById
}