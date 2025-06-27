// app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimiter = require('./middleware/rateLimiter');

require('dotenv').config();


const urlRoutes = require('./routes/urlRoutes');

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(rateLimiter);

app.use('/api/url', urlRoutes);
app.use('/api/url/shorten', rateLimiter);
app.use('/api/', rateLimiter);



app.get('/', (req, res) => {
  res.send('URL Shortener API Çalışıyor!');
});

module.exports = app;
