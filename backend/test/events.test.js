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
          image: 'https://plus.unsplash.com/premium_photo-1679547202671-f9dbbf466db4?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          description: 'Annual technology conference featuring industry leaders',
          fromDateTime: '2025-05-01T09:00:00Z',
          toDateTime: '2025-05-03T17:00:00Z',
          region: 'Sydney',
          venue: 'Sydney Convention Centre',
          pricing: [
            { type: 'Early Bird', price: 299.99, numTicketsAvailable: 100 },
            { type: 'Regular', price: 399.99, numTicketsAvailable: 200 },
            { type: 'VIP', price: 599.99, numTicketsAvailable: 50 }
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
          image: 'https://plus.unsplash.com/premium_photo-1661284892176-fd7713b764a6?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          description: 'Three day outdoor music festival',
          fromDateTime: '2025-01-15T12:00:00Z',
          toDateTime: '2025-01-17T23:00:00Z',
          region: 'Melbourne',
          venue: 'Melbourne Park',
          pricing: [
            { type: 'Single Day', price: 150, numTicketsAvailable: 500 },
            { type: 'Weekend Pass', price: 350, numTicketsAvailable: 300 }
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
          image: 'https://images.unsplash.com/photo-1556741576-1d17b478d761?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          description: 'Professional development and networking event',
          fromDateTime: '2025-03-20T09:00:00Z',
          toDateTime: '2025-03-20T17:00:00Z',
          region: 'Brisbane',
          venue: 'Brisbane Business Centre',
          pricing: [
            { type: 'Standard', price: 75, numTicketsAvailable: 100 },
            { type: 'Premium', price: 150, numTicketsAvailable: 50 }
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
          image: 'https://plus.unsplash.com/premium_photo-1706430433607-48f37bdd71b8?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          description: 'Contemporary art showcase featuring local artists',
          fromDateTime: '2025-09-10T10:00:00Z',
          toDateTime: '2025-09-30T18:00:00Z',
          region: 'Perth',
          venue: 'Perth Art Gallery',
          pricing: [
            { type: 'Adult', price: 25, numTicketsAvailable: 200 },
            { type: 'Student', price: 15, numTicketsAvailable: 150 },
            { type: 'Family', price: 60, numTicketsAvailable: 100 }
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
          image: 'https://plus.unsplash.com/premium_photo-1680086880881-442721afe30c?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          description: 'Celebration of local cuisine and wines',
          fromDateTime: '2025-07-15T11:00:00Z',
          toDateTime: '2025-07-17T22:00:00Z',
          region: 'Adelaide',
          venue: 'Adelaide Showgrounds',
          pricing: [
            { type: 'Tasting Pass', price: 120, numTicketsAvailable: 300 },
            { type: 'Masterclass Pass', price: 250, numTicketsAvailable: 100 },
            { type: 'VIP Experience', price: 500, numTicketsAvailable: 50 }
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
          image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          description: 'Entrepreneurs pitch their innovative ideas',
          fromDateTime: '2025-06-20T18:00:00Z',
          toDateTime: '2025-06-20T22:00:00Z',
          region: 'Sydney',
          venue: 'Sydney Startup Hub',
          pricing: [
            { type: 'General Admission', price: 50, numTicketsAvailable: 200 },
            { type: 'Investor Pass', price: 200, numTicketsAvailable: 50 }
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
          image: 'https://plus.unsplash.com/premium_photo-1664109999778-84bdb22b883a?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          description: 'Intensive fitness training program',
          fromDateTime: '2025-08-05T06:00:00Z',
          toDateTime: '2025-08-07T18:00:00Z',
          region: 'Gold Coast',
          venue: 'Gold Coast Sports Centre',
          pricing: [
            { type: 'Single Day', price: 85, numTicketsAvailable: 100 },
            { type: 'Full Program', price: 200, numTicketsAvailable: 50 }
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
          image: 'https://www.khiemng.com/_next/image?url=%2Fimages%2Fgallery%2FMANLY4.jpeg&w=1080&q=75',
          description: 'Learn advanced photography techniques',
          fromDateTime: '2025-10-12T09:00:00Z',
          toDateTime: '2025-10-13T17:00:00Z',
          region: 'Melbourne',
          venue: 'Melbourne Arts Centre',
          pricing: [
            { type: 'Basic', price: 199, numTicketsAvailable: 50 },
            { type: 'Advanced', price: 299, numTicketsAvailable: 30 },
            { type: 'Equipment Included', price: 399, numTicketsAvailable: 20 }
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
          image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          description: 'Stand-up comedy featuring top comedians',
          fromDateTime: '2025-11-25T19:00:00Z',
          toDateTime: '2025-11-25T23:00:00Z',
          region: 'Brisbane',
          venue: 'Brisbane Comedy Club',
          pricing: [
            { type: 'General Admission', price: 45, numTicketsAvailable: 150 },
            { type: 'VIP Table', price: 150, numTicketsAvailable: 20 }
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
        expect(res.body).to.have.property('fromDateTime');
        expect(res.body).to.have.property('toDateTime');
        expect(res.body).to.have.property('region', event.region);
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

  describe('Ticket Management', () => {
    it('should create tickets for multiple registrations', async function() {
      this.timeout(30000); // Increase timeout for multiple ticket creation
      
      // Get all events and users
      const eventsRes = await chai.request(app).get('/api/events');
      const usersRes = await chai.request(app).get('/api/users');
      const events = eventsRes.body;
      const users = usersRes.body;

      // Create tickets for each registration
      for (let i = 0; i < 50; i++) {
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        const userId = i + 1; 
        
        const numTicketTypes = randomEvent.pricing.length;
        const minCeiled = Math.ceil(0);
        const maxFloored = Math.floor(numTicketTypes - 1);
        const randomTicketType = Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);

        const ticketData = {
          eventId: randomEvent.eventId,
          userId: userId,
          locationDetails: { section: 'A', row: '1', seat: '1' },
          ticketStatus: 'active',
          ticketType: randomEvent.pricing[randomTicketType].type,
          orderNumber: Math.floor(Math.random() * 2147483647)
        };

        const res = await chai.request(app)
          .post('/api/tickets')
          .send(ticketData);

        expect(res).to.have.status(201);
        expect(res.body).to.have.property('ticketId');
        expect(res.body.eventId).to.equal(ticketData.eventId);
        expect(res.body.userId).to.equal(ticketData.userId);
      }
    });
  });
});