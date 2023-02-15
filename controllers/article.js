const Article = require('../models/article');
const NotFoundError = require('../constant/errors/NotFoundError');
const ForbiddenError = require('../constant/errors/ForbiddenError');

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
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;

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
  Article.findById(req.params.articleId)
    .orFail(() => {
      throw new NotFoundError('Article not found with that id.');
    })
    .then((article) => {
      if (article.owner.toString() === req.user._id) {
        article.remove(() => res.send(article));
      } else {
        throw new ForbiddenError('You do not have permissions to delete this Article');
      }
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
