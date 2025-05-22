const sequelize = require('../db');
const Event = require('./event');
const User = require('./user');
const Ticket = require('./tickets');
const UserNotifications = require('./userNotifcations');
const eventData = require('./eventData');

// Set up associations
Event.hasMany(Ticket, { foreignKey: 'eventId' });
Ticket.belongsTo(Event, { foreignKey: 'eventId' });

User.hasMany(Ticket, { foreignKey: 'userId' });
Ticket.belongsTo(User, { foreignKey: 'userId' });

Event.hasOne(eventData, { foreignKey: 'eventId' });
eventData.belongsTo(Event, { foreignKey: 'eventId' });

User.hasOne(UserNotifications, { foreignKey: 'userId' });
UserNotifications.belongsTo(User, { foreignKey: 'userId' });


/* TODO - FINISH THIS LATER ONCE ORG TABLE IS DONE
Event.hasOne(eventData, { foreignKey: 'eventOrgId' });
eventData.belongsTo(Event, { foreignKey: 'eventOrgId' });
*/

module.exports = { 
  sequelize,
  Event,
  User,
  Ticket,
  UserNotifications,
  eventData
};