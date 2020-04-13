const request = require('supertest');
const expect = require('chai').expect;
const app = require('../app');

describe('roles controller', function() {
    it('should return array of roles', () => {
        return request(app)
            .get('/hud/api/roles/procedures_EVA1.yml')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .then(async (res) => {
                expect(res.body).to.be.an('array');
            });
    });
    it('should return 404 File Not Found', () => {
        return request(app)
            .get('/hud/api/roles/procedures_MISSING.yml')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(404)
    });
});