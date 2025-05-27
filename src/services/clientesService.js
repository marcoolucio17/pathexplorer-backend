const supabase = require('../config/supabaseClient');
const { v4: uuidv4 } = require('uuid');

const bucket = 'fotos-cliente';

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

const uploadClientImageToStorage = async (idcliente, file) => {
  const extension = file.originalname.split('.').pop();
  const fileName = `${uuidv4()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

  if (uploadError) throw new Error('Error al subir el archivo al bucket.');

  const filePath = `${fileName}`;

  // Actualizar la ruta en la tabla cliente
  const { error: dbError } = await supabase
    .from('cliente')
    .update({ fotodecliente: filePath })
    .eq('idcliente', idcliente);

  if (dbError) throw new Error('Error al actualizar la tabla cliente.');

  return filePath;
};

const getClienteById = async (idcliente) => {
  const { data, error } = await supabase
    .from('cliente')
    .select('*')
    .eq('idcliente', idcliente)
    .single();

  if (error) throw error;

  if (data.fotodecliente) {
    const { data: publicUrl } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(data.fotodecliente);

    data.fotoUrl = publicUrl.publicUrl;
  }

  return data;
};

module.exports = {
  fetchClientes,
  fetchClientePorId,
  insertarCliente,
  modificarCliente,
  uploadClientImageToStorage,
  getClienteById
};
