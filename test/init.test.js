
const request = require('supertest');
const app = require('../server/server');
request(app);
const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const expect = chai.expect;
chai.use(chaiHttp);

describe('Base Route', () => {
    try {
        it('Check Base Route', (done) => {
            request(process.env.BASE_URL)
                .get('/')
                .end((err, res) => {
                    expect(res.body.status).to.be.status;
                    assert.equal(res.statusCode, 200);
                    done();
                });
        });
        it('Invalid Base Routes', (done) => {
            request(process.env.BASE_URL)
                .get('/products')
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