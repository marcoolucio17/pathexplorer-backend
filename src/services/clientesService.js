const supabase = require('../config/supabaseClient');

const fetchClientes = async () => {
  const { data, error } = await supabase
    .from('cliente')
    .select('*');

  if (error) throw error;
  return data;
};

const fetchClientePorId = async (id) => {
  const { data, error } = await supabase
    .from('cliente')
    .select('*')
    .eq('idcliente', id)
    .single();

  if (error) throw error;
  return data;
};

const insertarCliente = async ({ clnombre, inversion, fotodecliente }) => {
  const { data, error } = await supabase
    .from('cliente')
    .insert([{ clnombre, inversion, fotodecliente }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

const modificarCliente = async (id, { clnombre, inversion, fotodecliente }) => {
  const { data, error } = await supabase
    .from('cliente')
    .update({ clnombre, inversion, fotodecliente })
    .eq('idcliente', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

module.exports = {
  fetchClientes,
  fetchClientePorId,
  insertarCliente,
  modificarCliente,
};
