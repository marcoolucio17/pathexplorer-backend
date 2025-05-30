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

const getAllSkills = async () => {
    const { data, error } = await supabase
        .from('habilidades')
        .select('*');

    if (error) throw error;

    return data;
};


const assignSkillToUser = async (idusuario, idhabilidad) => {
  //checa si si ya esta
  const { data: existing, error: selectError } = await supabase
    .from('usuario_habilidad')
    .select('*')
    .eq('idusuario', idusuario)
    .eq('idhabilidad', idhabilidad)
    .maybeSingle(); 
  if (selectError) {
    console.error('Error al verificar si ya existe:', selectError);
    throw new Error('Error al verificar la relación');
  }

  if (existing) {
    throw new Error('Esta habilidad ya está asignada al usuario');
  }

  //si no esta, la agrega 
  const { data, error } = await supabase
    .from('usuario_habilidad')
    .insert([{ idusuario, idhabilidad }]);

  if (error) {
    console.error('Error al asignar habilidad:', error);
    throw new Error('Error al asignar habilidad al usuario');
  }

  return data;
};


module.exports = {
  getSkillsByType,
  assignSkillToUser,
  getAllSkills
};