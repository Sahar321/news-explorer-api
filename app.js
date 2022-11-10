require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const router = require('./routes/router');

const app = express();
app.use(router);
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/newsExplorer');
app.listen(PORT);