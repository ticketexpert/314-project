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
  before(async () => {
    await User.destroy({ where: {}, truncate: true }); // Clear the users table
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
    });
  });

  describe('GET /api/users', () => {
    it('should get all users', async () => {
      const res = await chai.request(app).get('/api/users?userId=1');
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body[0]).to.have.property('name', 'johnTest');
      console.log(res.body);
    });
  });
});