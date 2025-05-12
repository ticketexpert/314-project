const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const app = require('../app');
const Ticket = require('../models/tickets');
const User = require('../models/user');
const Event = require('../models/event');
const { sequelize } = require('../models');

//This one is just testing mocha and chai are working and return when run
describe('Sample Test Suite', () => {
  it('should return true', () => {
    expect(true).to.be.true;
  });
});

describe('Ticket API', () => {
  let testUser;
  let testEvent;
  let testTicket;

  before(async function() {
    this.timeout(5000); // Increase timeout to 5 seconds
    await sequelize.sync({ force: true }); // Reset DB before tests
    
    // Create test user
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user'
    });

    // Create test event
    testEvent = await Event.create({
      title: 'Test Event',
      category: 'Test Category',
      image: 'test.jpg',
      description: 'Test Description',
      fromDateTime: new Date(),
      toDateTime: new Date(Date.now() + 86400000),
      region: 'Test Region',
      venue: 'Test Venue',
      pricing: [{ price: 100, tier: 'Standard', numTicketsAvailable: 50 }],
      refundPolicy: 'Test Policy',
      organiser: 'Test Organiser',
      orgDescription: 'Test Org Description',
      orgContact: 'test@org.com'
    });
  });

  describe('POST /api/tickets', () => {
    it('should create a new ticket', async () => {
      const ticketData = {
        eventId: testEvent.eventId,
        userId: testUser.userId,
        locationDetails: { section: 'A', row: '1', seat: '1' },
        ticketStatus: 'active',
        ticketType: 'standard',
        orderNumber: Math.floor(Math.random() * 2147483647),
      };

      const res = await chai.request(app)
        .post('/api/tickets')
        .send(ticketData);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('ticketId');
      expect(res.body.eventId).to.equal(ticketData.eventId);
      expect(res.body.userId).to.equal(ticketData.userId);
      expect(res.body.orderNumber).to.equal(ticketData.orderNumber.toString());
      testTicket = res.body;
    });

    it('should return 400 for invalid ticket data', async () => {
      const invalidTicketData = {
        eventId: testEvent.eventId,
        // Missing required fields
      };

      const res = await chai.request(app)
        .post('/api/tickets')
        .send(invalidTicketData);

      expect(res).to.have.status(400);
    });
  });

  describe('GET /api/tickets', () => {
    it('should get all tickets', async () => {
      const res = await chai.request(app)
        .get('/api/tickets');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.greaterThan(0);
    });
  });

  describe('GET /api/tickets/user/:userId', () => {
    it('should get tickets for a specific user', async () => {
      const res = await chai.request(app)
        .get(`/api/tickets/user/${testUser.userId}`);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body[0].userId).to.equal(testUser.userId);
    });

    it('should return empty array for non-existent user', async () => {
      const res = await chai.request(app)
        .get('/api/tickets/user/99999');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(0);
    });
  });

  describe('GET /api/tickets/:eventId/:userId', () => {
    it('should get ticket for specific event and user', async () => {
      const res = await chai.request(app)
        .get(`/api/tickets/${testEvent.eventId}/${testUser.userId}`);

      expect(res).to.have.status(200);
      expect(res.body.eventId).to.equal(testEvent.eventId);
      expect(res.body.userId).to.equal(testUser.userId);
    });

    it('should return null for non-existent ticket', async () => {
      const res = await chai.request(app)
        .get('/api/tickets/99999/99999');

      expect(res).to.have.status(200);
      expect(res.body).to.be.null;
    });
  });

  describe('GET /api/tickets/:ticketId', () => {
    it('should get ticket by ticketId', async () => {
      const res = await chai.request(app)
        .get(`/api/tickets/${testTicket.ticketId}`);

      expect(res).to.have.status(200);
      expect(res.body.ticketId).to.equal(testTicket.ticketId);
    });

    it('should return null for non-existent ticketId', async () => {
      const res = await chai.request(app)
        .get('/api/tickets/99999');

      expect(res).to.have.status(200);
      expect(res.body).to.be.null;
    });
  });

  describe('GET /api/tickets/order/:orderNumber', () => {
    it('should get ticket by orderNumber', async () => {
      const res = await chai.request(app)
        .get(`/api/tickets/order/${testTicket.orderNumber}`);

      expect(res).to.have.status(200);
      expect(res.body.orderNumber).to.equal(testTicket.orderNumber);
    });

    it('should return null for non-existent orderNumber', async () => {
      const res = await chai.request(app)
        .get('/api/tickets/order/99999');

      expect(res).to.have.status(200);
      expect(res.body).to.be.null;
    });
  });
});
