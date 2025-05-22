const express = require('express');
const router = express.Router();
const EventStaff = require('../models/eventStaff');

router.get('/', async (req, res) => {
  const eventStaff = await EventStaff.findAll();
  return res.status(200).json(eventStaff);
});

router.post('/', async (req, res) => {
  const eventStaff = await EventStaff.create(req.body);
  return res.status(200).json(eventStaff);
});

router.put('/:id', async (req, res) => {
  const eventStaff = await EventStaff.update(req.body, { where: { id: req.params.id } });
  return res.status(200).json(eventStaff);
});

router.delete('/:id', async (req, res) => {
  const eventStaff = await EventStaff.destroy({ where: { id: req.params.id } });
  return res.status(200).json(eventStaff);
});



module.exports = router;