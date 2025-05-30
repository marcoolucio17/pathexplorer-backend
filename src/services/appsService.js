const supabase = require('../config/supabaseClient');

// Obtener todas las aplicaciones de un proyecto
const fetchAppsByProjectId = async (projectId) => {
    // Primero obtenemos los roles asociados al proyecto
    const { data: roles, error: rolesError } = await supabase
        .from('proyecto_roles')
        .select('idrol')
        .eq('idproyecto', projectId);

    if (rolesError) throw new Error(rolesError.message);
    const roleIds = roles.map(r => r.idrol);

    if (roleIds.length === 0) return [];

    // Luego obtenemos las aplicaciones asociadas a esos roles
    const { data: apps, error: appsError } = await supabase
        .from('aplicacion')
        .select(`
            idaplicacion,
            idusuario,
            idrol,
            estatus,
            fechaaplicacion,
            message,
            usuario(nombre, correoelectronico),
            roles(nombrerol)
        `)
        .in('idrol', roleIds);

    if (appsError) throw new Error(appsError.message);

    return apps;
};

// Obtener todas las aplicaciones de un usuario
const fetchAppsByUserId = async (userId) => {
  // Paso 1: obtén todas las aplicaciones del usuario con los datos del rol
  const { data: apps, error } = await supabase
    .from('aplicacion')
    .select(`
      idaplicacion,
      estatus,
      fechaaplicacion,
      message,
      idrol,
      roles (
        idrol,
        nombrerol
      )
    `)
    .eq('idusuario', userId);

  if (error) {
    console.error('Error al obtener aplicaciones:', error);
    throw new Error('Error al obtener las aplicaciones del usuario.');
  }

  // Paso 2: por cada aplicación, busca el proyecto relacionado al rol
  const aplicacionesConProyecto = await Promise.all(apps.map(async (app) => {
    const { data: proyectoRol, error: errorPR } = await supabase
      .from('proyecto_roles')
      .select(`
        idproyecto,
        proyecto (
          idproyecto,
          pnombre
        )
      `)
      .eq('idrol', app.idrol)
      .limit(1)
      .single();

    if (errorPR) {
      console.warn('No se encontró proyecto para el rol', app.idrol);
      return { ...app, proyecto: null };
    }

    return {
      ...app,
      proyecto: proyectoRol.proyecto,
    };
  }));

  return aplicacionesConProyecto;
};


// Obtener una aplicación específica de un usuario
const fetchUserAppInProject = async (userId, appId) => {
    const { data, error } = await supabase
        .from('aplicacion')
        .select(`
            idaplicacion,
            idusuario,
            idrol,
            estatus,
            fechaaplicacion,
            message,
            usuario(nombre),
            roles(nombrerol)
        `)
        .eq('idusuario', userId)
        .eq('idaplicacion', appId)
        .single();


    if (error) throw new Error(error.message);

    return data;
};
//URL: http://localhost:8080/api/apps/usuario/1/app/5
// Reemplazar 1 por el ID del usuario y 5 por el ID de la aplicación

const updateAppStatus = async (userId, appId, estatus) => {
    const { data, error } = await supabase
        .from('aplicacion')
        .update({ estatus })
        .eq('idusuario', userId)
        .eq('idaplicacion', appId)
        .select()
        .single();

    if (error) throw new Error(error.message);

    return data;
};

// Crear una nueva aplicación
const createAppService = async ({ idusuario, idrol, message }) => {
  const { data, error } = await supabase
    .from('aplicacion')
    .insert([{ idusuario, idrol, message }])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};



module.exports = {
    fetchAppsByProjectId,
    fetchAppsByUserId,
    fetchUserAppInProject,
    updateAppStatus,
    createAppService
};
