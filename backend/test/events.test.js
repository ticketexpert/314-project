const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const app = require('../app'); // This is just a boilerplate but it keeps it working 
const Event = require('../models'); // Sequelize model
const { sequelize } = require('../models'); // Sequelize instance

//This one is just testing mocha and chai are working and return when run
describe('Sample Test Suite', () => {
  it('should return true', () => {
    expect(true).to.be.true;
  });
});

//Testing the events route js
describe('Events API', () => {
  before(async () => {
    await sequelize.sync({ force: true }); // Reset DB before tests
  });

  describe('POST /api/events', () => {
    it('should create a new event', async () => {
      const newEvent = {
        title: 'Test Conference',
        type: 'conference',
        date: '2025-05-01',
        price: 100,
        location: 'Wollongong'
      };

      const res = await chai.request(app).post('/api/events').send(newEvent);
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('title', newEvent.title);
    });
  });

  describe('GET /api/events', () => {
    it('Get events', async () => {
      const res = await chai.request(app).get('/api/events');
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
    });
  });
});