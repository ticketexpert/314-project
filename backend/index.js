const express = require('express');
const app = express();
const sequelize = require('./db');
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');

app.use(express.json());
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

sequelize.sync({ alter: true }).then(() => {
  app.listen(3000, () => console.log('Server running on http://localhost:3000'));
});
