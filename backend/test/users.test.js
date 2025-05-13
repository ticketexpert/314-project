const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const app = require('../app');
const User = require('../models/user');
const sequelize = require('../db');

//This one is just testing mocha and chai are working and return when run
describe('Sample Test Suite', () => {
  it('should return true', () => {
    expect(true).to.be.true;
  });
});

describe('Users API', () => {
  before(async function() {
    this.timeout(5000); // Increase timeout to 5 seconds
    await sequelize.sync({ force: true }); // Reset DB before tests
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const newUser = {
        name: 'johnTest',
        email: 'john.doe@example.com',
        password: 'securepassword123',
        role: 'Customer'
      };

      const res = await chai.request(app).post('/api/users').send(newUser);
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('name', newUser.name);

      // Create notification settings for the new user
      const notificationSettings = {
        userId: res.body.userId,
        bookingConf: true,
        eventReminder: true,
        eventUpdates: true,
        specialAnnouncements: true
      };

      const notificationRes = await chai.request(app).post('/api/userNotifcation').send(notificationSettings);
      expect(notificationRes).to.have.status(200);
    });

    it('should create multiple users with different roles', async function() {
      this.timeout(20000); // Increase timeout to 20 seconds
      const users = [];
      
      // Create 10 Organisers
      for (let i = 1; i <= 10; i++) {
        users.push({
          name: `Organiser${i}`,
          email: `organiser${i}@example.com`,
          password: 'password123',
          role: 'Organiser'
        });
      }

      // Create 50 Customers
      for (let i = 1; i <= 50; i++) {
        users.push({
          name: `Customer${i}`,
          email: `customer${i}@example.com`,
          password: 'password123',
          role: 'Customer'
        });
      }

      for (const user of users) {
        const res = await chai.request(app).post('/api/users').send(user);
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('name', user.name);
        expect(res.body).to.have.property('role', user.role);

        // Create notification settings for customers
        if (user.role === 'Customer') {
          const notificationSettings = {
            userId: res.body.userId,
            bookingConf: true,
            eventReminder: true,
            eventUpdates: true,
            specialAnnouncements: true
          };

          const notificationRes = await chai.request(app).post('/api/userNotifcation').send(notificationSettings);
          expect(notificationRes).to.have.status(200);
        }
      }
    });
  });

  describe('GET /api/users', () => {
    it('should get all users', async () => {
      const res = await chai.request(app).get('/api/users?userId=30');
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      console.log(res.body);
    });
  });
});