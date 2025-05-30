const supabase = require('../config/supabaseClient');
const { v4: uuidv4 } = require('uuid');

const bucket = 'fotos-clientes';

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
    .maybeSingle(); // Devuelve null si no hay coincidencia

  if (error) throw error;
  return data; // puede ser null si no se encontró
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

// Sube imagen y guarda el nombre del archivo
const uploadClienteFoto = async (idcliente, file) => {
  const ext = file.originalname.split('.').pop();
  const filename = `${uuidv4()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('fotos-clientes')
    .upload(filename, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (uploadError) throw new Error('Error al subir el archivo al bucket.');

  const { error: updateError } = await supabase
    .from('cliente')
    .update({ fotodecliente: filename })
    .eq('idcliente', idcliente);

  if (updateError) throw new Error('Error al actualizar la ruta de la imagen.');

  return filename;
};

// Devuelve el cliente con la URL pública de la imagen
const getClienteFotoUrl = async (idcliente) => {
  const { data: cliente, error } = await supabase
    .from('cliente')
    .select('*')
    .eq('idcliente', idcliente)
    .single();

  if (error) throw new Error('Error al obtener el cliente.');

  if (!cliente.fotodecliente) return cliente;

  // Generar URL firmada por 1 hora (3600 segundos)
  const { data: signedUrlData, error: signedUrlError } = await supabase
    .storage
    .from('fotos-clientes')
    .createSignedUrl(cliente.fotodecliente, 3600);

  if (signedUrlError) {
    console.error('Error al generar URL firmada:', signedUrlError.message);
    throw new Error('No se pudo generar la URL de la imagen.');
  }

  return {
    ...cliente,
    fotodecliente_url: signedUrlData.signedUrl,
  };
};

module.exports = {
  fetchClientes,
  fetchClientePorId,
  insertarCliente,
  modificarCliente,
  uploadClienteFoto,
  getClienteFotoUrl
};
