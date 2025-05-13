const chai = require('chai');
const expect = chai.expect;
const app = require('../app');
const sequelize = require('../db');
const { UserNotifications } = require('../models');

describe('User Notifications API', () => {
  before(async function() {
    this.timeout(5000); // Increase timeout to 5 seconds
    await sequelize.sync({ force: true }); // Reset DB before tests
  });

  describe('POST /api/userNotifcation', () => {
    it('should create new notification settings for a user', async () => {
      const notificationSettings = {
        userId: 1,
        bookingConf: true,
        eventReminder: true,
        eventUpdates: true,
        specialAnnouncements: true
      };

      const res = await chai.request(app).post('/api/userNotifcation').send(notificationSettings);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('userId', notificationSettings.userId);
      expect(res.body).to.have.property('bookingConf', notificationSettings.bookingConf);
      expect(res.body).to.have.property('eventReminder', notificationSettings.eventReminder);
      expect(res.body).to.have.property('eventUpdates', notificationSettings.eventUpdates);
      expect(res.body).to.have.property('specialAnnouncements', notificationSettings.specialAnnouncements);
    });

    it('should handle invalid notification settings', async () => {
      const invalidSettings = {
        userId: 2,
      };

      const res = await chai.request(app).post('/api/userNotifcation').send(invalidSettings);
      expect(res).to.have.status(500);
    });
  });

  describe('GET /api/userNotifcation', () => {
    it('should get all user notification settings', async () => {
      const res = await chai.request(app).get('/api/userNotifcation');
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.least(1);
    });
  });

  describe('GET /api/userNotifcation/:userId', () => {
    it('should get notification settings for a specific user', async () => {
      const userId = 1;
      const res = await chai.request(app).get(`/api/userNotifcation/${userId}`);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('userId', userId);
    });

    it('should return null for non-existent user', async () => {
      const nonExistentUserId = 999;
      const res = await chai.request(app).get(`/api/userNotifcation/${nonExistentUserId}`);
      expect(res).to.have.status(200);
      expect(res.body).to.be.null;
    });
  });

  describe('PUT /api/userNotifcation/:userId', () => {
    it('should update notification settings for a user', async () => {
      const userId = 1;
      const updatedSettings = {
        bookingConf: false,
        eventReminder: false,
        eventUpdates: true,
        specialAnnouncements: true
      };

      const res = await chai.request(app).put(`/api/userNotifcation/${userId}`).send(updatedSettings);
      expect(res).to.have.status(200);

      // Verify the update by fetching the user's settings
      const getRes = await chai.request(app).get(`/api/userNotifcation/${userId}`);
      expect(getRes.body).to.have.property('bookingConf', updatedSettings.bookingConf);
      expect(getRes.body).to.have.property('eventReminder', updatedSettings.eventReminder);
    });

    it('should handle update for non-existent user', async () => {
      const nonExistentUserId = 999;
      const updatedSettings = {
        bookingConf: false,
        eventReminder: false,
        eventUpdates: true,
        specialAnnouncements: true
      };

      const res = await chai.request(app).put(`/api/userNotifcation/${nonExistentUserId}`).send(updatedSettings);
      expect(res).to.have.status(200);
    });
  });
});
