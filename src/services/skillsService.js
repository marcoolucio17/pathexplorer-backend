const supabase = require('../config/supabaseClient');

//Consulta para llamar toda la tabla de habilidades
const fetchSkills = async () => {
    const { data, error } = await supabase.from("habilidades").select("*");
    if (error) throw error;
    return data;
};

module.exports = { fetchSkills };