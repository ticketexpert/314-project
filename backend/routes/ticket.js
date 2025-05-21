const express = require('express');
const router = express.Router();
const { Ticket, Event, User } = require('../models');
const EventDataModel = require('../models/eventData');
const { Op, literal } = require('sequelize');
const axios = require('axios');

// POST /api/tickets → create ticket
router.post('/', async (req, res) => {
  try {
    //console.log('Creating ticket with data:', req.body);
    const ticket = await Ticket.create(req.body);
    //console.log('Ticket created:', ticket);
    const eventId = req.body.eventId;
    const type = req.body.ticketType;
    let eventName = "";

    try {
      const response = await axios.get(`https://www.api.ticketexpert.me/api/events/${eventId}`, {});
      eventName = response.data.title;
    } catch (getError) {
      console.error('Error getting event:', getError);
    }

    try {
      //Working the whole time, I was just pinging an old version of the backend, points at production backend
      await axios.patch(`https://www.api.ticketexpert.me/api/events/${eventId}/tickets/${type}`, {
        "quantity": 1
      });
    } catch (patchError) {
      console.error('Error updating event ticket quantity:', patchError);
      console.log('ERROR: Parmas are: ' + eventId + ' ' + type + ' ' + req.body.quantity);
      // TODO, if error stop creating?
    }

    let ticketCost = 0;
    try {
      const response = await axios.get(`https://www.api.ticketexpert.me/api/events/${eventId}`, {});
      ticketCost = response.data.pricing.find(p => p.type === type).price;
    } catch (getError) {
      console.error('Error getting event:', getError);
    }

    //Needed that COALESCE to work, seemed to be an issue with the decimals
    try {
      await EventDataModel.update({
        ticketsSold: literal('"ticketsSold" + 1'),
        ticketsAvailable: literal('"ticketsAvailable" - 1'),
        gross: literal(`COALESCE(gross, 0) + ${parseFloat(ticketCost)}`)
      }, {
        where: {
          eventId: eventId
        }
      });
    } catch (updateError) {
      console.error('Error updating event data:', updateError);
    }

    try {
      await axios.put(`https://www.api.ticketexpert.me/api/userNotification/${req.body.userId}`, {
        "currentNotifs": {"title": "Ticket Booked!", "message": "Your ticket to " + eventName + " awaits!"}
      });
    } catch (postError) {
      console.error('Error posting user notification:', postError);
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