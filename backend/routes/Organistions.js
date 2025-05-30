const express = require('express');
const router = express.Router();
const Organisation = require('../models/organisations');
const User = require('../models/user');

router.get('/', async (req, res) => {
  try {
    const organisations = await Organisation.findAll();
    res.json(organisations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const organisation = await Organisation.create(req.body);
    res.status(201).json(organisation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});




//PUT /api/organisations/:eventOrgId
router.put('/:eventOrgId', async (req, res) => {
  try {
    const organisation = await Organisation.findByPk(req.params.eventOrgId);
    if (!organisation) {
      return res.status(404).json({ message: 'Organisation not found' });
    }

    const updatedOrg = await organisation.update(req.body);
    res.json(updatedOrg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const organisation = await Organisation.findByPk(req.params.id);
    res.json(organisation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id/users', async (req, res) => {
  try {
    const organisation = await Organisation.findByPk(req.params.id);
    const users = await User.findAll({ where: { organisationId: organisation.id } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/users', async (req, res) => {
  try {
    const organisation = await Organisation.findByPk(req.params.id);
    const users = await User.findAll({ where: { organisationId: organisation.id } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/:passedEventOrgId', async (req, res) => {
  try {
    const organisation = await Organisation.findByPk(req.params.passedEventOrgId);
    if (!organisation) {
      return res.status(404).json({ message: 'Org not found' });
    }
    if (req.body.users) {
      const currentUsers = organisation.users || [];
      const newUsers = req.body.users;
      
      for (const userId of newUsers) {
        await User.update(
          { eventOrgId: organisation.eventOrgId },
          { where: { userId: userId } }
        );
      }
      req.body.users = [...currentUsers, ...newUsers];
    }

    const updatedOrg = await organisation.update(req.body);
    res.json(updatedOrg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;