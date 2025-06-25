const app = require('./app');
const sequelize = require('./db');
require('dotenv').config({ path: '.db.env' });

sequelize.sync().then(() => {
  console.log('Database synced successfully');
  app.listen(process.env.SERVER_PORT, '0.0.0.0', () => console.log(`Server running on http://0.0.0.0:${process.env.SERVER_PORT}`));
}).catch(err => {
  console.error('Error syncing database:', err);
});
