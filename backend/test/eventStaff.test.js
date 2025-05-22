const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../app');

chai.use(chaiHttp);

describe('Event Staff', () => {
  it('should create a new staff member', (done) => {
    chai.request(app)
      .post('/api/eventStaff')
      .send({
        name: 'John Doe',
        role: 'admin',
        username: 'johndoe',
        password: 'securepassword123'
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('staffId');
        expect(res.body).to.have.property('name');
        expect(res.body).to.have.property('role');
        expect(res.body).to.have.property('username');
        done();
      });
  });
});