const express = require('express');
const router = express.Router();

// GET /status - Returns the status of the site
router.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is responding' });
});

// GET /status/version - Returns the version of the site
router.get('/version', (req, res) => {
    res.json({ version: 'Fri 6 June 11:41AM' });
});

module.exports = router;