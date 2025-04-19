const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/event');
const { Op } = require('sequelize');

// POST /api/users → create user
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    console.log("This worked");
    res.status(201).json(user);
  } catch (err) {
    if (err.message === 'Validation error'){
      res.status(401).json({ 'error': 'User already exists'});
    } else {
      res.status(400).json({ error: err.message });
    }
  }
});

//GET /api/users
// UserID meth
router.get('/', async (req, res) => {
  try {
    const {userId} = req.query;

    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({ error: 'userId parameter is required' });
    }

    // Convert userId to integer and find exact match
    const where = { userId: parseInt(userId) };

    const users = await User.findAll({ where });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Email and Password meth
//Auth url
router.get('/auth', async (req, res) => {
  try {
    const { email, password } = req.query;

    // Check if both email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: 'Both email and password are required' });
    }

    const user = await User.findOne({
      where: {
        email: email,
        password: password
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found or invalid credentials' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Add event to user
router.post('/addEvent', async (req, res) => {
  try {
    // Try to get userId and eventId from either query params or request body
    const userId = req.query.userId || req.body.userId;
    const eventId = req.query.eventId || req.body.eventId;

    if (!userId) {
      return res.status(400).json({ error: 'userId parameter is required' });
    }

    if (!eventId) {
      return res.status(400).json({ error: 'eventId parameter is required' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    } 

    // Initialize events array if it's null
    if (!user.events) {
      user.events = [];
    }

    // Check if eventId exists in user
    if (user.events.includes(parseInt(eventId))) {
      return res.status(400).json({ error: 'Event already in user\'s events' });
    }

    // Add eventId to user's events array
    user.events = [...user.events, parseInt(eventId)];
    
    // Save the user with the updated events array
    await user.save();

    // Fetch the updated user to verify the changes
    const updatedUser = await User.findByPk(userId);
    
    res.status(200).json({ 
      message: 'Event added to user\'s events', 
      events: updatedUser.events 
    });
  } catch (err) {
    console.error('Error adding event:', err);
    res.status(500).json({ error: err.message });
  }
});

//Get events for user
router.get('/events', async (req, res) => {
  try {
    const { userId } = req.query; 

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const events = await Event.findAll({
      where: {
        eventId: {
          [Op.in]: user.events
        }
      }
    });

    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router; 