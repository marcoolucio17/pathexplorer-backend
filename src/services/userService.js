const supabase = require('../config/supabaseClient');

const getUserById = async (id) => {
  const { data, error } = await supabase
    .from('usuario')
    .select('*')
    .eq('idusuario', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

module.exports = {
  getUserById
};
