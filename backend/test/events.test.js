const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const app = require('../app'); // This is just a boilerplate but it keeps it working 
const Event = require('../models'); // Sequelize model
const { sequelize } = require('../models'); // Sequelize instance


let numRegistrations = 0;
let numUsers = 0;
let numOrganisers = 0;

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

  describe('POST /api/organisations', () => {
    it('should create multiple different types of organisations', async () => {
      const organisations = [
        {
          name: 'Sydney Tech Events',
          description: 'Leading technology event organizer in Sydney',
          contact: 'info@sydneytechevents.com'
        },
        {
          name: 'Melbourne Music Events',
          description: 'Leading organizer of music festivals in Australia',
          contact: 'contact@melbournemusic.com'
        },
        {
          name: 'Business Growth Australia',
          description: 'Professional development and business networking organization',
          contact: 'info@businessgrowth.com.au'
        },
        {
          name: 'Perth Arts Council',
          description: 'Promoting local artists and cultural events in Perth',
          contact: 'exhibitions@pertharts.org'
        },
        {
          name: 'South Australian Food & Wine Association',
          description: 'Celebrating South Australia\'s finest food and wine producers',
          contact: 'events@safoodwine.org'
        },
        {
          name: 'Sydney Startup Network',
          description: 'Connecting entrepreneurs with investors and mentors',
          contact: 'pitch@sydneystartup.net'
        },
        {
          name: 'Gold Coast Fitness Academy',
          description: 'Professional fitness training and wellness programs',
          contact: 'bootcamp@gcfitness.com'
        },
        {
          name: 'Melbourne Photography Institute',
          description: 'Professional photography education and training',
          contact: 'masterclass@melbournephoto.edu'
        },
        {
          name: 'Brisbane Comedy Collective',
          description: 'Showcasing the best local and international comedy talent',
          contact: 'shows@brisbanecomedy.com'
        },
        {
          name: 'Brisbane Tech Events',
          description: 'Leading technology event organizer in Brisbane',
          contact: 'info@brisbanetechevents.com'
        }
      ];

       // Create each organization and verify its creation
       for (const org of organisations) {
        const res = await chai.request(app).post('/api/organisations').send(org);
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('name', org.name);
        expect(res.body).to.have.property('description', org.description);
        expect(res.body).to.have.property('contact', org.contact);
      }
    });
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
          fromDateTime: '2025-07-01T22:00:00.000Z',
          toDateTime: '2025-07-02T13:50:00.000Z',
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
          orgContact: 'info@sydneytechevents.com',
          eventOrgId: 1
        },
        {
          title: 'Winter Music Festival',
          category: 'festival',
          tags: ['music', 'outdoor', 'entertainment'],
          image: 'https://plus.unsplash.com/premium_photo-1661284892176-fd7713b764a6?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          description: 'Three day outdoor music festival',
          fromDateTime: '2025-07-05T06:00:00.000Z',
          toDateTime: '2025-07-24T13:59:00.000Z',
          region: 'Melbourne',
          venue: 'Melbourne Park',
          pricing: [
            { type: 'Single Day', price: 150, numTicketsAvailable: 500 },
            { type: 'Weekend Pass', price: 350, numTicketsAvailable: 300 }
          ],
          refundPolicy: 'No refunds available for festival tickets',
          organiser: 'Melbourne Music Events',
          orgDescription: 'Leading organizer of music festivals in Australia',
          orgContact: 'contact@melbournemusic.com',
          eventOrgId: 2
        },
        {
          title: 'Business Workshop',
          category: 'workshop',
          tags: ['business', 'professional', 'networking'],
          image: 'https://images.unsplash.com/photo-1556741576-1d17b478d761?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          description: 'Professional development and networking event',
          fromDateTime: '2025-07-08T06:00:00.000Z',
          toDateTime: '2025-07-08T11:00:00.000Z',
          region: 'Brisbane',
          venue: 'Brisbane Business Centre',
          pricing: [
            { type: 'Standard', price: 75, numTicketsAvailable: 100 },
            { type: 'Premium', price: 150, numTicketsAvailable: 50 }
          ],
          refundPolicy: '50% refund available up to 7 days before the event',
          organiser: 'Business Growth Australia',
          orgDescription: 'Professional development and business networking organization',
          orgContact: 'info@businessgrowth.com.au',
          eventOrgId: 3
        },
        {
          title: 'Art Exhibition',
          category: 'exhibition',
          tags: ['art', 'culture', 'visual-arts'],
          image: 'https://plus.unsplash.com/premium_photo-1706430433607-48f37bdd71b8?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          description: 'Contemporary art showcase featuring local artists',
          fromDateTime: '2025-07-12T00:00:00.000Z',
          toDateTime: '2025-07-13T07:00:00.000Z',
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
          orgContact: 'exhibitions@pertharts.org',
          eventOrgId: 4
        },
        {
          title: 'Food & Wine Festival',
          category: 'festival',
          tags: ['food', 'wine', 'culinary', 'tasting'],
          image: 'https://plus.unsplash.com/premium_photo-1680086880881-442721afe30c?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          description: 'Celebration of local cuisine and wines',
          fromDateTime: '2025-07-25T04:00:00.000Z',
          toDateTime: '2025-07-27T07:00:00.000Z',
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
          orgContact: 'events@safoodwine.org',
          eventOrgId: 5
        },
        {
          title: 'Startup Pitch Night',
          category: 'conference',
          tags: ['startup', 'entrepreneurship', 'pitching', 'networking'],
          image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          description: 'Entrepreneurs pitch their innovative ideas',
          fromDateTime: '2025-08-08T05:00:00.000Z',
          toDateTime: '2025-08-10T11:00:00.000Z',
          region: 'Sydney',
          venue: 'Sydney Startup Hub',
          pricing: [
            { type: 'General Admission', price: 50, numTicketsAvailable: 200 },
            { type: 'Investor Pass', price: 200, numTicketsAvailable: 50 }
          ],
          refundPolicy: 'No refunds available for pitch night tickets',
          organiser: 'Sydney Startup Network',
          orgDescription: 'Connecting entrepreneurs with investors and mentors',
          orgContact: 'pitch@sydneystartup.net',
          eventOrgId: 6
        },
        {
          title: 'Fitness Bootcamp',
          category: 'workshop',
          tags: ['fitness', 'health', 'training', 'wellness'],
          image: 'https://plus.unsplash.com/premium_photo-1664109999778-84bdb22b883a?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          description: 'Intensive fitness training program',
          fromDateTime: '2025-08-01T21:00:00.000Z',
          toDateTime: '2025-08-02T12:00:00.000Z',
          region: 'Gold Coast',
          venue: 'Gold Coast Sports Centre',
          pricing: [
            { type: 'Single Day', price: 85, numTicketsAvailable: 100 },
            { type: 'Full Program', price: 200, numTicketsAvailable: 50 }
          ],
          refundPolicy: 'Full refund available up to 48 hours before the event',
          organiser: 'Gold Coast Fitness Academy',
          orgDescription: 'Professional fitness training and wellness programs',
          orgContact: 'bootcamp@gcfitness.com',
          eventOrgId: 7
        },
        {
          title: 'Photography Masterclass',
          category: 'workshop',
          tags: ['photography', 'art', 'skills', 'professional'],
          image: 'https://www.khiemng.com/_next/image?url=%2Fimages%2Fgallery%2FMANLY4.jpeg&w=1080&q=75',
          description: 'Learn advanced photography techniques',
          fromDateTime: '2025-08-16T00:00:00.000Z',
          toDateTime: '2025-08-18T08:00:00.000Z',
          region: 'Melbourne',
          venue: 'Melbourne Arts Centre',
          pricing: [
            { type: 'Basic', price: 50, numTicketsAvailable: 50 },
            { type: 'Advanced', price: 100, numTicketsAvailable: 30 },
            { type: 'Equipment Included', price: 799, numTicketsAvailable: 20 }
          ],
          refundPolicy: 'Full refund available up to 7 days before the event',
          organiser: 'Melbourne Photography Institute',
          orgDescription: 'Professional photography education and training',
          orgContact: 'masterclass@melbournephoto.edu',
          eventOrgId: 8
        },
        {
          title: 'Comedy Night',
          category: 'show',
          tags: ['comedy', 'entertainment', 'nightlife'],
          image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          description: 'Stand-up comedy featuring top comedians',
          fromDateTime: '2025-08-22T07:00:00.000Z',
          toDateTime: '2025-08-22T01:59:00.000Z',
          region: 'Brisbane',
          venue: 'Brisbane Comedy Club',
          pricing: [
            { type: 'General Admission', price: 45, numTicketsAvailable: 150 },
            { type: 'VIP Table', price: 150, numTicketsAvailable: 20 }
          ],
          refundPolicy: 'Full refund available up to 24 hours before the show',
          organiser: 'Brisbane Comedy Collective',
          orgDescription: 'Showcasing the best local and international comedy talent',
          orgContact: 'shows@brisbanecomedy.com',
          eventOrgId: 9
        },
        {
          title: 'Developer Conference',
          category: 'conference',
          tags: ['developer', 'programming', 'technology'],
          image: 'https://sm.lifehacker.com/t/lifehacker_au/news/w/which-appl/which-apple-announcements-to-expect-from-wwdc-2025_r87r.2048.jpg',
          description: 'Developer conference featuring top developers and industry leaders',
          fromDateTime: '2025-09-01T07:00:00.000Z',
          toDateTime: '2025-09-01T01:59:00.000Z',
          region: 'Sydney',
          venue: 'Sydney Convention Centre',
          pricing: [
            { type: 'General Admission', price: 45, numTicketsAvailable: 150 },
            { type: 'VIP Table', price: 150, numTicketsAvailable: 20 }
          ],
          refundPolicy: 'Full refund available up to 24 hours before the event',
          organiser: 'Sydney Tech Events',
          orgDescription: 'Leading technology event organizer in Sydney',
          orgContact: 'info@sydneytechevents.com',
          eventOrgId: 1
        },
        {
          title: 'Tech Conference 2025',
          category: 'conference',
          tags: ['technology', 'networking', 'professional'],
          image: 'https://plus.unsplash.com/premium_photo-1679547202671-f9dbbf466db4?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          description: 'Annual technology conference featuring industry leaders',
          fromDateTime: '2025-09-01T07:00:00.000Z',
          toDateTime: '2025-09-01T01:59:00.000Z',
          region: 'Brisbane',
          venue: 'Brisbane Convention Centre',
          pricing: [
            { type: 'General Admission', price: 45, numTicketsAvailable: 150 },
            { type: 'VIP Table', price: 150, numTicketsAvailable: 20 }
          ],
          refundPolicy: 'Full refund available up to 24 hours before the event',
          organiser: 'Brisbane Tech Events',
          orgDescription: 'Leading technology event organizer in Brisbane',
          orgContact: 'info@brisbanetechevents.com',
          eventOrgId: 10
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
        expect(res.body).to.have.property('eventOrgId', event.eventOrgId);
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

  describe('User Creation', () => {
    it('should create multiple users', async () => {
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

      for (const user of users) {
        const res = await chai.request(app).post('/api/users').send(user);
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('name', user.name);
        expect(res.body).to.have.property('role', user.role);
        numUsers++;
      }
    });
  });

  describe('Ticket Management', () => {
    it('should create tickets for multiple registrations', async function() {
      this.timeout(30000); // Increase timeout for multiple ticket creation
      console.log('---------Creating tickets for multiple registrations---------');
      
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
      // Check that all registrations are made
      const ticketsRes = await chai.request(app).get('/api/tickets');
      expect(ticketsRes).to.have.status(200);
      expect(ticketsRes.body.length).to.be.at.least(50);
      numRegistrations = ticketsRes.body.length;
    });
  });

  describe('POST /api/users (organiser accounts)', () => {
    it('should create organiser user accounts for each organisation', async () => {
      const organiserUsers = [
        {
          name: 'Sydney Tech Events',
          email: 'sydneytechevents@org.com',
          password: 'password123',
          role: 'Organiser',
          eventOrgId: 1
        },
        {
          name: 'Melbourne Music Events',
          email: 'melbournemusic@org.com',
          password: 'password123',
          role: 'Organiser',
          eventOrgId: 2
        },
        {
          name: 'Business Growth Australia',
          email: 'businessgrowthaustralia@org.com',
          password: 'password123',
          role: 'Organiser',
          eventOrgId: 3
        },
        {
          name: 'Perth Arts Council',
          email: 'perthartscouncil@org.com',
          password: 'password123',
          role: 'Organiser',
          eventOrgId: 4
        },
        {
          name: 'South Australian Food & Wine Association',
          email: 'safoodwine@org.com',
          password: 'password123',
          role: 'Organiser',
          eventOrgId: 5
        },
        {
          name: 'Sydney Startup Network',
          email: 'sydneystartupnetwork@org.com',
          password: 'password123',
          role: 'Organiser',
          eventOrgId: 6
        },
        {
          name: 'Gold Coast Fitness Academy',
          email: 'gcfitnessacademy@org.com',
          password: 'password123',
          role: 'Organiser',
          eventOrgId: 7
        },
        {
          name: 'Melbourne Photography Institute',
          email: 'melbournephotoinstitute@org.com',
          password: 'password123',
          role: 'Organiser',
          eventOrgId: 8
        },
        {
          name: 'Brisbane Comedy Collective',
          email: 'brisbanecomedycollective@org.com',
          password: 'password123',
          role: 'Organiser',
          eventOrgId: 9
        },
        {
          name: 'Brisbane Tech Events',
          email: 'brisbanetechevents@org.com',
          password: 'password123',
          role: 'Organiser',
          eventOrgId: 10
        }
      ];

      for (const user of organiserUsers) {
        const res = await chai.request(app).post('/api/users').send(user);
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('name', user.name);
        expect(res.body).to.have.property('email', user.email);
        expect(res.body).to.have.property('role', 'Organiser');
        numOrganisers++;
      }
      console.log('---------Organisers created ' + numOrganisers + '---------');
      console.log('---------Users created ' + numUsers + '---------');
      console.log('---------Regristraions made ' + numRegistrations + '---------');
    });
  });
});