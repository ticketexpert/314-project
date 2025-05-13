const { Sequelize } = require('sequelize');

const isTest = process.env.NODE_ENV === 'test';

const sequelize = new Sequelize(
  isTest ? 'eventdb_test' : 'eventdb',
  'eventuser',
  'eventpass',
  {
    host: '103.4.235.10',
    port: 5432,
    dialect: 'postgres'
  }
);

module.exports = sequelize;
