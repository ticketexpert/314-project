const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('eventdb', 'eventuser', 'eventpass', {
  host: '103.4.235.10',
  port: 5432,
  dialect: 'postgres',
});

module.exports = sequelize;
