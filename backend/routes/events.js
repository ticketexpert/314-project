const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const { Op } = require('sequelize');

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create event
router.post('/', async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update event
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (event) {
      await event.update(req.body);
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (event) {
      await event.destroy();
      res.json({ message: 'Event deleted' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/events → with optional filters
router.get('/filter', async (req, res) => {
    try {
      const { type, date, priceMin, priceMax, location, title } = req.query;
  
      const where = {};
  
      if (type) where.type = type;
      if (location) where.location = location;
      if (title) where.title = { [Op.iLike]: `%${title}%` };
      if (date) where.date = date;
      if (priceMin || priceMax) {
        where.price = {};
        if (priceMin) where.price[Op.gte] = parseFloat(priceMin);
        if (priceMax) where.price[Op.lte] = parseFloat(priceMax);
      }
  
      const events = await Event.findAll({ where });
      res.json(events);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });  

module.exports = router;
