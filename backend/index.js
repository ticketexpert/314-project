const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./db');
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');

// Enable CORS for all routes
app.use(cors());

app.use(express.json());
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

sequelize.sync({ alter: true }).then(() => {
  app.listen(3000, '0.0.0.0', () => console.log('Server running on http://0.0.0.0:3000'));
});
