const { celebrate, Joi } = require('celebrate');

const ValidationSchema = {
  article: {
    createNewArticle: celebrate({
      body: Joi.object()
        .keys({
          keyword: Joi.string().required(),
          title: Joi.string().required(),
          text: Joi.string().required(),
          date: Joi.string().required(),
          source: Joi.string().required(),
          link: Joi.string().required().uri(),
          image: Joi.string().required().uri(),
        })
        .unknown(true),
    }),
    articleId: celebrate({
      params: Joi.object()
        .keys({
          articleId: Joi.string().hex().required(),
        })
        .unknown(true),
    }),
  },
  signin: celebrate({
    body: Joi.object()
      .keys({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
      })
      .unknown(true),
  }),
  signup: celebrate({
    body: Joi.object()
      .keys({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
        name: Joi.string().required().min(2).max(30),
      })
      .unknown(true),
  }),
};

module.exports = ValidationSchema;
