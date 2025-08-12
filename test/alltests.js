const dotenv = require('dotenv');
const env = process.env.NODE_ENV || 'testing';
dotenv.config({ path: process.env.PWD + '/' + env + '.env' });
global.logger = require('../server/util/logger');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
chai.use(chaiHttp);
const request = require('supertest');
request(app);

// Auth
require('../server/services/products/test/products.test');

describe('Stop server in end', () => {
    it('Server should stop manually to get code coverage', done => {
        app.close();
        process.exit();
        done();
    });
});
