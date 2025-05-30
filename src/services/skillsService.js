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


const assignSkillToUser = async (idusuario, nombreHabilidad) => {
  // 1. Buscar el ID de la habilidad por su nombre
  const { data: habilidad, error: habilidadError } = await supabase
    .from('habilidades')
    .select('idhabilidad')
    .ilike('nombre', nombreHabilidad) // ilike para no ser case-sensitive
    .maybeSingle();

  if (habilidadError) {
    console.error('Error al buscar la habilidad:', habilidadError);
    throw new Error('Error al buscar la habilidad');
  }

  if (!habilidad) {
    throw new Error('La habilidad no existe');
  }

  const idhabilidad = habilidad.idhabilidad;

  // 2. Verificar si ya está asignada
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

  // 3. Asignar la habilidad
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