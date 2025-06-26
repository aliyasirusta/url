// app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config();


const urlRoutes = require('./routes/urlRoutes');

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/url', urlRoutes);


app.get('/', (req, res) => {
  res.send('URL Shortener API Çalışıyor!');
});

module.exports = app;
