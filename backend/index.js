const app = require('./app');
const sequelize = require('./db');

sequelize.sync().then(() => {
  console.log('Database synced successfully');
  app.listen(3020, '0.0.0.0', () => console.log('Server running on http://0.0.0.0:3020'));
}).catch(err => {
  console.error('Error syncing database:', err);
});
