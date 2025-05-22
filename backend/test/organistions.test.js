const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const app = require('../app');
const Organisation = require('../models/organisations');
const { sequelize } = require('../models');

describe('Organisations API', () => {
  before(async function() {
    this.timeout(5000); // Increase timeout to 5 seconds
    await sequelize.sync(); // Sync without force: true
  });

  describe('POST /api/organisations', () => {
    it('should create all organizations referenced in events', async () => {
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

  describe('GET /api/organisations', () => {
    it('should retrieve all organizations', async () => {
      const res = await chai.request(app).get('/api/organisations');
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(9); // Verify we have all 9 organizations
    });
  });
});

