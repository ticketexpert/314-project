const express = require('express');
const app = express();
const sequelize = require('./db');
const eventRoutes = require('./routes/events');

app.use(express.json());
app.use('/api/events', eventRoutes);

sequelize.sync().then(() => {
  app.listen(3000, () => console.log('Server running on http://localhost:3000'));
});
