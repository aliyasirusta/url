const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redisClient = require('../config/redis');

const limiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
  }),
  windowMs: 60 * 1000, 
  max: 5, 
  message: {
    error: 'Çok fazla istek gönderdiniz. Lütfen 1 dakika sonra tekrar deneyin.'
  }
});

module.exports = limiter;
