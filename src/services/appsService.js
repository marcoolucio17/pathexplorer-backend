const supabase = require('../config/supabaseClient');

// Función para obtener las aplicaciones de un proyecto específico
const fetchAplicacionesByProject = async (projectid) => {
  const { data, error } = await supabase
    .from("aplicacion")
    .select("idaplicacion, userid, projectid, status")
    .eq('projectid', projectid);
    
  if (error) throw error;
  return data;
};

// Función para obtener las aplicaciones de un usuario específico
const fetchAplicacionesByUser = async (userid) => {
  const { data, error } = await supabase
    .from("aplicacion")
    .select("idaplicacion, userid, projectid, status")
    .eq('userid', userid);

  if (error) throw error;
  return data;
};

// Función para obtener una aplicación específica de un usuario en un proyecto
const fetchAplicacionByUserAndId = async (userid, aplicacionid) => {
  const { data, error } = await supabase
    .from("aplicacion")
    .select("idaplicacion, userid, projectid, status")
    .eq('userid', userid)
    .eq('idaplicacion', aplicacionid);

  if (error) throw error;
  return data;
};

// Función para actualizar el estado de una aplicación
const fetchUpdateAplicacionStatus = async (userid, projectid, status) => {
  const { data, error } = await supabase
    .from("aplicacion")
    .update({ status })
    .eq('userid', userid)
    .eq('projectid', projectid);

  if (error) throw error;
  return data;
};

// Función para agregar una nueva aplicación a un proyecto
const fetchAddAplicacion = async (projectid, aplicacion) => {
  const { data, error } = await supabase
    .from("aplicacion")
    .insert([{ ...aplicacion, projectid }]);

  if (error) throw error;
  return data;
};

module.exports = { 
  fetchAplicacionesByProject, 
  fetchAplicacionesByUser, 
  fetchAplicacionByUserAndId, 
  fetchUpdateAplicacionStatus, 
  fetchAddAplicacion
};
