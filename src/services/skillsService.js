const supabase = require('../config/supabaseClient');

const getSkillsByType = async (isTechnical) => {
    if (typeof isTechnical !== 'boolean') {
        throw new Error("El parámetro debe ser booleano");
    }

    const { data, error } = await supabase
        .from('habilidades')
        .select('*')
        .eq('estecnica', isTechnical);

    if (error) throw error;

    return data;
};


module.exports = {
  getSkillsByType,
};