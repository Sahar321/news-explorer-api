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
  needsPassword: {
    type: Boolean,
    default: true,
  },

  password: {
    type: String,
    required: function () {
      return this.needsPassword;
    },
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
  registerType: {
    type: String,
    enum: ['email', 'facebook', 'google'],
    default: 'email',
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .lean()
    .then((user) => {
      if (!user) {
        // user not found:  not given the real reason to user for security purpose
        throw new UnauthorizedError('The username or password is incorrect');
      }
      if (!user.needsPassword) {
        // user found but not given the real reason to user for security purpose
        throw new UnauthorizedError(
          '+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++you was register with social media login, right now you can not login with email and password'
        );
        //throw new UnauthorizedError('The username or password is incorrect');
      }
      return bycript.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedError('The username or password is incorrect');
        }

        return user._id;
      });
    });
};

//findOrCreateUserByEmail
userSchema.statics.emailAuth0 = async function emailAuth0(
  { email, name },
  registerType
) {
  try {
    let user = await this.findOne({ email }).lean();

    if (!user) {
      // If user is not found, create a new user
      try {
        user = await this.create({
          email,
          name,
          registerType,
          needsPassword: false,
        });
      } catch (createErr) {
        // Log error and rethrow to ensure the outer catch block handles it
        console.error('Error creating user:', createErr);
        throw createErr;
      }
    }

    return user;
  } catch (err) {
    console.error('Error in emailAuth0:', err);
    // Consider re-throwing the error or handling it as per your application's requirements
    throw err; // Uncomment if you want to propagate the error further
  }
};

module.exports = mongoose.model('user', userSchema);
