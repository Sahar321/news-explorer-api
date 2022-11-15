const { isCelebrateError } = require('celebrate');

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

module.exports = handleMainError;
