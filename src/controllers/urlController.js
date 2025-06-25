// src/controllers/urlController.js
const pool = require('../config/database');
const { generateShortCode } = require('../utils/shortCodeGenerator');

const shortenUrl = async (req, res) => {
  const { original_url } = req.body;

  if (!original_url || !original_url.startsWith('http')) {
    return res.status(400).json({ error: 'Geçerli bir URL giriniz.' });
  }

  const short_code = generateShortCode(6);

  try {
    const result = await pool.query(
      'INSERT INTO urls (original_url, short_code) VALUES ($1, $2) RETURNING *',
      [original_url, short_code]
    );

    return res.status(201).json({
      short_url: `${req.protocol}://${req.get('host')}/api/url/${short_code}`,
      ...result.rows[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Sunucu hatası.' });
  }
};

module.exports = { shortenUrl };
