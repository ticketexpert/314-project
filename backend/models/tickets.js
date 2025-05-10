const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const tickets = sequelize.define('tickets', {
  ticketId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  locationDetails: {
    type: DataTypes.JSON,
    allowNull: false
  },
  ticketStatus: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ticketType: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = tickets;