const supabase = require('../config/supabaseClient');

// Obtener todas las aplicaciones de un proyecto
const fetchAppsByProjectId = async (projectId) => {
    const parsedId = parseInt(projectId);
    if (isNaN(parsedId)) throw new Error("projectId inválido");

    const { data: roles, error: rolesError } = await supabase
        .from('proyecto_roles')
        .select('idrol')
        .eq('idproyecto', parsedId);

    if (rolesError) throw rolesError;

    const roleIds = roles.map(r => r.idrol);

    if (roleIds.length === 0) return [];

    const { data: apps, error: appsError } = await supabase
        .from('aplicacion')
        .select(`
            idaplicacion,
            estatus,
            idusuario,
            idrol,
            usuario(nombre, correoelectronico),
            roles(nombrerol)
        `)
        .in('idrol', roleIds);

    if (appsError) throw appsError;

    return apps;
};


// Obtener todas las aplicaciones de un usuario
const fetchAppsByUserId = async (userId) => {
    const parsedId = parseInt(userId);
    if (isNaN(parsedId)) throw new Error("userId inválido");

    const { data, error } = await supabase
        .from('aplicacion')
        .select(`
            idaplicacion,
            estatus,
            idrol,
            roles(nombrerol),
            usuario(nombre, correoelectronico)
        `)
        .eq('idusuario', parsedId);

    if (error) throw error;
    return data;
};

// Obtener una aplicación específica de un usuario
const getAppByUserAndAppId = async (userId, appId) => {
    const parsedUserId = parseInt(userId);
    const parsedAppId = parseInt(appId);
    if (isNaN(parsedUserId) || isNaN(parsedAppId)) throw new Error("IDs inválidos");

    const { data, error } = await supabase
        .from('aplicacion')
        .select('*')
        .eq('idusuario', parsedUserId)
        .eq('idaplicacion', parsedAppId)
        .single();

    if (error) throw error;
    return data;
};


// Obtener una aplicación específica de un usuario en un proyecto
const fetchUserAppInProject = async (userId, appId) => {
    const { data, error } = await supabase
        .from('aplicacion')
        .select('*')
        .eq('idusuario', userId)
        .eq('idaplicacion', appId)
        .single();
    if (error) throw error;
    return data;
};

// Cambiar el estatus de una aplicación
const updateAppStatus = async (userId, appId, estatus) => {
    const parsedUserId = parseInt(userId);
    const parsedAppId = parseInt(appId);
    if (isNaN(parsedUserId) || isNaN(parsedAppId)) throw new Error("IDs inválidos");

    const { data, error } = await supabase
        .from('aplicacion')
        .update({ estatus })
        .eq('idusuario', parsedUserId)
        .eq('idaplicacion', parsedAppId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

const createRole = async (projectId, nombreRol, nivelRol, descripcionRol, estado) => {
    const parsedProjectId = parseInt(projectId);
    if (isNaN(parsedProjectId)) throw new Error("projectId inválido");

    // Insertar en tabla roles
    const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .insert({ nombrerol: nombreRol, nivelrol: nivelRol, descripcionrol: descripcionRol })
        .select()
        .single();

    if (roleError) throw roleError;

    // Insertar en tabla proyecto_roles
    const { data: linkData, error: linkError } = await supabase
        .from('proyecto_roles')
        .insert({ idproyecto: parsedProjectId, idrol: roleData.idrol, estado })
        .select()
        .single();

    if (linkError) throw linkError;

    return { ...roleData, proyecto_rol: linkData };
};


// Crear nuevo rol y asignarlo a un proyecto
const addRoleToProject = async (projectId, role) => {
    const { data: newRole, error: roleError } = await supabase
        .from('roles')
        .insert([{
            NombreRol: role.NombreRol,
            NivelRol: role.NivelRol,
            DescripcionRol: role.DescripcionRol
        }])
        .select()
        .single();

    if (roleError) throw roleError;

    const { data: projectRole, error: projRoleError } = await supabase
        .from('Proyecto_Roles')
        .insert([{
            IDProyecto: projectId,
            IDRol: newRole.IDRol,
            Estado: role.Estado || 'Abierto'
        }]);
    if (projRoleError) throw projRoleError;

    return projectRole;
};

module.exports = {
    fetchAppsByProjectId,
    fetchAppsByUserId,
    fetchUserAppInProject,
    updateAppStatus,
    addRoleToProject,
    getAppByUserAndAppId,
    createRole
};