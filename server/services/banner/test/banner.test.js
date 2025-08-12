const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const assert = chai.assert;
const request = require('supertest');
const TestCase = require('./banner');
chai.use(chaiHttp);

describe('Banner Cases', () => {
    try {
        it('Get Banner', (done) => {
            request(process.env.BASE_URL)
                .get('/banner/1')
                .end((err, res) => {
                    expect(res.body.status).to.be.status;
                    assert.equal(res.statusCode, 200);
                    done();
                });
        });
        it('Invalid Routes', (done) => {
            request(process.env.BASE_URL)
                .get('/banners/1')
                .end((err, res) => {
                    expect(res.body.status).to.be.status;
                    assert.equal(res.statusCode, 404);
                    done();
                });
        });
    } catch (exception) {
        CONSOLE_LOGGER.error(exception);
    }
});
