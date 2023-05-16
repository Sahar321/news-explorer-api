/*eslint-disable*/
const jwt = require('jsonwebtoken');
const bycript = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user');
const { developmentJwtSecret } = require('../constant/config');
const ConflictError = require('../constant/errors/ConflictError');
const NotFoundError = require('../constant/errors/NotFoundError');

const { JWT_SECRET = developmentJwtSecret } = process.env;

async function verify(req) {
  const client = new OAuth2Client(req.body.clientId);
  const ticket = await client.verifyIdToken({
    idToken: req.body.credential,
    audience: req.body.clientId,
  });
  const payload = ticket.getPayload();
  return payload;
}
async function loginWithGoogle(req, res, next) {
  const data = await verify(req);
  User.emailAuth0(data.email)
    .then((user) => {
      const jwtToken = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      return res.send({ token: jwtToken });
    })
    .catch((err) => next(err));
}

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

const updateAvatar = (req, res, next) => {
  const { link } = req.body;
  User.findOneAndUpdate({ _id: req.user._id }, { avatar: link }, { new: true })
    .orFail(() => {
      throw new NotFoundError('User not exist');
    })
    .then((user) => {
      const { _id, email, name, avatar } = user;
      res.send({
        _id,
        email,
        name,
        avatar,
      });
    })
    .catch((err) => next(err));
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
  loginWithGoogle,
  getUserInfo,
  updateAvatar,
};
