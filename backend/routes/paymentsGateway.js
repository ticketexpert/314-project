const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({ "Success": "Success" });
});

router.put('/', (req, res) => {
    res.status(200).json({ "Success": "Success" });
});

router.post('/', (req, res) => {
    res.status(200).json({ "Success": "Success" });
});


module.exports = router;