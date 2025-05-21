const { createNotification, getUserNotifications, deleteNotification } = require('../services/notificationService');

const sendNotification = async (req, res) => {
    const { idusuario, titulo, mensaje } = req.body;
    try {
        const data = await createNotification(idusuario, titulo, mensaje);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getNotifications = async (req, res) => {
    const idusuario = req.params.idusuario;
    try {
        const data = await getUserNotifications(idusuario);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const removeNotification = async (req, res) => {
    const { idnotificacion } = req.params;
    try {
        const data = await deleteNotification(idnotificacion);
        res.status(200).json({ message: 'Notificación eliminada', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    sendNotification,
    getNotifications,
    removeNotification
};

