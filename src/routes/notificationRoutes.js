import express from "express";

const { sendNotification, getNotifications, setNotificationRead } = require('../controllers/notificationController');

const router = express.Router();

router.post("/send", sendNotification);
router.get("/:userId", getNotifications);
router.put("/read/:notificationId", setNotificationRead);

export default router;