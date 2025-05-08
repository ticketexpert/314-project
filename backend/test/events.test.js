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
  before(async function() {
    this.timeout(5000); // Increase timeout to 5 seconds
    await sequelize.sync({ force: true }); // Reset DB before tests
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
        },
        {
          title: 'Food & Wine Festival',
          type: 'festival',
          date: '2025-07-15',
          description: 'Celebration of local cuisine and wines',
          price: 120,
          location: 'Adelaide'
        },
        {
          title: 'Startup Pitch Night',
          type: 'conference',
          date: '2025-06-20',
          description: 'Entrepreneurs pitch their innovative ideas',
          price: 50,
          location: 'Sydney'
        },
        {
          title: 'Fitness Bootcamp',
          type: 'workshop',
          date: '2025-08-05',
          description: 'Intensive fitness training program',
          price: 85,
          location: 'Gold Coast'
        },
        {
          title: 'Photography Masterclass',
          type: 'workshop',
          date: '2025-10-12',
          description: 'Learn advanced photography techniques',
          price: 199,
          location: 'Melbourne'
        },
        {
          title: 'Comedy Night',
          type: 'show',
          date: '2025-11-25',
          description: 'Stand-up comedy featuring top comedians',
          price: 45,
          location: 'Brisbane'
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

  describe('Create registrations', () => {
    it('register 50 customers', async function() {
      this.timeout(30000); // Increase timeout to 30 seconds
      const users = [];
      
      // Create 50 Customers
      for (let i = 1; i <= 50; i++) {
        users.push({
          name: `Customer${i}`,
          email: `customer${i}@example.com`,
          password: 'password123',
          role: 'Customer'
        });
      }

      // Create each user
      for (const user of users) {
        const res = await chai.request(app).post('/api/users').send(user);
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('name', user.name);
        expect(res.body).to.have.property('role', user.role);
      }

      // Get all events
      const eventsRes = await chai.request(app).get('/api/events');
      expect(eventsRes).to.have.status(200);
      const allEvents = eventsRes.body;
      expect(allEvents).to.be.an('array');

      // Create 50 registrations by randomly assigning events to customers
      const registrations = [];
      for (let customerId = 1; customerId <= 50; customerId++) {
        // Randomly select an event
        const randomEvent = allEvents[Math.floor(Math.random() * allEvents.length)];
        
        // Add event to customer
        const res = await chai.request(app)
          .post('/api/users/addEvent')
          .send({
            userId: customerId,
            eventId: randomEvent.eventId
          });
        
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Event added to user\'s events');
        registrations.push({
          userId: customerId,
          eventId: randomEvent.eventId
        });
      }

      // Verify total number of registrations
      expect(registrations.length).to.equal(50);
    });
  });
});