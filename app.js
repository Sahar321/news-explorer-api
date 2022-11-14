require('dotenv').config();
// 3rd party
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors, isCelebrateError } = require('celebrate');
const cors = require('cors');
const { limiter } = require('./constant/constant');
// app
const router = require('./routes/router');

const { requestLogger, errorLogger } = require('./middleware/logger');

const app = express();
const { PORT = 3000 } = process.env;
// if .env not exist(=development mode) use default database address.
const { DATABASE_ADDRESS = 'mongodb://localhost:27017/newsExplorer' } = process.env;

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
mongoose.connect(DATABASE_ADDRESS);

app.listen(PORT);
