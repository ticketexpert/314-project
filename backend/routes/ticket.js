const express = require('express');
const router = express.Router();
const { Ticket, Event, User } = require('../models');

// POST /api/tickets → create ticket
router.post('/', async (req, res) => {
  try {
    console.log('Creating ticket with data:', req.body);
    const ticket = await Ticket.create(req.body);
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

module.exports = router;