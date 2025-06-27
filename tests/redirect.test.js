const request = require('supertest');
const app = require('../app');
const pool = require('../src/config/database');

describe('Redirect API', () => {
  let shortCode;

  beforeAll(async () => {
    
    const result = await pool.query(
      'INSERT INTO urls (original_url, short_code) VALUES ($1, $2) RETURNING short_code',
      ['https://example.com', 'test123']
    );
    shortCode = result.rows[0].short_code;
  });

  afterAll(async () => {
    
    await pool.query('DELETE FROM analytics WHERE url_id IN (SELECT id FROM urls WHERE short_code = $1)', [shortCode]);
    await pool.query('DELETE FROM urls WHERE short_code = $1', [shortCode]);
    await pool.end();
  });

  it('should redirect to original URL', async () => {
    const res = await request(app).get(`/api/url/${shortCode}`);
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('https://example.com');
  });

  it('should return 404 for unknown short code', async () => {
    const res = await request(app).get('/api/url/unknowncode');
    expect(res.statusCode).toBe(404);
  });
});
