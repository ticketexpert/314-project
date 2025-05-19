const { Sequelize } = require('sequelize');
require('dotenv').config({ path: '.db.env' });

const isTest = process.env.NODE_ENV === 'test';

const sequelize = new Sequelize(
  isTest ? process.env.DB_TEST_NAME : process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres'
  }
);

module.exports = sequelize;
