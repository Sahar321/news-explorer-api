require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const router = require('./routes/router');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(router);
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/newsExplorer');
app.listen(PORT);
