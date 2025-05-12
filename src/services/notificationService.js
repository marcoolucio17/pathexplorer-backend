const supabase = require('../config/supabaseClient');

const createNotification = async (userId, title, message) => {
    const { data, error } = await supabase
        .from('notifications')
        .insert([{ user_id: userId, title, message }]);

    if (error) throw error;
    return data;
};

const getUserNotifications = async (userId) => {
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

const markAsRead = async (notificationId) => {
    const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

    if (error) throw error;
    return data;
};

module.exports = {
    createNotification,
    getUserNotifications,
    markAsRead
};