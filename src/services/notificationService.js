const supabase = require('../config/supabaseClient');

const createNotification = async (idusuario, titulo, mensaje) => {
    const fecha = new Date().toISOString().split('T')[0]; // formato YYYY-MM-DD
    const { data, error } = await supabase
        .from('notificaciones')
        .insert([{ idusuario, titulo, mensaje, fecha }]);

    if (error) throw error;
    return data;
};

const getUserNotifications = async (idusuario) => {
    const { data, error } = await supabase
        .from('notificaciones')
        .select('*')
        .eq('idusuario', idusuario)
        .order('fecha', { ascending: false });

    if (error) throw error;
    return data;
};

const deleteNotification = async (idnotificacion) => {
    const { data, error } = await supabase
        .from('notificaciones')
        .delete()
        .eq('idnotificacion', idnotificacion);

    if (error) throw error;
    return data;
};

module.exports = {
    createNotification,
    getUserNotifications,
    deleteNotification
};
