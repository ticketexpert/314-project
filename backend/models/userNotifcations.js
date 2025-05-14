const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const UserNotifications = sequelize.define('UserNotifications', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  bookingConf: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  eventReminder: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  eventUpdates: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  specialAnnouncements: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  currentNotifs: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  }
});

module.exports = UserNotifications;
