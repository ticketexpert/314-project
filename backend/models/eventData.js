const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const eventData = sequelize.define('eventData', {
  eventId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  eventStatus: {
    type: DataTypes.STRING,
    allowNull: false
  },
  eventCapacity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ticketsSold: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ticketsAvailable: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = eventData;