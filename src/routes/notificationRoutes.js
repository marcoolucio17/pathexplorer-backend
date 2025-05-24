const express = require('express');
const { sendNotification, getNotifications, setNotificationRead, removeNotification } = require('../controllers/notificationController');

const router = express.Router();

router.post("/send", sendNotification);
router.get("/:idusuario", getNotifications);
router.delete("/:idnotificacion", removeNotification);

module.exports = router;