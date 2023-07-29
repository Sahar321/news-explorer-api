/* eslint-disable*/
const Article = require('../models/article');
const NotFoundError = require('../constant/errors/NotFoundError');
const ForbiddenError = require('../constant/errors/ForbiddenError');
const commen = require('../models/comment');
const ThankYou = require('../models/thankYou');
const reaction = require('../models/reaction');
const user = require('../models/user');
const { Buffer } = require('buffer');
const getAllArticleComments = (req, res, next) => {
  const articleId = Buffer.from(req.params.articleId, 'base64').toString(
    'utf8'
  );
  commen
    .find({
      link: articleId,
    })
    .lean()
    .then((comments) => {
      userIds = comments.map((comment) => comment.owner);
      user.find({ _id: { $in: userIds } }).then((users) => {
        const formattedComments = comments.map((comment) => {
          const { _id: commentId, link, owner, text, date, rating } = comment;
          const user = users.find(
            (user) => user._id.toString() === owner.toString()
          );
          const { name: username, avatar } = user;
          return {
            id: commentId,
            link,
            username,
            text,
            date,
            rating,
            avatar,
            owner,
          };
        });
        res.status(201).send(formattedComments);
      });
    })
    .catch((err) => next(err));
};
const getAllArticleReaction = async (req, res, next) => {
  try {
    const articleId = Buffer.from(req.params.articleId, 'base64').toString(
      'utf8'
    );
    const reactions = await reaction.find({ link: articleId });
    const userIds = reactions.map((reaction) => reaction.owner);
    const users = await user.find({ _id: { $in: userIds } });
    const formattedReactions = await Promise.all(
      reactions.map(async (reaction) => {
        const { link, owner, reactionId, text } = reaction;
        const currentUser = users.find(
          (user) => user._id.toString() === owner.toString()
        );
        if (!currentUser) {
          throw new Error(`User not found for reaction owner ${owner}`);
        }
        const totalComments = await commen.countDocuments({
          owner: reaction.owner,
        });
        const totalThankYou = await ThankYou.countDocuments({
          toOwner: reaction.owner,
        });
        const { _id, name, email, avatar } = currentUser;
        return {
          _id,
          link,
          owner,
          reactionId,
          name,
          email,
          text,
          avatar,
          totalComments,
          totalThankYou,
        };
      })
    );
    res.status(201).send(formattedReactions);
  } catch (err) {
    next(err);
  }
};

const getAllArticlesDate = (req, res, next) => {
  Article.findByLink()
    .then((articles) => {
      const article = articles[0];
      res.json(article);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    });
};

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
  const { keyword, title, date, description, source, link, image } = req.body;

  const owner = req.user._id;

  Article.create({
    keyword,
    title,
    description,
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
        throw new ForbiddenError(
          'You do not have permissions to delete this Article'
        );
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
  getAllArticlesDate,
  getAllArticleComments,
  getAllArticleReaction,
};

/* const combinedDocuments = (req, res, next) => {
  Article.find({ link: req.body.link })
    .orFail(() => {
      throw new NotFoundError('Not found Articles');
    })
    .then((Articles) => {
      res.send(Articles);
    })
    .catch((err) => {
      next(err);
    });

    Comment.find({ link: req.body.link })
    .orFail(() => {
      throw new NotFoundError('Not found Comment');
    })
    .then((Articles) => {
      res.send(Articles);
    })
    .catch((err) => {
      next(err);
    });

    Reaction.find({ link: req.body.link })
    .orFail(() => {
      throw new NotFoundError('Not found Reaction');
    })
    .then((Articles) => {
      res.send(Articles);
    })
    .catch((err) => {
      next(err);
    });
}; */
