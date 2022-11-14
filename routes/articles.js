const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getAllArticles, createNewArticle, deleteArticleById } = require('../controllers/article');

const ValidationSchema = {
  createNewArticle: celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().required().min(2).max(30),
        link: Joi.string().required().uri(),
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
