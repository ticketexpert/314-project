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

router.get('/smallEvents', async (req, res) => {
  try {
    const events = await Event.findAll({
      attributes: ['eventId', 'title', 'region', 'venue', 'fromDateTime', 'toDateTime']
    });
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

// PATCH numTicketsAvailable


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

// PATCH /api/events/:eventId/tickets/:type
router.patch('/:eventId/tickets/:type', async (req, res) => {
  try {
    const { eventId, type } = req.params;
    const { quantity } = req.body;

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Find the ticket type in the pricing array
    const ticketIndex = event.pricing.findIndex(ticket => ticket.type === type);
    if (ticketIndex === -1) {
      return res.status(404).json({ error: 'Ticket type not found' });
    }

    // Create a new pricing array with the updated values
    const updatedPricing = [...event.pricing];
    updatedPricing[ticketIndex] = {
      ...updatedPricing[ticketIndex],
      numTicketsAvailable: updatedPricing[ticketIndex].numTicketsAvailable - quantity
    };

    // Update the event with the new pricing array
    await event.update({ pricing: updatedPricing });

    // Fetch the updated event to return
    const updatedEvent = await Event.findByPk(eventId);
    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
