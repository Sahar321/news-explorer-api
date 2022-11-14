const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getAllArticles, createNewArticle, deleteArticleById } = require('../controllers/article');

const ValidationSchema = {
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
};

router.get('/articles', getAllArticles);
router.post('/articles', ValidationSchema.createNewArticle, createNewArticle);
router.delete('/articles/:articleId', ValidationSchema.articleId, deleteArticleById);

module.exports = router;
