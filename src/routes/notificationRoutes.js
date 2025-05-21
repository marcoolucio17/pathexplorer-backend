const express = require('express');
const { sendNotification, getNotifications, setNotificationRead } = require('../controllers/notificationController');

const router = express.Router();

router.post("/send", sendNotification);
router.get("/:idusuario", getNotifications);
router.delete("/:idnotificacion", removeNotification);

module.exports = router;