require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors, isCelebrateError } = require('celebrate');
const router = require('./routes/router');

const app = express();
const { PORT = 3000 } = process.env;
const { requestLogger, errorLogger } = require('./middleware/logger');

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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(errors());
app.use(requestLogger);
app.use(router);
app.use(errorLogger);
app.use(handleMainError);

mongoose.connect('mongodb://localhost:27017/newsExplorer');
app.listen(PORT);
