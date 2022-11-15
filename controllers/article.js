/*  eslint no-underscore-dangle: ['error', { 'allow': ['_id'] }] */
const { ObjectId } = require('mongodb');
const Article = require('../models/article');
const NotFoundError = require('../middleware/errors/NotFoundError');
const ForbiddenError = require('../middleware/errors/ForbiddenError');

const getSavedArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .orFail(() => {
      throw new NotFoundError('Not found Articles');
    })
    .then((Articles) => {
      res.send(Articles);
    })
    .catch((err) => {
      next(err);
    });
};

const createNewArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;

  const owner = req.user._id;

  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner,
  })
    .then((createdArticle) => {
      Article.findOne(createdArticle._id) // omit the owner filed
        .then((article) => res.status(201).send(article))
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};
const deleteArticleById = (req, res, next) => {
  Article.findOneAndRemove({
    _id: ObjectId(req.params.articleId),
    owner: ObjectId(req.user._id),
  })
    .orFail(() => {
      throw new ForbiddenError(
        'You do not have permissions to delete this Article'
      );
    })
    .then((article) => {
      res.send(article);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getSavedArticles,
  createNewArticle,
  deleteArticleById,
};
