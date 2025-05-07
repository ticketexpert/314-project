const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Event = sequelize.define('Event', {
  eventId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
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
    get() {
      const rawValue = this.getDataValue('date');
      return rawValue ? rawValue.toISOString() : null;
    },
    set(value) {
      this.setDataValue('date', new Date(value));
    }
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
