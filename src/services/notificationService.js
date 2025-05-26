const supabase = require('../config/supabaseClient');
const ApiError = require('../utils/errorHelper');

/**
 * Crea una notificación para un usuario
 * @param {int} idusuario - ID del usuario
 * @param {string} titulo - Título de la notificación
 * @param {string} mensaje - Mensaje de la notificación
 * @returns true si la notificación fue creada correctamente
 */
const createNotification = async (idusuario, titulo, mensaje) => {
    const fecha = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const { data, error } = await supabase
        .from('notificaciones')
        .insert([{ idusuario, titulo, mensaje, fecha }]);

    if (error) {
        console.log("error", error);
        throw new ApiError(error.status || 400, error.message || "Error creating notification.");
    }

    return true;
};

/**
 * Obtiene todas las notificaciones de un usuario
 * @param {int} idusuario - ID del usuario
 * @returns Un array con todas las notificaciones ordenadas por fecha descendente
 */
const getUserNotifications = async (idusuario) => {
    const { data, error } = await supabase
        .from('notificaciones')
        .select('idnotificacion, idusuario, titulo, mensaje, fecha')
        .eq('idusuario', idusuario)
        .order('fecha', { ascending: false });

    if (error) {
        console.log("error", error);
        throw new ApiError(error.status || 400, error.message || "Error fetching notifications.");
    }

    return data;
};

/**
 * Elimina una notificación por su ID
 * @param {int} idnotificacion - ID de la notificación a eliminar
 * @returns true si la notificación fue eliminada correctamente
 */
const deleteNotification = async (idnotificacion) => {
    const { data, error } = await supabase
        .from('notificaciones')
        .delete()
        .eq('idnotificacion', idnotificacion);

    if (error) {
        console.log("error", error);
        throw new ApiError(error.status || 400, error.message || "Error deleting notification.");
    }

    return true;
};

module.exports = {
    createNotification,
    getUserNotifications,
    deleteNotification
};
