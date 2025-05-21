const express = require('express');
const router = express.Router();
const EventDataModel = require('../models/eventData');

router.get('/', async (req, res) => {
  try {
    const allEventData = await EventDataModel.findAll();
    res.json(allEventData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const eventData = await EventDataModel.findByPk(req.params.id);
    res.json(eventData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newEventData = await EventDataModel.create(req.body);
    res.status(201).json(newEventData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const eventData = await EventDataModel.findByPk(req.params.id);
    if (eventData) {
      await eventData.update(req.body);
      res.json(eventData);
    } else {
      res.status(404).json({ message: 'Event data not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;