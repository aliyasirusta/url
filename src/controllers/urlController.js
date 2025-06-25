exports.shortenUrl = (req, res) => {
  
  const { original_url } = req.body;

  if (!original_url) {
    return res.status(400).json({ error: 'original_url is required' });
    
  }

  const shortCode = 'abc123';

  res.status(201).json({
    short_code: shortCode,
    original_url,
  });
  const redirectUrl = async (req, res) => {
  const { short_code } = req.params;

  try {
    
    const result = await pool.query(
      'SELECT * FROM urls WHERE short_code = $1 AND is_active = true',
      [short_code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'URL bulunamadı veya süresi dolmuş.' });
    }

    const urlData = result.rows[0];

    
    await pool.query(
      'UPDATE urls SET click_count = click_count + 1 WHERE id = $1',
      [urlData.id]
    );

    
    const { ip } = req;
    const userAgent = req.get('User-Agent') || '';
    const referer = req.get('Referer') || '';

    await pool.query(
      `INSERT INTO analytics (url_id, ip_address, user_agent, referer) VALUES ($1, $2, $3, $4)`,
      [urlData.id, ip, userAgent, referer]
    );

   
    return res.redirect(urlData.original_url);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Sunucu hatası.' });
  }
};


module.exports = { shortenUrl, redirectUrl };
};
