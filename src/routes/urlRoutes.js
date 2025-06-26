const express = require('express');
const router = express.Router();
const { shortenUrl, redirectUrl, generateQrCode  } = require('../controllers/urlController');

router.post('/shorten', shortenUrl);
router.get('/:short_code', redirectUrl); 
router.get('/:short_code/qr', generateQrCode);


module.exports = router;
