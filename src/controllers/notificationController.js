const { createNotification, getUserNotifications, markAsRead} = require('../services/notificationService');

const sendNotification = async (req, res) => {
    const { userId, title, message } = req.body;
    try {
        const data = await createNotification(userId, title, message);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getNotifications = async (req, res) => {
    const userId = req.params.userId;
    try {
        const data = await getUserNotifications(userId);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const setNotificationRead = async (req, res) => {
    const { notificationId } = req.params;
    try {
        const data = await markAsRead(notificationId);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { 
    sendNotification, 
    getNotifications, 
    setNotificationRead
};

