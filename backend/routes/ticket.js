const express = require('express');
const router = express.Router();
const { Ticket, Event, User } = require('../models');
const axios = require('axios');

// POST /api/tickets → create ticket
router.post('/', async (req, res) => {
  try {
    console.log('Creating ticket with data:', req.body);
    const ticket = await Ticket.create(req.body);
    console.log('Ticket created:', ticket);
    const eventId = req.body.eventId;
    const type = req.body.ticketType;

    try {
      await axios.patch(`https://www.api.ticketexpert.me/api/events/${eventId}/tickets/${type}`, {
        quantity: 1
      });
    } catch (patchError) {
      console.error('Error updating event ticket quantity:', patchError);
      // TODO, if error stop creating?
    }

    res.status(201).json(ticket);
  } catch (err) {
    console.error('Error creating ticket:', err);
    res.status(400).json({ error: err.message });
  }
});

// GET /api/tickets → get all tickets
router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.findAll();
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/tickets/event/:eventId → get tickets by eventId
router.get('/event/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const tickets = await Ticket.findAll({ where: { eventId } });
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/tickets/user/:userId → get tickets by userId
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const tickets = await Ticket.findAll({ where: { userId } });
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/tickets/order/:orderNumber → get ticket by orderNumber
router.get('/order/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const ticket = await Ticket.findOne({ where: { orderNumber } });
    res.status(200).json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/tickets/:eventId/:userId → get ticket by eventId and userId
router.get('/:eventId/:userId', async (req, res) => {
  try {
    const { eventId, userId } = req.params;
    const ticket = await Ticket.findOne({ where: { eventId, userId } });
    res.status(200).json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/tickets/:ticketId → get ticket by ticketId
router.get('/:ticketId', async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findOne({ where: { ticketId } });
    res.status(200).json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/tickets/:ticketId/status → update ticket status
router.patch('/:ticketId/status', async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { userId, status } = req.body;

    if (!userId || !status) {
      return res.status(400).json({ error: 'userId and status are required' });
    }

    const ticket = await Ticket.findOne({ 
      where: { 
        ticketId,
        userId 
      }
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found or user does not have permission' });
    }

    await ticket.update({ ticketStatus: status });
    res.status(200).json(ticket);
  } catch (err) {
    console.error('Error updating ticket status:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;