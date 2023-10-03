/*eslint-disable*/
const jwt = require('jsonwebtoken');
const bycript = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user');
const { developmentJwtSecret } = require('../constant/config');
const ConflictError = require('../constant/errors/ConflictError');
const NotFoundError = require('../constant/errors/NotFoundError');
const axios = require('axios');
const user = require('../models/user');
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

function generateJwtToken(user) {
  const jwtToken = jwt.sign({ _id: user._id }, JWT_SECRET, {
    expiresIn: '7d',
  });

  return jwtToken;
}

async function loginWithFacebook(req, res, next) {
  const userAccessToken = req.body.accessToken;

  if (!userAccessToken) {
    next(new Error('Invalid facebook token'));
  }

  const fbGraphAPIUrl = `https://graph.facebook.com/v17.0/me?fields=id,name,email,picture.width(320).height(320)&access_token=${userAccessToken}`;

  try {
    const { data } = await axios.get(fbGraphAPIUrl);

    const dataForAuth = {
      email: data.email,
      name: data.name,
    };
    User.emailAuth0(dataForAuth, 'facebook')
      .then((user) => {
        return res.send({ token: generateJwtToken(user) });
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  } catch (error) {
    next('Error fetching facebook user info');
  }
}
async function loginWithGoogle(req, res, next) {
  const data = await verify(req);

  const dataForAuth = {
    email: data.email,
    name: data.name,
  };
  User.emailAuth0(dataForAuth, 'google')
    .then((user) => {
      return res.send({ token: generateJwtToken(user) });
    })
    .catch((err) => next(err));
}

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      return res.send({ token: generateJwtToken(user) });
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

const updateProfile = (req, res, next) => {
  const { avatar, name, username, phone, motto, city, address, country } =
    req.body;
  User.findOneAndUpdate(
    { _id: req.user._id },
    { avatar, name, username, phone, motto, city, address, country },
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError('User not exist');
    })
    .then((user) => {
      const {
        _id,
        avatar,
        name,
        username,
        phone,
        motto,
        city,
        address,
        country,
      } = user;
      res.send({
        _id,
        avatar,
        name,
        username,
        phone,
        motto,
        city,
        address,
        country,
      });
    })
    .catch((err) => next(err));
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .lean()
    .orFail(() => {
      throw new NotFoundError('User not exist');
    })
    .then((user) => {
      // remove props
      const { password, updatedAt, needsPassword, createdAt, ...restProps } =
        user;

      res.send(restProps);
    })
    .catch((err) => next(err));
};

module.exports = {
  registerNewUser,
  login,
  loginWithGoogle,
  getUserInfo,
  updateProfile,
  loginWithFacebook,
};
