const supabase = require('../config/supabaseClient');

//Consulta para llamar las certificaciones 

const fetchCertificates = async () => {
    const { data, error } = await supabase.from("certificaciones").select("*");
    if (error) throw error;
    return data;
};

module.exports = { fetchCertificates };