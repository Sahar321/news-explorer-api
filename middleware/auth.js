const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../constant/errors/UnauthorizedError');
const { developmentJwtSecret } = require('../constant/config');

const authorized = (req, res, next) => {
  // if JWT_SECRET not exist, use the default dev key - for development only!
  const { JWT_SECRET = developmentJwtSecret } = process.env;
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError();
  }

  const token = authorization.replace('Bearer ', '');

  // if token is verified, save the payload
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // otherwise, return an error
    throw new UnauthorizedError('invalid token');
  }

  /* Save payload to request. This makes the payload available
   to the latter parts of the route. See the `Accessing user
   data with req.user` example for details. */
  req.user = payload;

  // sending the request to the next middleware
  next();
};

// this middleware is for both authorized and unauthorized users
// it will not throw an error if the user is not authorized
// and save the payload to req.user if the user is authorized
const all = (req, res, next) => {
  // if JWT_SECRET not exist, use the default dev key - for development only!
  const { JWT_SECRET = developmentJwtSecret } = process.env;
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next();
  }

  const token = authorization.replace('Bearer ', '');

  // if token is verified, save the payload
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // otherwise, return an error
    throw new UnauthorizedError('invalid token');
  }

  /* Save payload to request. This makes the payload available
   to the latter parts of the route. See the `Accessing user
   data with req.user` example for details. */
  req.user = payload;

  // sending the request to the next middleware
  next();
};
module.exports = { authorized, all };
