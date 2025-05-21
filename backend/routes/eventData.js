const express = require('express');
const router = express.Router();
const eventData = require('../models/eventData');

router.get('/', async (req, res) => {
  try {
    const eventData = await eventData.findAll();
    res.json(eventData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const eventData = await eventData.findByPk(req.params.id);
    res.json(eventData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const eventData = await eventData.create(req.body);
    res.status(201).json(eventData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


module.exports = router;