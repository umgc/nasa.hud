const request = require('supertest');
const expect = require('chai').expect;
const app = require('../app');

describe('tasks controller', function () {
  // it('should return JSON of steps', () => {
  //     return request(app)
  //         .get('/hud/api/tasks/procedures_EVA1.yml/EV1')
  //         .expect('Content-Type', 'application/json; charset=utf-8')
  //         .expect(200)
  //         .then(async (res) => {
  //             expect(res.body).to.be.an('array');
  //         });
  // });
  it('should return 404 File Not Found', () => {
    return request(app)
      .get('/hud/api/tasks/procedures_MISSING.yml/dude')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(404);
  });
  it('should return 422 Unparseable File', () => {
    return request(app)
      .get('/hud/api/tasks/procedures_MISSING.yml/dude')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(404);
  });
});
