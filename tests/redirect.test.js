const request = require('supertest');
const app = require('../app');
const pool = require('../src/config/database');

let shortCode = '';

beforeAll(async () => {
  const res = await request(app)
    .post('/api/url/shorten')
    .send({ original_url: 'https://example.com' });

  shortCode = res.body.short_code;
});

afterAll(async () => {
  await pool.query('DELETE FROM analytics');
  await pool.query('DELETE FROM urls');
  await pool.end();
});

describe('Redirect API', () => {
  it('should redirect to original URL', async () => {
    const res = await request(app).get(`/api/url/${shortCode}`);
    expect(res.statusCode).toBe(302); // HTTP 302 = redirect
    expect(res.header.location).toBe('https://example.com');
  });

  it('should return 404 for invalid code', async () => {
    const res = await request(app).get(`/api/url/invalid123`);
    expect(res.statusCode).toBe(404);
  });
});
