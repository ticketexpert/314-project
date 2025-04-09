const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('your_db_name', 'your_db_user', 'your_db_password', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;
