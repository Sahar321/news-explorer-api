/*eslint-disable*/
const Reaction = require('../models/reaction');
const ConflictError = require('../constant/errors/ConflictError');
const addArticleReaction = (req, res, next) => {
  const { reaction, date, articleId } = req.body;
  const owner = req.user._id;

  Reaction.findOne({ owner, articleId })
    .then((db) => {
      if (db) {
        throw new ConflictError('You have already voted');
      }
      Reaction.create({
        reaction,
        date,
        articleId,
        owner,
      })
        .then((db) => {
          res.send({ db });
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

module.exports = {
  addArticleReaction,
};
