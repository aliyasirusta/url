const pool = require('../config/database');
const { generateShortCode } = require('../utils/shortCodeGenerator');
const QRCode = require('qrcode');


const shortenUrl = async (req, res) => {
  const { original_url, custom_alias } = req.body;

  if (!original_url || !original_url.startsWith('http')) {
    return res.status(400).json({ error: 'Geçerli bir URL giriniz.' });
  }

  const short_code = custom_alias || generateShortCode(6);

  try {
    const existing = await pool.query(
      'SELECT * FROM urls WHERE short_code = $1',
      [short_code]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Bu kısa isim zaten kullanılıyor.' });
    }

    const result = await pool.query(
      'INSERT INTO urls (original_url, short_code, custom_alias) VALUES ($1, $2, $3) RETURNING *',
      [original_url, short_code, custom_alias || null]
    );

    return res.status(201).json({
      short_url: `${req.protocol}://${req.get('host')}/api/url/${short_code}`,
      ...result.rows[0],
    });
  } catch (err) {
    console.error('Shorten URL Error:', err);
    return res.status(500).json({ error: 'Sunucu hatası.' });
  }
};

const redirectUrl = async (req, res) => {
  const { short_code } = req.params;

  try {
    const urlResult = await pool.query(
      'SELECT * FROM urls WHERE short_code = $1 AND is_active = true',
      [short_code]
    );

    if (urlResult.rows.length === 0) {
      return res.status(404).json({ error: 'URL bulunamadı veya pasif durumda.' });
    }

    const url = urlResult.rows[0];

    if (url.expires_at && new Date(url.expires_at) < new Date()) {
      return res.status(410).json({ error: 'Link süresi dolmuş.' });
    }

    await pool.query(
      'UPDATE urls SET click_count = click_count + 1 WHERE id = $1',
      [url.id]
    );

    await pool.query(
      `INSERT INTO analytics (url_id, ip_address, user_agent, referer)
       VALUES ($1, $2, $3, $4)`,
      [
        url.id,
        req.ip || req.headers['x-forwarded-for'] || 'unknown',
        req.headers['user-agent'] || '',
        req.headers.referer || '',
      ]
    );

    return res.redirect(url.original_url);
  } catch (err) {
    console.error('Redirect Error:', err);
    return res.status(500).json({ error: 'Sunucu hatası.' });
  }
};
const generateQrCode = async (req, res) => {
  const { short_code } = req.params;

  try {
    const urlResult = await pool.query(
      'SELECT * FROM urls WHERE short_code = $1 AND is_active = true',
      [short_code]
    );

    if (urlResult.rows.length === 0) {
      return res.status(404).json({ error: 'URL bulunamadı veya pasif durumda.' });
    }

    const fullUrl = `${req.protocol}://${req.get('host')}/api/url/${short_code}`;

    const qrPng = await QRCode.toBuffer(fullUrl, { type: 'png' });

    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': qrPng.length
    });
    res.end(qrPng);

  } catch (err) {
    console.error('QR Code Generation Error:', err);
    return res.status(500).json({ error: 'Sunucu hatası.' });
  }
};


module.exports = { shortenUrl, redirectUrl, generateQrCode };
