const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const assert = chai.assert;
const request = require('supertest');
const TestCase = require('./products');
chai.use(chaiHttp);

describe('Products Cases', () => {
    try {
        it('Get all Products', (done) => {
            request(process.env.BASE_URL)
                .get('/product/lists')
                .end((err, res) => {
                    expect(res.body.status).to.be.status;
                    assert.equal(res.statusCode, 200);
                    done();
                });
        });
        it('Invalid Routes', (done) => {
            request(process.env.BASE_URL)
                .get('/products/lists')
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
