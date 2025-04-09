const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const { Op } = require('sequelize');

// POST /api/events → create event
router.post('/', async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/events → with optional filters
router.get('/', async (req, res) => {
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
