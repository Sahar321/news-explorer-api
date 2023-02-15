require('dotenv').config();
// 3rd party
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const { limiter } = require('./constant/constant');
const handleMainError = require('./middleware/handleMainError');
const { developmentDatabaseAddress } = require('./constant/config');
// app
const router = require('./routes/router');

const { requestLogger, errorLogger } = require('./middleware/logger');

const app = express();
const { PORT = 3001 } = process.env;
// if .env not exist(=development mode) use default database address.
const { DATABASE_ADDRESS = developmentDatabaseAddress } = process.env;

app.use(requestLogger);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.options('*', cors());
app.use(limiter);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(handleMainError);

// database
mongoose.connect(DATABASE_ADDRESS);

app.listen(PORT);
