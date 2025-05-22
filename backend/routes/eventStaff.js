const express = require('express');
const router = express.Router();
const { EventStaff } = require('../models');

// POST /api/eventStaff → create new staff member
router.post('/', async (req, res) => {
  try {
    const { name, role, username, password } = req.body;
    const staff = await EventStaff.create({
      name,
      role,
      username,
      password // Note: In a production environment, you should hash the password
    });
    res.status(200).json(staff);
  } catch (error) {
    console.error('Error creating staff member:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 