const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Event = require('./event');

const eventData = sequelize.define('eventData', {
  eventId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: Event,
      key: 'eventId'
    }
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

// Define the association
eventData.belongsTo(Event, { foreignKey: 'eventId' });
Event.hasOne(eventData, { foreignKey: 'eventId' });

module.exports = eventData;