const express = require('express');
const router = express.Router();
const Event = require('../models/event');

// POST /api/events → create event
router.post('/', async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
