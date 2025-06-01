const supabase = require('../config/supabaseClient');
const { generateProfileSignedUrl } = require('../services/userService');

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

const obtenerAplicacionesPorCreador = async (idusuario) => {
  // Paso 1: Obtener todos los proyectos creados por ese usuario
  const { data: proyectos, error: errorProyectos } = await supabase
    .from('proyecto')
    .select('idproyecto, pnombre')
    .eq('idusuario', idusuario);

  if (errorProyectos) throw errorProyectos;

  const idsProyectos = proyectos.map(p => p.idproyecto);
  if (idsProyectos.length === 0) return [];

  // Paso 2: Obtener todos los roles de esos proyectos
  const { data: roles, error: errorRoles } = await supabase
    .from('proyecto_roles')
    .select('idrol, idproyecto')
    .in('idproyecto', idsProyectos);

  if (errorRoles) throw errorRoles;

  const rolProyectoMap = {};
  roles.forEach(r => {
    rolProyectoMap[r.idrol] = r.idproyecto;
  });

  const idsRoles = roles.map(r => r.idrol);
  if (idsRoles.length === 0) return [];

  // Paso 3: Obtener las aplicaciones a esos roles
  const { data: aplicaciones, error: errorApps } = await supabase
    .from('aplicacion')
    .select(`
      idaplicacion,
      estatus,
      fechaaplicacion,
      message,
      idrol,
      idusuario,
      usuario (
        idusuario,
        nombre,
        correoelectronico,
        fotodeperfil
      ),
      roles (
        idrol,
        nombrerol,
        descripcionrol
      )
    `)
    .in('idrol', idsRoles);

  if (errorApps) throw errorApps;

  const proyectoMap = Object.fromEntries(proyectos.map(p => [p.idproyecto, p.pnombre]));

  // Paso 4: Agregar nombre del proyecto y foto de perfil firmada
  const aplicacionesEnriquecidas = await Promise.all(
    aplicaciones.map(async (app) => {
      const idproyecto = rolProyectoMap[app.idrol];
      const nombreproyecto = proyectoMap[idproyecto] || null;

      let fotodeperfil_url = null;
      if (app.usuario?.fotodeperfil) {
        const result = await generateProfileSignedUrl(app.usuario.idusuario);
        fotodeperfil_url = result?.url || null;
      }

      return {
        ...app,
        idproyecto,
        nombreproyecto,
        usuario: {
          ...app.usuario,
          fotodeperfil_url
        }
      };
    })
  );

  return aplicacionesEnriquecidas;
};

const asignarAplicacion = async (idAplicacion) => {
    // 1. Obtener la aplicación
  const { data: aplicacion, error: errorApp } = await supabase
    .from('aplicacion')
    .select('idusuario, idrol')
    .eq('idaplicacion', idAplicacion)
    .single();

  if (errorApp || !aplicacion) {
    throw new Error('Aplicación no encontrada');
  }

  const { idusuario, idrol } = aplicacion;

  // 2. Obtener el ID del proyecto desde proyecto_roles
  const { data: roles, error: errorRol } = await supabase
    .from('proyecto_roles')
    .select('idproyecto')
    .eq('idrol', idrol);

  if (errorRol) {
    console.error("Error al consultar proyecto_roles:", errorRol.message);
    throw errorRol;
  }

  if (!roles || roles.length === 0) {
    throw new Error(`No se encontró proyecto_roles con idrol = ${idrol}`);
  }

  const idproyecto = roles[0].idproyecto;

  // 3. Crear el UTP
  const { data: utp, error: errorUTP } = await supabase
    .from('utp')
    .insert({
      idusuario,
      idproyecto,
      idaplicacion: idAplicacion,
      estado: 'Activo'
    })
    .select()
    .single();

  if (errorUTP) throw errorUTP;

  // 4. Marcar al usuario como en proyecto
  const { error: errorUser } = await supabase
    .from('usuario')
    .update({ estaenproyecto: true })
    .eq('idusuario', idusuario);

  if (errorUser) throw errorUser;

  // 5. Actualizar estatus de la aplicación a 'RolAsignado'
  const { error: errorUpdateApp } = await supabase
    .from('aplicacion')
    .update({ estatus: 'RolAsignado' })
    .eq('idaplicacion', idAplicacion);

  if (errorUpdateApp) throw errorUpdateApp;

  // 6. Actualizar estado del proyecto_roles a 'Aceptado'
  const { error: errorUpdateRol } = await supabase
    .from('proyecto_roles')
    .update({ estado: 'Aceptado' })
    .eq('idrol', idrol)
    .eq('idproyecto', idproyecto);

  if (errorUpdateRol) throw errorUpdateRol;

  // 7. Marcar el rol como no disponible
  const { error: errorRolDisponibilidad } = await supabase
    .from('roles')
    .update({ disponible: false })
    .eq('idrol', idrol);

  if (errorRolDisponibilidad) throw errorRolDisponibilidad;

  return { utp, idusuario, idproyecto };
};

module.exports = {
    fetchAppsByProjectId,
    fetchAppsByUserId,
    fetchUserAppInProject,
    updateAppStatus,
    createAppService,
    obtenerAplicacionesPorCreador,
    asignarAplicacion //asignar puesto a empleado
};
