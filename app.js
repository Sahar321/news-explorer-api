require('dotenv').config();
// 3rd party
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors, isCelebrateError } = require('celebrate');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
// app
const router = require('./routes/router');
const TooManyRequestsError = require('./middleware/errors/TooManyRequestsError');
const { requestLogger, errorLogger } = require('./middleware/logger');

const app = express();
const { PORT = 3000 } = process.env;
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

const handleMainError = (err, req, res, next) => {
  let { statusCode = 500 } = err;
  const { message } = err;
  // change status code if is CelebrateError, otherwise
  // it will send the default error message
  if (isCelebrateError(err)) {
    statusCode = 400;
  }

  res.status(statusCode).send({
    message: statusCode === 500 ? 'An error occurred on the server' : message,
  });
};
// 3rd party
app.use(requestLogger);
app.use(errorLogger);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.options('*', cors());
app.use(limiter);
app.use(errors());

// app
app.use(router);
app.use(handleMainError);

// database
mongoose.connect('mongodb://localhost:27017/newsExplorer');

app.listen(PORT);
