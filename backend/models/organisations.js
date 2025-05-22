const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Organisation = sequelize.define('Organisation', {
  eventOrgId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Organisation;