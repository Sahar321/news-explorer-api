/*eslint-disable*/
const { isEmail } = require('validator');
const mongoose = require('mongoose');
const bycript = require('bcryptjs');
const UnauthorizedError = require('../constant/errors/UnauthorizedError');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => isEmail(email),
      message: (props) => `${props.value} is not a valid email`,
    },
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },

  avatar: {
    type: String,
    required: false,
    minLength: 2,
    maxLength: 300,
  },
  username: {
    type: String,
    required: false,
    minLength: 2,
    maxLength: 30,
  },
  phone: {
    type: String,
    required: false,
    minLength: 2,
    maxLength: 30,
  },
  motto: {
    type: String,
    required: false,
    minLength: 2,
    maxLength: 30,
  },
  city: {
    type: String,
    required: false,
    minLength: 2,
    maxLength: 30,
  },
  address: {
    type: String,
    required: false,
    minLength: 2,
    maxLength: 30,
  },
  country: {
    type: String,
    required: false,
    minLength: 2,
    maxLength: 30,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password ) {
  return this.findOne({ email })
    .select('password')
    .then((user) => {
      if (!user) {
        // user not found:  not given the real reason to user for security purpose
        throw new UnauthorizedError('The username or password is incorrect');
      }

      return bycript.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedError('The username or password is incorrect');
        }
        return user;
      });
    });
};

userSchema.statics.emailAuth0 = function emailAuth0(email) {
  return this.findOne({ email }).then((user) => {
    if (!user) {
      // user not found:  not given the real reason to user for security purpose
      throw new UnauthorizedError('The username or password is incorrect');
    }
    return user;
  });
};
module.exports = mongoose.model('user', userSchema);
