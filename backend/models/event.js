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
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fromDateTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  toDateTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  region: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  venue: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pricing: {
    type: DataTypes.ARRAY(DataTypes.JSON),
    defaultValue: [],
    // Each pricing object should include: { price: number, type: string, numTicketsAvailable: number }
  },
  refundPolicy: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  organiser: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  eventOrgId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  orgDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  orgContact: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  orgFollow: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  eventShareLinks: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  }
});

module.exports = Event;
