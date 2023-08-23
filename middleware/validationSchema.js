const { celebrate, Joi } = require('celebrate');

const ValidationSchema = {
  article: {
    createNewArticle: celebrate({
      body: Joi.object().keys({
        keyword: Joi.string().required(),
        title: Joi.string().required(),
        text: Joi.string().required(),
        date: Joi.string().required(),
        source: Joi.string().required(),
        link: Joi.string().required().uri(),
        image: Joi.string().required().uri(),
      }).unknown(true),
    }),
    articleId: celebrate({
      params: Joi.object().keys({
        articleId: Joi.string().hex().required(),
      }),
    }),
  },
  signin: celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  signinWithGoogle: celebrate({
    body: Joi.object().keys({
    }),
  }),
  signup: celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  validateNews: celebrate({
    query: Joi.object().keys({
      q: Joi.string().trim().required(),
      pageSize: Joi.number().greater(0).less(101),
    }).unknown(true),
  }),
  profile: celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      avatar: Joi.string().uri(),
      username: Joi.string().min(2).max(30),
      phone: Joi.string().min(5).max(15),
      motto: Joi.string().min(2).max(30),
      city: Joi.string().min(2).max(30),
      address: Joi.string().min(2).max(30),
      country: Joi.string().min(2).max(30),

    }),
  }),
};

module.exports = ValidationSchema;
