const Event = require('./event');
const eventData = require('./eventData');

// Define the associations
Event.hasOne(eventData, { foreignKey: 'eventId' });
eventData.belongsTo(Event, { foreignKey: 'eventId' });

module.exports = {
  Event,
  eventData
}; 