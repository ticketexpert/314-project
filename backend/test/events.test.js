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
          category: 'conference',
          tags: ['technology', 'networking', 'professional'],
          image: 'https://example.com/tech-conf.jpg',
          description: 'Annual technology conference featuring industry leaders',
          dateRange: '2025-05-01 to 2025-05-03',
          venue: 'Sydney Convention Centre',
          pricing: [
            { type: 'Early Bird', price: 299.99 },
            { type: 'Regular', price: 399.99 },
            { type: 'VIP', price: 599.99 }
          ],
          refundPolicy: 'Full refund available up to 30 days before the event',
          organiser: 'Sydney Tech Events',
          orgDescription: 'Leading technology event organizer in Sydney',
          orgContact: 'info@sydneytechevents.com'
        },
        {
          title: 'Summer Music Festival',
          category: 'festival',
          tags: ['music', 'outdoor', 'entertainment'],
          image: 'https://example.com/music-fest.jpg',
          description: 'Three day outdoor music festival',
          dateRange: '2025-01-15 to 2025-01-17',
          venue: 'Melbourne Park',
          pricing: [
            { type: 'Single Day', price: 150 },
            { type: 'Weekend Pass', price: 350 }
          ],
          refundPolicy: 'No refunds available for festival tickets',
          organiser: 'Melbourne Music Events',
          orgDescription: 'Leading organizer of music festivals in Australia',
          orgContact: 'contact@melbournemusic.com'
        },
        {
          title: 'Business Workshop',
          category: 'workshop',
          tags: ['business', 'professional', 'networking'],
          image: 'https://example.com/workshop.jpg',
          description: 'Professional development and networking event',
          dateRange: '2025-03-20',
          venue: 'Brisbane Business Centre',
          pricing: [
            { type: 'Standard', price: 75 },
            { type: 'Premium', price: 150 }
          ],
          refundPolicy: '50% refund available up to 7 days before the event',
          organiser: 'Business Growth Australia',
          orgDescription: 'Professional development and business networking organization',
          orgContact: 'info@businessgrowth.com.au'
        },
        {
          title: 'Art Exhibition',
          category: 'exhibition',
          tags: ['art', 'culture', 'visual-arts'],
          image: 'https://example.com/art-exhibition.jpg',
          description: 'Contemporary art showcase featuring local artists',
          dateRange: '2025-09-10 to 2025-09-30',
          venue: 'Perth Art Gallery',
          pricing: [
            { type: 'Adult', price: 25 },
            { type: 'Student', price: 15 },
            { type: 'Family', price: 60 }
          ],
          refundPolicy: 'Full refund available up to 24 hours before the event',
          organiser: 'Perth Arts Council',
          orgDescription: 'Promoting local artists and cultural events in Perth',
          orgContact: 'exhibitions@pertharts.org'
        },
        {
          title: 'Food & Wine Festival',
          category: 'festival',
          tags: ['food', 'wine', 'culinary', 'tasting'],
          image: 'https://example.com/food-wine-fest.jpg',
          description: 'Celebration of local cuisine and wines',
          dateRange: '2025-07-15 to 2025-07-17',
          venue: 'Adelaide Showgrounds',
          pricing: [
            { type: 'Tasting Pass', price: 120 },
            { type: 'Masterclass Pass', price: 250 },
            { type: 'VIP Experience', price: 500 }
          ],
          refundPolicy: 'Full refund available up to 14 days before the event',
          organiser: 'South Australian Food & Wine Association',
          orgDescription: 'Celebrating South Australia\'s finest food and wine producers',
          orgContact: 'events@safoodwine.org'
        },
        {
          title: 'Startup Pitch Night',
          category: 'conference',
          tags: ['startup', 'entrepreneurship', 'pitching', 'networking'],
          image: 'https://example.com/startup-pitch.jpg',
          description: 'Entrepreneurs pitch their innovative ideas',
          dateRange: '2025-06-20',
          venue: 'Sydney Startup Hub',
          pricing: [
            { type: 'General Admission', price: 50 },
            { type: 'Investor Pass', price: 200 }
          ],
          refundPolicy: 'No refunds available for pitch night tickets',
          organiser: 'Sydney Startup Network',
          orgDescription: 'Connecting entrepreneurs with investors and mentors',
          orgContact: 'pitch@sydneystartup.net'
        },
        {
          title: 'Fitness Bootcamp',
          category: 'workshop',
          tags: ['fitness', 'health', 'training', 'wellness'],
          image: 'https://example.com/fitness-bootcamp.jpg',
          description: 'Intensive fitness training program',
          dateRange: '2025-08-05 to 2025-08-07',
          venue: 'Gold Coast Sports Centre',
          pricing: [
            { type: 'Single Day', price: 85 },
            { type: 'Full Program', price: 200 }
          ],
          refundPolicy: 'Full refund available up to 48 hours before the event',
          organiser: 'Gold Coast Fitness Academy',
          orgDescription: 'Professional fitness training and wellness programs',
          orgContact: 'bootcamp@gcfitness.com'
        },
        {
          title: 'Photography Masterclass',
          category: 'workshop',
          tags: ['photography', 'art', 'skills', 'professional'],
          image: 'https://example.com/photo-masterclass.jpg',
          description: 'Learn advanced photography techniques',
          dateRange: '2025-10-12 to 2025-10-13',
          venue: 'Melbourne Arts Centre',
          pricing: [
            { type: 'Basic', price: 199 },
            { type: 'Advanced', price: 299 },
            { type: 'Equipment Included', price: 399 }
          ],
          refundPolicy: 'Full refund available up to 7 days before the event',
          organiser: 'Melbourne Photography Institute',
          orgDescription: 'Professional photography education and training',
          orgContact: 'masterclass@melbournephoto.edu'
        },
        {
          title: 'Comedy Night',
          category: 'show',
          tags: ['comedy', 'entertainment', 'nightlife'],
          image: 'https://example.com/comedy-night.jpg',
          description: 'Stand-up comedy featuring top comedians',
          dateRange: '2025-11-25',
          venue: 'Brisbane Comedy Club',
          pricing: [
            { type: 'General Admission', price: 45 },
            { type: 'VIP Table', price: 150 }
          ],
          refundPolicy: 'Full refund available up to 24 hours before the show',
          organiser: 'Brisbane Comedy Collective',
          orgDescription: 'Showcasing the best local and international comedy talent',
          orgContact: 'shows@brisbanecomedy.com'
        }
      ];

      // Create each event and verify its creation
      for (const event of events) {
        const res = await chai.request(app).post('/api/events').send(event);
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('title', event.title);
        expect(res.body).to.have.property('category', event.category);
        expect(res.body).to.have.property('tags').that.is.an('array');
        expect(res.body).to.have.property('image', event.image);
        expect(res.body).to.have.property('dateRange', event.dateRange);
        expect(res.body).to.have.property('venue', event.venue);
        expect(res.body).to.have.property('pricing').that.is.an('array');
        expect(res.body).to.have.property('refundPolicy', event.refundPolicy);
        expect(res.body).to.have.property('organiser', event.organiser);
        expect(res.body).to.have.property('orgDescription', event.orgDescription);
        expect(res.body).to.have.property('orgContact', event.orgContact);
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
          role: 'Customer',
          events: []
        });
      }

      // Create each user
      for (const user of users) {
        const res = await chai.request(app).post('/api/users').send(user);
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('name', user.name);
        expect(res.body).to.have.property('role', user.role);
        expect(res.body).to.have.property('events').that.is.an('array');
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