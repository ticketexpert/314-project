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

//Patch /api/organisations/:eventOrgId
router.patch('/:eventOrgId', async (req, res) => {
  try {    
    const organisation = await Organisation.findByPk(req.params.eventOrgId);
    if (!organisation) {
      return res.status(404).json({ message: 'Organisation not found' });
    }

    // If userId is provided in the request body, add it to the users array
    if (req.body.userId) {
      const user = await User.findByPk(req.body.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Initialize users array if it doesn't exist
      const currentUsers = organisation.users || [];
      
      // Add user ID if it's not already in the array
      if (!currentUsers.includes(req.body.userId)) {
        currentUsers.push(req.body.userId);
        req.body.users = currentUsers;
      }
    }
    
    const updatedOrg = await organisation.update(req.body);
    res.json(updatedOrg);
  } catch (error) {
    console.error('Error updating organisation:', error);
    res.status(500).json({ message: error.message });
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

module.exports = router;