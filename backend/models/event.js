const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Event = sequelize.define('Event', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  createdBy: {
    type: DataTypes.STRING,
  }
});

module.exports = Event;
