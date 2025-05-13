const express = require('express');
const router = express.Router();
const { UserNotifications } = require('../models');

// POST /api/userNotifcation → create user notification
router.post('/', async (req, res) => {
    try {
        const { userId, bookingConf, eventReminder, eventUpdates, specialAnnouncements, currentNotifs } = req.body;
        const userNotification = await UserNotifications.create({ userId, bookingConf, eventReminder, eventUpdates, specialAnnouncements, currentNotifs });
        res.json(userNotification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/userNotifcation → get user notification
router.get('/', async (req, res) => {
    try {
        const userNotification = await UserNotifications.findAll();
        res.json(userNotification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/userNotifcation/:userId → get user notification by userId
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const userNotification = await UserNotifications.findOne({ where: { userId } });
        res.json(userNotification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/userNotifcation/:userId → update user notification by userId
router.put('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { bookingConf, eventReminder, eventUpdates, specialAnnouncements, currentNotifs } = req.body;
        const userNotification = await UserNotifications.update({ bookingConf, eventReminder, eventUpdates, specialAnnouncements, currentNotifs }, { where: { userId } });
        res.json(userNotification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;