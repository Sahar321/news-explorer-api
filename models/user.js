const { isEmail } = require('validator');
const mongoose = require('mongoose');
const bycript = require('bcryptjs');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validates: {
      validator: (email) => isEmail(email),
      message: 'Invalid email',
    },
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return this.findOne({ email })
    .select('password')
    .then((user) => {
      if (!user) {
        // user not found:  not given the real reason to user for security purpose
        throw new Error('The username or password is incorrect');
      }

      return bycript.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new Error('The   username or password is incorrect');
        }
        return user;
      });
    });
};
module.exports = mongoose.model('user', userSchema);
