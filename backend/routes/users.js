const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { Op } = require('sequelize');

// POST /api/users → create user
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    console.log("This worked");
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/users → with optional filters
router.get('/', async (req, res) => {
  try {
    const { username, email, firstName, lastName } = req.query;

    const where = {};

    if (username) where.username = { [Op.iLike]: `%${username}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (firstName) where.firstName = { [Op.iLike]: `%${firstName}%` };
    if (lastName) where.lastName = { [Op.iLike]: `%${lastName}%` };

    const users = await User.findAll({ where });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 