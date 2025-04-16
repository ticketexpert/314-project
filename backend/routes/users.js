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
    if (err.message === 'Validation error'){
      res.status(401).json({ 'error': 'User already exists'});
    } else {
      res.status(400).json({ error: err.message });
    }
  }
});

// GET /api/users → with optional filters
router.get('/', async (req, res) => {
  try {
    const { name, email, userId} = req.query;

    const where = {};

    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (userId) where.userId = { [Op.iLike]: `%${userId}%` };

    const users = await User.findAll({ where });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 