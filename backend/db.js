const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('eventdb', 'eventuser', 'eventpass', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;
