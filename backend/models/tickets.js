const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const tickets = sequelize.define('tickets', {
  ticketId: {
    type: DataTypes.STRING(6),
    primaryKey: true,
    defaultValue: () => {
      const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let result = '';
      for (let i = 0; i < 6; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
      return result;
    }
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
  },
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = tickets;