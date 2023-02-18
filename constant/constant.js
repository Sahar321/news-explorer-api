const rateLimit = require('express-rate-limit');
const TooManyRequestsError = require('./errors/TooManyRequestsError');

const limiter = rateLimit({
  // max 100 request per 10 minutes
  windowMs: 10 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: () => {
    throw new TooManyRequestsError();
  },
});

module.exports = { limiter };
