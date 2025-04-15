const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const eventsRouter = require('./routes/events'); // Adjust this path if needed

app.use(bodyParser.json());
app.use('/api/events', eventsRouter);

// Export the app so it can be used in test files
module.exports = app;