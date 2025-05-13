const sequelize = require('../db');
const Event = require('./event');
const User = require('./user');
const Ticket = require('./tickets');
const UserNotifications = require('./userNotifcations');

// Set up associations
Event.hasMany(Ticket, { foreignKey: 'eventId' });
Ticket.belongsTo(Event, { foreignKey: 'eventId' });

User.hasMany(Ticket, { foreignKey: 'userId' });
Ticket.belongsTo(User, { foreignKey: 'userId' });

// Add UserNotifications associations
User.hasOne(UserNotifications, { foreignKey: 'userId' });
UserNotifications.belongsTo(User, { foreignKey: 'userId' });

module.exports = { 
  sequelize,
  Event,
  User,
  Ticket,
  UserNotifications
};