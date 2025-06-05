const sequelize = require('../db');
const Event = require('./event');
const User = require('./user');
const Ticket = require('./tickets');
const UserNotifications = require('./userNotifcations');
const eventData = require('./eventData');
const Organisation = require('./organisations');

// Set up associations
Event.hasMany(Ticket, { foreignKey: 'eventId' });
Ticket.belongsTo(Event, { foreignKey: 'eventId' });

User.hasMany(Ticket, { foreignKey: 'userId' });
Ticket.belongsTo(User, { foreignKey: 'userId' });

Event.hasOne(eventData, { foreignKey: 'eventId' });
eventData.belongsTo(Event, { foreignKey: 'eventId' });

User.hasOne(UserNotifications, { foreignKey: 'userId' });
UserNotifications.belongsTo(User, { foreignKey: 'userId' });

module.exports = { 
  sequelize,
  Event,
  User,
  Ticket,
  UserNotifications,
  eventData,
  Organisation
};