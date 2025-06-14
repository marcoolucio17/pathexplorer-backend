const supabase = require('../config/supabaseClient');
const { generateProfileSignedUrl } = require('../services/userService');
const { fetchAllUserSkills } = require("../services/projectService");
const { fetchCompatibility } = require("./compabilityService");

// Obtener todas las aplicaciones de un proyecto
const fetchAppsByProjectId = async (projectId) => {
  // Primero obtenemos los roles asociados al proyecto
  const { data: roles, error: rolesError } = await supabase
    .from("proyecto_roles")
    .select("idrol")
    .eq("idproyecto", projectId);

  if (rolesError) throw new Error(rolesError.message);
  const roleIds = roles.map((r) => r.idrol);

  if (roleIds.length === 0) return [];

  // Luego obtenemos las aplicaciones asociadas a esos roles
  const { data: apps, error: appsError } = await supabase
    .from("aplicacion")
    .select(
      `
            idaplicacion,
            idusuario,
            idrol,
            estatus,
            fechaaplicacion,
            message,
            usuario(nombre, correoelectronico),
            roles(nombrerol)
        `
    )
    .in("idrol", roleIds);

  if (appsError) throw new Error(appsError.message);

  return apps;
};

// Obtener todas las aplicaciones de un usuario
const fetchAppsByUserId = async (userId) => {
  const { data: apps, error } = await supabase
    .from("aplicacion")
    .select(
      `
      idaplicacion,
      estatus,
      fechaaplicacion,
      message,
      idrol,
      roles (
        idrol,
        nombrerol,
        requerimientos_roles (
          requerimientos (
            habilidades(idhabilidad)
          )
        )
      )    `
    )
    .eq("idusuario", userId);

  if (error) {
    console.error("Error al obtener aplicaciones:", error);
    throw new Error("Error al obtener las aplicaciones del usuario.");
  }

  const userResult = await fetchAllUserSkills(userId);

  const userSkills = new Set(
    userResult.flatMap((habilidad) => habilidad.idhabilidad)
  );
  const rolesSkills = {};
  apps.forEach((app) => {
    const idRol = app.roles.idrol;
    const skills = app.roles.requerimientos_roles.flatMap(
      (req) => req.requerimientos.habilidades.idhabilidad
    );
    rolesSkills[idRol] = skills;
  });

  let compability;

  const aplicacionesConProyecto = await Promise.all(
    apps.map(async (app) => {
      const { data: proyectoRol, error: errorPR } = await supabase
        .from("proyecto_roles")
        .select(
          `
        idproyecto,
        proyecto (
          idproyecto,
          pnombre,
          fechainicio,
          fechafin,
          cliente (
            idcliente,
            clnombre,
            fotodecliente
          )
        )`
        )
        .eq("idrol", app.idrol)
        .limit(1)
        .single();
      compability = fetchCompatibility(rolesSkills[app.idrol], userSkills);

      const { data: signedUrlData, error: signedUrlError } =
        await supabase.storage
          .from("fotos-clientes")
          .createSignedUrl(proyectoRol.proyecto.cliente.fotodecliente, 3600);

      if (errorPR || signedUrlError) {
        console.warn("No se encontró proyecto para el rol", app.idrol);
        return { ...app, proyecto: null };
      }
      const getDuracionEnMeses = (inicio, fin) => {
        const anios = fin.getFullYear() - inicio.getFullYear();
        const meses = fin.getMonth() - inicio.getMonth();
        const totalMeses = anios * 12 + meses;

        // Ajustar si el día de fin es menor que el de inicio
        if (fin.getDate() < inicio.getDate()) {
          return totalMeses - 1;
        }
        return totalMeses;
      };
      const fechaInicio = new Date(proyectoRol.proyecto.fechainicio);
      const fechaFin = new Date(proyectoRol.proyecto.fechafin);
      const duracionMes = getDuracionEnMeses(fechaInicio, fechaFin);
      return {
        ...app,
        idaplicacion: app.idaplicacion,
        estatus: app.estatus,
        fechaaplicacion: app.fechaaplicacion,
        message: app.message,
        idrol: app.idrol,
        roles: {
          idrol: app.roles.idrol,
          nombrerol: app.roles.nombrerol,
        },
        nombrerol: app.roles.nombrerol,
        compability: compability,
        fotodecliente_url: signedUrlData.signedUrl,
        duracionMes: duracionMes,
        proyecto: {
          idproyecto: proyectoRol.proyecto.idproyecto,
          nombre: proyectoRol.proyecto.pnombre,
          cliente: {
            idcliente: proyectoRol.proyecto.cliente.idcliente,
            nombre: proyectoRol.proyecto.cliente.clnombre,
          },
        },
      };
    })
  );

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
  const currentDate = new Date().toISOString().split('T')[0]; // formato YYYY-MM-DD

  const { data, error } = await supabase
    .from('aplicacion')
    .update({ 
      estatus, 
      fechaaplicacion: currentDate 
    })
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

  // 2. Verificar si el usuario ya tiene una UTP activa
  const { data: utpExistente, error: errorCheckUTP } = await supabase
    .from('utp')
    .select('idutp')
    .eq('idusuario', idusuario)
    .eq('estado', 'Activo')
    .maybeSingle();

  if (errorCheckUTP) throw errorCheckUTP;
  if (utpExistente) {
    throw new Error('El usuario ya tiene una UTP activa');
  }

  // 3. Obtener ID del proyecto desde proyecto_roles
  const { data: roles, error: errorRol } = await supabase
    .from('proyecto_roles')
    .select('idproyecto')
    .eq('idrol', idrol);

  if (errorRol) throw errorRol;
  if (!roles || roles.length === 0) {
    throw new Error(`No se encontró proyecto_roles con idrol = ${idrol}`);
  }

  const idproyecto = roles[0].idproyecto;

  // 4. Obtener fechas del proyecto
  const { data: proyecto, error: errorProyecto } = await supabase
    .from('proyecto')
    .select('fechainicio, fechafin')
    .eq('idproyecto', idproyecto)
    .single();

  if (errorProyecto || !proyecto) {
    throw new Error('Proyecto no encontrado');
  }

  // 5. Crear el UTP con fechas
  const { data: utp, error: errorUTP } = await supabase
    .from('utp')
    .insert({
      idusuario,
      idproyecto,
      idaplicacion: idAplicacion,
      estado: 'Activo',
      fechainicio: proyecto.fechainicio,
      fechafin: proyecto.fechafin
    })
    .select()
    .single();

  if (errorUTP) throw errorUTP;

  // 6. Marcar al usuario como en proyecto
  const { error: errorUser } = await supabase
    .from('usuario')
    .update({ estaenproyecto: true })
    .eq('idusuario', idusuario);

  if (errorUser) throw errorUser;

  // 7. Actualizar estatus de la aplicación a 'RolAsignado'
  const { error: errorUpdateApp } = await supabase
    .from('aplicacion')
    .update({
      estatus: 'RolAsignado',
      fechaaplicacion: new Date().toISOString()
    })
    .eq('idaplicacion', idAplicacion);

  if (errorUpdateApp) throw errorUpdateApp;

  // 8. Actualizar estado del proyecto_roles a 'Aceptado'
  const { error: errorUpdateRol } = await supabase
    .from('proyecto_roles')
    .update({ estado: 'Aceptado' })
    .eq('idrol', idrol)
    .eq('idproyecto', idproyecto);

  if (errorUpdateRol) throw errorUpdateRol;

  // 9. Marcar el rol como no disponible
  const { error: errorRolDisponibilidad } = await supabase
    .from('roles')
    .update({ disponible: false })
    .eq('idrol', idrol);

  if (errorRolDisponibilidad) throw errorRolDisponibilidad;

  return { utp, idusuario, idproyecto };
};

