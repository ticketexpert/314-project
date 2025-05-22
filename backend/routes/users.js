const express = require('express');
const router = express.Router();
const { User, UserNotifications, Organisation } = require('../models');
const Event = require('../models/event');
const { Op } = require('sequelize');

// POST /api/users → create user
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    // Create default notification settings for the new user
    await UserNotifications.create({
      userId: user.userId
    });
    console.log("User and notification settings created successfully");
    res.status(201).json(user);
  } catch (err) {
    console.error('Error creating user:', err);
    if (err.message === 'Validation error'){
      res.status(401).json({ 'error': 'User already exists'});
    } else {
      res.status(400).json({ error: err.message });
    }
  }
});

//GET /api/users
router.get('/', async (req, res) => {
  try {
      const users = await User.findAll();
      return res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//GET /api/users/role/:searchRole
router.get('/role/:searchRole', async (req, res) => {
  try {
    const { searchRole } = req.params;
    const users = await User.findAll({ where: { role: searchRole } });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Email and Password method
//Auth url
router.get('/auth', async (req, res) => {
  try {
    const { email, password } = req.query;

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
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const userResponse = {
      userId: user.userId,
      email: user.email,
      role: user.role,
      eventOrgId: user.eventOrgId,
      events: user.events
    };

    res.status(200).json(userResponse);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
});

//GET /api/users/:userId
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//GET /api/users/:eventOrgId
router.get('/:eventOrgId', async (req, res) => {
  try {
    const { eventOrgId } = req.params;
    const users = await User.findAll({ where: { eventOrgId } });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Add event to user
router.post('/addEvent', async (req, res) => {
  try {
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
    if (!user.events) {
      user.events = [];
    }

    if (user.events.includes(parseInt(eventId))) {
      return res.status(400).json({ error: 'Event already in user\'s events' });
    }
    user.events = [...user.events, parseInt(eventId)];
    
    await user.save();

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

// PATCH /api/users/:userId
router.patch('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { eventOrgId, ...updateData } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (eventOrgId) {
      const organization = await Organisation.findByPk(eventOrgId);
      if (!organization) {
        return res.status(404).json({ error: 'Organization not found' });
      }
      updateData.eventOrgId = eventOrgId;

      const currentUsers = organization.users || [];
      if (!currentUsers.includes(parseInt(userId))) {
        await organization.update({
          users: [...currentUsers, parseInt(userId)]
        });
      }
    }
    await user.update(updateData);
    const updatedUser = await User.findByPk(userId);
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 