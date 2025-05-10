const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./db');
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');
const statusRoutes = require('./routes/status');
const ticketRoutes = require('./routes/ticket');

// Enable CORS for specific origins
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/status', statusRoutes);
app.use('/api/tickets', ticketRoutes);

sequelize.sync({ alter: true }).then(() => {
  app.listen(3020, '0.0.0.0', () => console.log('Server running on http://0.0.0.0:3020'));
});
