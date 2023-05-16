// middleware/logger.js
/*eslint-disable*/
const winston = require('winston');
const expressWinston = require('express-winston');

const formatRules = winston.format.combine(
  winston.format.colorize(),
  winston.format.json(),
  winston.format.prettyPrint(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.ms(),
  winston.format.errors(),
);

const requestLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: 'logs/request.log' })],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json(),
  ),meta:"asdzaasc",
});

const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: 'logs/error.log' })],
  format: formatRules,
});

module.exports = {
  requestLogger,
  errorLogger,
};
