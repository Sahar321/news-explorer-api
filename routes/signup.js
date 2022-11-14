const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { registerNewUser } = require('../controllers/users');

const ValidationSchema = {
  signup: celebrate({
    body: Joi.object()
      .keys({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
        name: Joi.string().required(),
      })
      .unknown(true),
  }),
};
router.post('/signup', ValidationSchema.signup, registerNewUser);
module.exports = router;
