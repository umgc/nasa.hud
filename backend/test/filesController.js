const request = require('supertest');
const expect = require('chai').expect;
const app = require('../app');

describe('api index', function() {
    it('should return welcome text', function(done) {
        request(app)
            .get('/hud/api')
            .expect('Content-Type', 'image/png')
            .expect(200, done)
    });
});

describe('files controller', function() {
    it('should return array of filenames', () => {
        return request(app)
            .get('/hud/api/getfiles')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .then(async (res) => {
                expect(res.body).to.be.an('array');
            });
    });
    it('should return 200 OK for valid file', function(done) {
        request(app)
            .get('/hud/api/lint/procedures_EVA1.yml')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200, done)
    });
    it('should return 404 File Not Found', function(done) {
        request(app)
            .get('/hud/api/lint/procedures_NotFound.yml')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(404, done)
    });
    it('should return 422 Unparseable File', function(done) {
        request(app)
            .get('/hud/api/lint/procedures_MALFORMED.yml')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(422, done)
    });
    it('should return an image file', function(done) {
        request(app)
            .get('/hud/api/getimage/maestro-hud-logo.png')
            .expect('Content-Type', 'image/png')
            .expect(200, done)
    });
    it('should return 404 File Not Found', function(done) {
        request(app)
            .get('/hud/api/getimage/not-a-real-image.png')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(404, done)
    })
});
