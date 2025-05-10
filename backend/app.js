const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const eventsRouter = require('./routes/events'); // Adjust this path if needed
const usersRouter = require('./routes/users');
const ticketRouter = require('./routes/ticket');

// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());
app.use('/api/events', eventsRouter);
app.use('/api/users', usersRouter);
app.use('/api/tickets', ticketRouter);
// Export the app so it can be used in test files
module.exports = app;