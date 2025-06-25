const request = require('supertest');
const app = require('../app');

describe('URL Shorten API', () => {
  it('should shorten a valid URL', async () => {
    const res = await request(app)
      .post('/api/url/shorten')
      .send({ original_url: 'https://google.com' });

    expect(res.statusCode).toBe(201);
    expect(res.body.short_url).toBeDefined();
  });

  it('should reject invalid URL', async () => {
    const res = await request(app)
      .post('/api/url/shorten')
      .send({ original_url: 'invalid-url' });

    expect(res.statusCode).toBe(400);
  });
});