const obtenerAplicacionesPorEstatus = async (estatus) => {
  const { data: aplicaciones, error } = await supabase
    .from('aplicacion')
    .select(`
      *,
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
    .eq('estatus', estatus);

  if (error) throw new Error(error.message);

  // Obtener proyecto y cliente usando los roles → proyecto_roles → proyecto
  const rolesIds = aplicaciones.map(a => a.idrol);

  const { data: rolesProyecto, error: errorRoles } = await supabase
    .from('proyecto_roles')
    .select(`idrol, idproyecto, proyecto (idproyecto, pnombre, idcliente, cliente (clnombre, fotodecliente))`)
    .in('idrol', rolesIds);

  if (errorRoles) throw new Error(errorRoles.message);

  const rolProyectoMap = Object.fromEntries(
    rolesProyecto.map(rp => [rp.idrol, rp])
  );

  const aplicacionesEnriquecidas = await Promise.all(aplicaciones.map(async (app) => {
    const rolInfo = rolProyectoMap[app.idrol];
    const proyecto = rolInfo?.proyecto || {};

    let fotodeperfil_url = null;
    if (app.usuario?.fotodeperfil) {
      const result = await generateProfileSignedUrl(app.usuario.idusuario);
      fotodeperfil_url = result?.url || null;
    }

    let fotodecliente_url = null;
    if (proyecto?.cliente?.fotodecliente) {
      const { data: signedUrl } = await supabase.storage
        .from('clientes')
        .createSignedUrl(proyecto.cliente.fotodecliente, 300);
      fotodecliente_url = signedUrl?.signedUrl || null;
    }

    return {
      ...app,
      proyecto: {
        idproyecto: proyecto.idproyecto,
        nombre: proyecto.pnombre,
        cliente: {
          ...proyecto.cliente,
          fotodecliente_url
        }
      },
      usuario: {
        ...app.usuario,
        fotodeperfil_url
      }
    };
  }));

  return aplicacionesEnriquecidas;
};


module.exports = {
    fetchAppsByProjectId,
    fetchAppsByUserId,
    fetchUserAppInProject,
    updateAppStatus,
    createAppService,
    obtenerAplicacionesPorCreador,
    asignarAplicacion, //asignar puesto a empleado
    obtenerAplicacionesPorEstatus
};
