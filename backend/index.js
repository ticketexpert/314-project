const app = require('./app');
const sequelize = require('./db');

sequelize.sync({ alter: true }).then(() => {
  app.listen(3020, '0.0.0.0', () => console.log('Server running on http://0.0.0.0:3020'));
});
