const jwt = require('jsonwebtoken');
const bycript = require('bcryptjs');
const User = require('../models/user');
const defaultJwtSecret = require('../constant/constant');
const ConflictError = require('../constant/errors/ConflictError');
const NotFoundError = require('../constant/errors/NotFoundError');

const { JWT_SECRET = defaultJwtSecret } = process.env;

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const jwtToken = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      return res.send({ token: jwtToken });
    })
    .catch((err) => next(err));
};
const registerNewUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bycript
    .hash(password, 10)
    .then((hashed) => {
      User.create({ email, password: hashed, name })
        .then((user) => {
          res.status(201).send({ _id: user._id, email: user.email });
        })
        .catch(() => {
          next(new ConflictError('email is already exist'));
        });
    })
    .catch((err) => {
      next(err);
    });
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('User not exist');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => next(err));
};

module.exports = {
  registerNewUser,
  login,
  getUserInfo,
};
