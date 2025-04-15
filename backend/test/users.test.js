const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const app = require('../app'); // This is just a boilerplate but it keeps it working 
const User = require('../models'); // Sequelize model
const { sequelize } = require('../models'); // Sequelize instance

//This one is just testing mocha and chai are working and return when run
describe('Sample Test Suite', () => {
  it('should return true', () => {
    expect(true).to.be.true;
  });
});

describe('Users API', () => {
  before(async () => {
    await sequelize.sync({ force: true }); // Reset DB before tests
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const newUser = {
        id: '1',
        username: 'johndoe',
        email: 'john.doe@example.com',
        password: 'securepassword123',
        firstName: 'John',
        lastName: 'Doe'
      };

      const res = await chai.request(app).post('/api/users').send(newUser);
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('username', newUser.username);
    });
  });
});