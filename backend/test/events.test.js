const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const app = require('../app');
const Event = require('../models/event');
const sequelize = require('../db');

//This one is just testing mocha and chai are working and return when run
describe('Sample Test Suite', () => {
  it('should return true', () => {
    expect(true).to.be.true;
  });
});

//Testing the events route js
describe('Events API', () => {
  before(async function() {
    this.timeout(10000); // Increase timeout to 10 seconds
    try {
      await sequelize.sync({ force: true }); // Reset DB before tests
    } catch (error) {
      console.error('Error in before hook:', error);
      throw error;
    }
  });

  describe('POST /api/events', () => {
    it('should create multiple different types of events', async () => {
      const events = [
        {
          title: 'Tech Conference 2025',
          type: 'conference',
          date: '2025-05-01',
          description: 'Annual technology conference featuring industry leaders',
          price: 299.99,
          location: 'Sydney'
        },
        {
          title: 'Summer Music Festival',
          type: 'festival', 
          date: '2025-01-15',
          description: 'Three day outdoor music festival',
          price: 150,
          location: 'Melbourne'
        },
        {
          title: 'Business Workshop',
          type: 'workshop',
          date: '2025-03-20',
          description: 'Professional development and networking event',
          price: 75,
          location: 'Brisbane'
        },
        {
          title: 'Art Exhibition',
          type: 'exhibition',
          date: '2025-09-10',
          description: 'Contemporary art showcase featuring local artists',
          price: 25,
          location: 'Perth'
        }
      ];

      // Create each event and verify its creation
      for (const event of events) {
        const res = await chai.request(app).post('/api/events').send(event);
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('title', event.title);
        expect(res.body).to.have.property('type', event.type);
        expect(res.body).to.have.property('date').that.is.a('string');
        expect(res.body).to.have.property('location', event.location);
        expect(res.body).to.have.property('price', event.price);
        expect(res.body).to.have.property('description', event.description);
      }
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