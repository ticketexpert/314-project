const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:'); // or your config

module.exports = { sequelize };