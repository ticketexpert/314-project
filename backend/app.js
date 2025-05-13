const express = require('express');
const cors = require('cors');
const app = express();
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');
const statusRoutes = require('./routes/status');
const ticketRoutes = require('./routes/ticket');
const userNotifcationRoutes = require('./routes/userNotifcation');

// Enable CORS for specific origins
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));

app.use(express.json());
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/status', statusRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/userNotifcation', userNotifcationRoutes);

// Export the app so it can be used in test files
module.exports = app;